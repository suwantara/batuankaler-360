<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Scene as MarzipanoScene, View, Viewer } from 'marzipano';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/index.ts';
	import { createHotspotElement } from '#lib/tour/hotspot-element.ts';
	import type { InformationHotspot, TourScene } from '#lib/tour/scenes.ts';

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

<div class="relative overflow-hidden rounded-[2rem] border border-navy/10 bg-navy">
	<div bind:this={container} class="relative h-[60vh] min-h-[420px] w-full sm:h-[68vh]"></div>

	{#if loading}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-navy text-ivory"
		>
			<span class="h-10 w-10 animate-spin rounded-full border-2 border-ivory/20 border-t-gold"
			></span>
			<p class="text-sm text-ivory/70">{labels.loading}</p>
		</div>
	{/if}

	{#if error}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-navy px-6 text-center text-ivory"
		>
			<p class="max-w-md text-sm text-ivory/80">{error}</p>
			<button
				type="button"
				onclick={retry}
				class="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:bg-gold/90"
			>
				{labels.retry}
			</button>
		</div>
	{/if}

	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 bg-gradient-to-t from-charcoal/75 to-transparent p-4"
	>
		<p class="text-xs tracking-[0.2em] text-ivory/70 uppercase">360°</p>

		<div class="pointer-events-auto flex items-center gap-2">
			<button
				type="button"
				onclick={() => zoom(0.8)}
				aria-label={labels.zoomOut}
				title={labels.zoomOut}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-charcoal/40 text-lg text-ivory backdrop-blur transition hover:border-gold-light/60 hover:text-gold-light"
			>
				−
			</button>
			<button
				type="button"
				onclick={() => zoom(1.2)}
				aria-label={labels.zoomIn}
				title={labels.zoomIn}
				class="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-charcoal/40 text-lg text-ivory backdrop-blur transition hover:border-gold-light/60 hover:text-gold-light"
			>
				+
			</button>
			<button
				type="button"
				onclick={resetView}
				aria-label={labels.reset}
				title={labels.reset}
				class="flex h-10 items-center justify-center rounded-full border border-ivory/20 bg-charcoal/40 px-3 text-xs font-semibold text-ivory backdrop-blur transition hover:border-gold-light/60 hover:text-gold-light"
			>
				Reset
			</button>
			<button
				type="button"
				onclick={toggleFullscreen}
				aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
				title={fullscreen ? labels.exitFullscreen : labels.fullscreen}
				class="flex h-10 items-center justify-center rounded-full border border-ivory/20 bg-charcoal/40 px-3 text-xs font-semibold text-ivory backdrop-blur transition hover:border-gold-light/60 hover:text-gold-light"
			>
				{fullscreen ? labels.exitFullscreen : labels.fullscreen}
			</button>
		</div>
	</div>
</div>
