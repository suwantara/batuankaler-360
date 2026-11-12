<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type {
		Hotspot as MarzipanoHotspot,
		Scene as MarzipanoScene,
		View,
		Viewer
	} from 'marzipano';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/index.ts';
	import { createHotspotElement } from '#lib/tour/hotspot-element.ts';
	import type { InformationHotspot, TourScene } from '#lib/tour/scenes.ts';
	import ViewerControl from './ViewerControl.svelte';

	let {
		scenes,
		sceneId,
		lang,
		onNavigate,
		onInfo,
		onCoordinatePick,
		fullscreenTarget,
		pickMode = false,
		compact = false
	}: {
		scenes: TourScene[];
		sceneId: string;
		lang: Locale;
		onNavigate?: (sceneId: string) => void;
		onInfo?: (hotspot: InformationHotspot) => void;
		onCoordinatePick?: (coords: { yaw: number; pitch: number }) => void;
		fullscreenTarget?: HTMLElement | null;
		pickMode?: boolean;
		compact?: boolean;
	} = $props();

	const labels = $derived(dictionary[lang].pages.tour.controls);
	const minFov = Math.PI / 6;
	const maxFov = (100 * Math.PI) / 180;

	let root: HTMLDivElement | undefined = $state();
	let container: HTMLDivElement | undefined = $state();
	let loading = $state(true);
	let error = $state<string | null>(null);
	let fullscreen = $state(false);
	let ready = $state(false);
	let activeSceneId = $state('');
	let showHint = $state(true);

	let viewer: Viewer | null = null;
	let activeView: View | null = null;
	let activeMarzipanoScene: MarzipanoScene | null = null;
	let pickedHotspot: MarzipanoHotspot | null = null;
	let pickStart: { x: number; y: number } | null = null;
	const sceneInstances = new SvelteMap<string, MarzipanoScene>();
	const views = new SvelteMap<string, View>();
	let disposed = false;

	function preloadImage(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve();
			image.onerror = () => reject(new Error(`Failed to load panorama: ${url}`));
			image.src = url;
		});
	}

	async function setup(): Promise<void> {
		if (!container) return;

		loading = true;
		error = null;
		pickedHotspot = null;

		try {
			const initialScene = scenes.find((scene) => scene.id === sceneId) ?? scenes[0];

			await preloadImage(initialScene.panorama.src);
			if (disposed || !container) return;

			const { default: marzipano } = await import('marzipano');
			if (disposed || !container) return;

			viewer?.destroy();
			sceneInstances.clear();
			views.clear();

			const instance = new marzipano.Viewer(container);

			for (const scene of scenes) {
				const source = marzipano.ImageUrlSource.fromString(scene.panorama.src);
				const geometry = new marzipano.EquirectGeometry([{ width: scene.panorama.width }]);
				const limiter = marzipano.RectilinearView.limit.traditional(scene.panorama.width, maxFov);
				const viewInstance = new marzipano.RectilinearView(scene.initialView, limiter);
				const sceneInstance = instance.createScene({
					source,
					geometry,
					view: viewInstance
				});

				views.set(scene.id, viewInstance);
				sceneInstances.set(scene.id, sceneInstance);

				const hotspotContainer = sceneInstance.hotspotContainer();

				if (!pickMode) {
					for (const hotspot of scene.hotspots) {
						const element = createHotspotElement({
							label: hotspot.translations[lang].label,
							type: hotspot.type,
							onClick: () => {
								if (hotspot.type === 'navigation') {
									onNavigate?.(hotspot.targetSceneId);
								} else {
									onInfo?.(hotspot);
								}
							}
						});

						hotspotContainer.createHotspot(element, {
							yaw: hotspot.yaw,
							pitch: hotspot.pitch
						});
					}
				}
			}

			const startScene = sceneInstances.get(initialScene.id);
			if (!startScene) {
				throw new Error(`Missing Marzipano scene: ${initialScene.id}`);
			}

			instance.switchScene(startScene, { transitionDuration: 0 });

			viewer = instance;
			activeMarzipanoScene = startScene;
			activeView = views.get(initialScene.id) ?? null;
			activeSceneId = initialScene.id;
			loading = false;
			ready = true;

			if (pickMode) {
				placePickMarker({
					yaw: initialScene.initialView.yaw,
					pitch: initialScene.initialView.pitch
				});
			}
		} catch (cause) {
			if (disposed) return;

			console.error('Panorama initialization failed', cause);
			error = labels.error;
			loading = false;
			ready = false;
		}
	}

	$effect(() => {
		const targetId = sceneId;

		if (!ready || !viewer || !targetId || targetId === activeSceneId) return;

		const nextScene = sceneInstances.get(targetId);
		if (!nextScene) return;

		viewer.switchScene(nextScene, { transitionDuration: 450 });
		activeSceneId = targetId;
		activeMarzipanoScene = nextScene;
		activeView = views.get(targetId) ?? null;
	});

	function zoom(factor: number): void {
		if (!activeView) return;

		const nextFov = Math.min(Math.max(activeView.fov() * factor, minFov), maxFov);
		activeView.setFov(nextFov);
	}

	function resetView(): void {
		if (!activeMarzipanoScene) return;

		const scene = scenes.find((item) => item.id === activeSceneId);
		if (!scene) return;

		activeMarzipanoScene.lookTo(scene.initialView, 600);
	}

	function placePickMarker(coords: { yaw: number; pitch: number }): void {
		if (!activeMarzipanoScene) return;

		const hotspotContainer = activeMarzipanoScene.hotspotContainer();

		if (pickedHotspot) {
			hotspotContainer.destroyHotspot(pickedHotspot);
			pickedHotspot = null;
		}

		const marker = document.createElement('div');
		marker.className = 'coordinate-pick-marker';
		marker.setAttribute('aria-hidden', 'true');
		pickedHotspot = hotspotContainer.createHotspot(marker, coords);
	}

	function handlePointerDown(event: PointerEvent): void {
		if (pickMode) {
			pickStart = { x: event.clientX, y: event.clientY };
			return;
		}

		showHint = false;
	}

	function handlePointerUp(event: PointerEvent): void {
		if (!pickMode) return;

		const start = pickStart;
		pickStart = null;

		if (!start) return;
		if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
		if (!activeView || !container) return;

		const rect = container.getBoundingClientRect();
		const picked = activeView.screenToCoordinates({
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		});

		if (!Number.isFinite(picked.yaw) || !Number.isFinite(picked.pitch)) return;

		onCoordinatePick?.(picked);
		placePickMarker(picked);
	}

	function handleKeydown(event: KeyboardEvent): void {
		const view = activeView;
		const scene = activeMarzipanoScene;

		if (!view || !scene) return;

		const step = Math.PI / 24;
		const pitch = (offset: number) =>
			Math.max(-Math.PI / 2, Math.min(Math.PI / 2, view.pitch() + offset));

		let handled = true;

		switch (event.key) {
			case 'ArrowLeft':
				scene.lookTo({ yaw: view.yaw() - step, pitch: view.pitch(), fov: view.fov() }, 160);
				break;
			case 'ArrowRight':
				scene.lookTo({ yaw: view.yaw() + step, pitch: view.pitch(), fov: view.fov() }, 160);
				break;
			case 'ArrowUp':
				scene.lookTo({ yaw: view.yaw(), pitch: pitch(step), fov: view.fov() }, 160);
				break;
			case 'ArrowDown':
				scene.lookTo({ yaw: view.yaw(), pitch: pitch(-step), fov: view.fov() }, 160);
				break;
			case '+':
			case '=':
				zoom(0.85);
				break;
			case '-':
			case '_':
				zoom(1.15);
				break;
			case 'r':
			case 'R':
				resetView();
				break;
			default:
				handled = false;
		}

		if (handled) {
			event.preventDefault();
			showHint = false;
		}
	}

	function getFullscreenTarget(): HTMLElement | null {
		return fullscreenTarget ?? root ?? container ?? null;
	}

	async function toggleFullscreen(): Promise<void> {
		const target = getFullscreenTarget();
		if (!target) return;

		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else {
				await target.requestFullscreen();
			}
		} catch (cause) {
			console.error('Fullscreen request failed', cause);
		}
	}

	async function retry(): Promise<void> {
		viewer?.destroy();
		viewer = null;
		activeView = null;
		activeMarzipanoScene = null;
		pickedHotspot = null;
		pickStart = null;
		activeSceneId = '';
		ready = false;
		sceneInstances.clear();
		views.clear();
		await setup();
	}

	onMount(() => {
		const onFullscreenChange = () => {
			fullscreen = document.fullscreenElement === getFullscreenTarget();
		};

		const resizeObserver = new ResizeObserver(() => {
			viewer?.updateSize();
		});

		document.addEventListener('fullscreenchange', onFullscreenChange);
		if (container) resizeObserver.observe(container);

		void setup();

		return () => {
			disposed = true;
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			resizeObserver.disconnect();
			viewer?.destroy();
			viewer = null;
			activeView = null;
			activeMarzipanoScene = null;
			pickedHotspot = null;
			pickStart = null;
			sceneInstances.clear();
			views.clear();
		};
	});
