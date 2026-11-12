<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Scene as MarzipanoScene, View, Viewer } from 'marzipano';
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
		onInfo
	}: {
		scenes: TourScene[];
		sceneId: string;
		lang: Locale;
		onNavigate?: (sceneId: string) => void;
		onInfo?: (hotspot: InformationHotspot) => void;
	} = $props();

	const labels = $derived(dictionary[lang].pages.tour.controls);
	const minFov = Math.PI / 6;
	const maxFov = (100 * Math.PI) / 180;

	let container: HTMLDivElement | undefined = $state();
	let loading = $state(true);
	let error = $state<string | null>(null);
	let fullscreen = $state(false);
	let ready = $state(false);
	let activeSceneId = $state('');

	let viewer: Viewer | null = null;
	let activeView: View | null = null;
	let activeMarzipanoScene: MarzipanoScene | null = null;
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

	async function toggleFullscreen(): Promise<void> {
		if (!container) return;

		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else {
				await container.requestFullscreen();
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
		activeSceneId = '';
		ready = false;
		sceneInstances.clear();
		views.clear();
		await setup();
	}

	onMount(() => {
		const onFullscreenChange = () => {
			fullscreen = document.fullscreenElement === container;
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
			sceneInstances.clear();
			views.clear();
		};
	});
</script>

<div class="relative overflow-hidden border border-ivory/15 bg-navy-deep">
	<div
		bind:this={container}
		class="relative h-[58vh] min-h-[420px] w-full sm:h-[66vh] xl:h-[70vh]"
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
		<p class="text-[0.6rem] tracking-[0.22em] text-ivory/60 uppercase">{labels.gesture}</p>

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
