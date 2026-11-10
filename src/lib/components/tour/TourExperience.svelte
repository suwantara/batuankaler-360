<script lang="ts">
	import PanoramaViewer from './PanoramaViewer.svelte';
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
	<div class="rounded-2xl border border-dashed border-navy/15 bg-sand/40 px-6 py-10 text-center">
		<h2 class="font-display text-2xl text-navy">{panelLabels.emptyScenes}</h2>
		<p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-charcoal/55">
			{panelLabels.emptyScenesHint}
		</p>
	</div>
{:else}
	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
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
					class="absolute inset-x-4 bottom-20 z-30 rounded-2xl border border-gold-dark/30 bg-ivory/95 p-5 shadow-2xl backdrop-blur sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:max-w-sm"
					role="region"
					aria-live="polite"
					aria-label={panelLabels.info}
				>
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="text-[0.65rem] font-semibold tracking-[0.22em] text-gold-dark uppercase">
								{panelLabels.info}
							</p>
							<h2 class="mt-2 font-display text-2xl text-navy">
								{infoHotspot.translations[lang].title}
							</h2>
						</div>
						<button
							type="button"
							onclick={closeInfo}
							aria-label={panelLabels.closeInfo}
							class="rounded-full border border-navy/15 p-2 text-navy transition hover:border-gold-dark hover:text-gold-dark"
						>
							<svg class="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
								<path
									d="m4 4 8 8M12 4l-8 8"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
								/>
							</svg>
						</button>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-charcoal/75">
						{infoHotspot.translations[lang].body}
					</p>
					<p class="mt-4 border-t border-navy/10 pt-3 text-xs leading-relaxed text-charcoal/50">
						{panelLabels.infoNotice}
					</p>
				</div>
			{/if}
		</div>

		<aside class="flex flex-col gap-4" aria-label={panelLabels.sceneList}>
			<section class="rounded-3xl border border-navy/10 bg-sand/60 p-5">
				<p class="eyebrow">{panelLabels.activeScene}</p>
				<h2 class="mt-2 font-display text-2xl text-navy">{activeTranslation?.title ?? ''}</h2>
				<p class="mt-2 text-sm leading-relaxed text-charcoal/65">
					{activeTranslation?.description ?? ''}
				</p>
			</section>

			<section class="rounded-3xl border border-navy/10 bg-ivory p-3">
				<div class="px-2 pt-1 pb-2">
					<h2 class="text-xs font-semibold tracking-[0.22em] text-navy/60 uppercase">
						{panelLabels.sceneList}
					</h2>
					<p class="mt-1 text-xs text-charcoal/50">{panelLabels.sceneListHint}</p>
				</div>
				<div class="flex flex-col gap-1">
					{#each scenes as scene, index (scene.id)}
						<button
							type="button"
							onclick={() => navigateTo(scene.id)}
							aria-pressed={scene.id === activeSceneId}
							class="group flex items-center gap-3 rounded-2xl p-2 text-left transition-colors {scene.id ===
							activeSceneId
								? 'bg-navy/5'
								: 'hover:bg-navy/5'}"
						>
							<img
								src={scene.panorama.thumbnail}
								alt=""
								class="h-14 w-20 shrink-0 rounded-xl object-cover"
								loading="lazy"
							/>
							<span class="min-w-0">
								<span class="flex items-center gap-2">
									<span
										class="font-display text-base {scene.id === activeSceneId
											? 'text-navy'
											: 'text-navy/70'}"
									>
										{scene.translations[lang].title}
									</span>
									{#if scene.id === activeSceneId}
										<span class="h-1.5 w-1.5 rounded-full bg-gold-dark" aria-hidden="true"></span>
									{/if}
								</span>
								<span class="mt-0.5 block text-xs text-charcoal/45">0{index + 1}</span>
							</span>
						</button>
					{/each}
				</div>
			</section>

			{#if !infoHotspot}
				<p
					class="rounded-2xl border border-dashed border-navy/15 p-4 text-xs leading-relaxed text-charcoal/50"
				>
					{panelLabels.infoEmpty}
				</p>
			{/if}
		</aside>
	</div>
{/if}