</script>

<div
	bind:this={root}
	class="relative overflow-hidden border border-ivory/15 bg-navy-deep {fullscreen
		? 'h-full border-0'
		: ''}"
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		bind:this={container}
		role="application"
		tabindex="0"
		aria-label={pickMode ? labels.pickHint : labels.keyboardLabel}
		onkeydown={handleKeydown}
		onpointerdown={handlePointerDown}
		onpointerup={handlePointerUp}
		onpointercancel={() => (pickStart = null)}
		class="relative w-full outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-inset {fullscreen
			? 'h-full min-h-0'
			: compact
				? 'h-[22rem] min-h-[280px]'
				: 'h-[58vh] min-h-[420px] sm:h-[66vh] xl:h-[70vh]'} {pickMode ? 'cursor-crosshair' : ''}"
	></div>

	{#if loading}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-navy-deep text-ivory"
		>
			<span class="relative flex h-14 w-14 items-center justify-center">
				<span
					class="absolute inset-0 animate-spin rounded-full border border-ivory/15 border-t-gold"
				></span>
				<Icon name="compass" class="h-6 w-6 text-gold-light/60" />
			</span>
			<p class="text-xs tracking-[0.16em] text-ivory/55 uppercase">{labels.loading}</p>
		</div>
	{/if}

	{#if error}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-navy-deep px-6 text-center text-ivory"
		>
			<Icon name="alert" class="h-8 w-8 text-gold-light/70" />
			<p class="max-w-md text-sm leading-relaxed text-ivory/70">{error}</p>
			<button type="button" onclick={retry} class="btn btn--gold btn--sm">
				{labels.retry}
			</button>
		</div>
	{/if}

	{#if showHint && !pickMode && !loading && !error}
		<div
			class="absolute inset-x-3 bottom-24 z-30 sm:inset-x-auto sm:right-4 sm:bottom-24 sm:left-auto sm:w-80"
		>
			<div class="surface relative p-4 pr-12 shadow-2xl">
				<button
					type="button"
					onclick={() => (showHint = false)}
					aria-label={labels.hintDismiss}
					class="absolute top-1 right-1 flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-charcoal/5 hover:text-navy"
				>
					<Icon name="close" class="h-4 w-4" />
				</button>

				<div class="flex items-start gap-3">
					<Icon name="compass" class="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
					<div>
						<p class="text-sm font-semibold text-navy">{labels.hintTitle}</p>
						<p class="mt-1 text-xs leading-relaxed text-body">{labels.hintDrag}</p>
						<p
							class="mt-2 border-t border-charcoal/10 pt-2 text-[0.7rem] leading-relaxed text-muted"
						>
							{labels.keyboardHint}
						</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4"
	>
		<span
			class="inline-flex items-center gap-1.5 rounded-full border border-ivory/20 bg-charcoal/35 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.18em] text-ivory/70 uppercase backdrop-blur"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true"></span>
			360°
		</span>
	</div>

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent p-4 pt-14"
	>
		<p class="hidden text-[0.6rem] tracking-[0.22em] text-ivory/60 uppercase sm:block">
			{pickMode ? labels.pickHint : labels.gesture}
		</p>

		<div class="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
			<ViewerControl name="minus" label={labels.zoomOut} onclick={() => zoom(0.8)} />
			<ViewerControl name="plus" label={labels.zoomIn} onclick={() => zoom(1.2)} />
			<ViewerControl name="reset" label={labels.reset} onclick={resetView} />
			<ViewerControl
				name={fullscreen ? 'shrink' : 'expand'}
				label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
				onclick={toggleFullscreen}
			/>
		</div>
	</div>
</div>
