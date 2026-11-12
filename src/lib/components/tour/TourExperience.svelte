<script lang="ts">
	import PanoramaViewer from './PanoramaViewer.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { InformationHotspot, TourScene } from '#lib/tour/scenes.ts';

	let {
		lang,
		initialSceneId,
		scenes
	}: { lang: Locale; initialSceneId?: string; scenes: TourScene[] } = $props();

	const content = $derived(dictionary[lang]);
	const panelLabels = $derived(content.pages.tour.panel);

	function resolveInitialSceneId(): string {
		return scenes.find((scene) => scene.id === initialSceneId)?.id ?? scenes[0]?.id ?? '';
	}

	let activeSceneId = $state(resolveInitialSceneId());
	let infoHotspot = $state<InformationHotspot | null>(null);

	const activeScene = $derived(scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0]);
	const activeTranslation = $derived(activeScene?.translations[lang]);

	function navigateTo(sceneId: string): void {
		if (!scenes.some((scene) => scene.id === sceneId)) return;

		activeSceneId = sceneId;
		infoHotspot = null;
	}

	function showInfo(hotspot: InformationHotspot): void {
		infoHotspot = hotspot;
	}

	function closeInfo(): void {
		infoHotspot = null;
	}
</script>

{#if scenes.length === 0}
	<div class="border border-dashed border-ivory/20 px-6 py-14 text-center">
		<Icon name="compass" class="mx-auto h-8 w-8 text-gold-light/45" />
		<h2 class="display-md mt-5 text-ivory">{panelLabels.emptyScenes}</h2>
		<p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/55">
			{panelLabels.emptyScenesHint}
		</p>
	</div>
{:else}
	<div class="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ivory/60">
		<span class="inline-flex items-center gap-2">
			<span
				class="flex h-5 w-5 items-center justify-center rounded-full bg-ivory font-display text-[0.65rem] text-ink italic"
				aria-hidden="true">i</span
			>
			{panelLabels.legendInfo}
		</span>
		<span class="inline-flex items-center gap-2">
			<span
				class="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.7rem] font-bold text-ink"
				aria-hidden="true">→</span
			>
			{panelLabels.legendNavigate}
		</span>
		<span class="inline-flex items-center gap-2">
			<Icon name="compass" class="h-4 w-4 text-gold-light/70" />
			{panelLabels.legendDrag}
		</span>
	</div>

	<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
		<div class="relative min-w-0">
			<PanoramaViewer
				{scenes}
				sceneId={activeSceneId}
				{lang}
				onNavigate={navigateTo}
				onInfo={showInfo}
			/>

			{#if infoHotspot}
				<div
					class="surface absolute inset-x-3 bottom-24 z-30 p-5 shadow-2xl sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:max-w-sm"
					role="region"
					aria-live="polite"
					aria-label={panelLabels.info}
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="meta text-gold-dark">{panelLabels.info}</p>
							<h2 class="title-sm mt-2 text-navy">
								{infoHotspot.translations[lang].title}
							</h2>
						</div>
						<button
							type="button"
							onclick={closeInfo}
							aria-label={panelLabels.closeInfo}
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-navy transition-colors hover:border-gold-dark hover:text-gold-dark"
						>
							<Icon name="close" class="h-4 w-4" />
						</button>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-body">
						{infoHotspot.translations[lang].body}
					</p>
					<p class="mt-4 border-t border-charcoal/10 pt-3 text-xs leading-relaxed text-muted">
						{panelLabels.infoNotice}
					</p>
				</div>
			{/if}
		</div>

		<aside class="flex flex-col gap-4" aria-label={panelLabels.sceneList}>
			<section class="surface surface--dark p-5">
				<p class="meta text-[0.6rem] text-gold-light/55">{panelLabels.activeScene}</p>
				<h2 class="display-md mt-2 text-ivory">{activeTranslation?.title ?? ''}</h2>
				<p class="mt-3 text-sm leading-relaxed text-ivory/55">
					{activeTranslation?.description ?? ''}
				</p>
			</section>

			<section class="surface surface--dark p-3">
				<div class="px-2 pt-1 pb-3">
					<h2 class="meta text-[0.6rem] text-ivory/55">{panelLabels.sceneList}</h2>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						{panelLabels.sceneListHint}
					</p>
				</div>
				<div class="flex flex-col">
					{#each scenes as scene, index (scene.id)}
						<button
							type="button"
							onclick={() => navigateTo(scene.id)}
							aria-pressed={scene.id === activeSceneId}
							class="group relative flex items-center gap-3 border-t border-ivory/10 px-2 py-3 text-left transition-colors {scene.id ===
							activeSceneId
								? 'bg-gold/10'
								: 'hover:bg-ivory/[0.04]'}"
						>
							<span
								class="absolute top-1/2 left-0 h-6 w-px -translate-y-1/2 bg-gold transition-opacity {scene.id ===
								activeSceneId
									? 'opacity-100'
									: 'opacity-0'}"
								aria-hidden="true"
							></span>
							<img
								src={scene.panorama.thumbnail}
								alt=""
								class="h-12 w-16 shrink-0 border border-ivory/10 object-cover"
								loading="lazy"
							/>
							<span class="min-w-0">
								<span
									class="block truncate font-display text-base leading-snug transition-colors {scene.id ===
									activeSceneId
										? 'text-gold-light'
										: 'text-ivory/70 group-hover:text-ivory'}"
								>
									{scene.translations[lang].title}
								</span>
								<span class="mt-1 block text-[0.6rem] tracking-[0.16em] text-ivory/55 uppercase">
									0{index + 1}
								</span>
							</span>
						</button>
					{/each}
				</div>
			</section>

			{#if !infoHotspot}
				<p class="border border-dashed border-ivory/15 p-4 text-xs leading-relaxed text-ivory/55">
					{panelLabels.infoEmpty}
				</p>
			{/if}
		</aside>
	</div>
{/if}
