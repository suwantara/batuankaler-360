<script lang="ts">
	import TourExperience from './TourExperience.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { SiteDictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { TourScene } from '#lib/tour/scenes.ts';

	let {
		lang,
		scenes,
		initialSceneId,
		pageContent,
		areas
	}: {
		lang: Locale;
		scenes: TourScene[];
		initialSceneId?: string;
		pageContent: SiteDictionary['pages']['tour'];
		areas: SiteDictionary['home']['areas']['items'];
	} = $props();
</script>

<section class="dark-surface section section--tight relative overflow-hidden">
	<div
		class="pointer-events-none absolute -top-24 right-0 hidden font-display text-[22rem] leading-none text-ivory/[0.025] select-none lg:block"
		aria-hidden="true"
	>
		360
	</div>

	<div class="container-page relative">
		<TourExperience {lang} {scenes} {initialSceneId} />

		<div class="mt-10 grid border-y border-ivory/10 sm:grid-cols-3">
			{#each pageContent.tips as tip, index (tip.title)}
				<div
					class="border-b border-ivory/10 py-6 sm:border-r sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
				>
					<p class="meta text-[0.6rem] text-gold-light/60">0{index + 1}</p>
					<p class="mt-2 font-display text-xl text-ivory">{tip.title}</p>
					<p class="mt-2 max-w-xs text-sm leading-relaxed text-ivory/60">{tip.body}</p>
				</div>
			{/each}
		</div>

		<details class="group mt-8 border-t border-ivory/10 pt-5">
			<summary
				class="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
			>
				<div>
					<p class="meta text-[0.65rem] text-gold-light/60">{pageContent.glossary.title}</p>
					<p class="mt-1 text-xs leading-relaxed text-ivory/55">{pageContent.glossary.hint}</p>
				</div>
				<Icon
					name="chevron-down"
					class="h-4 w-4 shrink-0 text-gold-light/60 transition-transform group-open:rotate-180"
				/>
			</summary>

			<dl class="mt-5 grid gap-5 sm:grid-cols-3">
				{#each areas as area (area.name)}
					<div class="border-t border-ivory/10 pt-4">
						<dt class="font-display text-lg text-ivory">{area.name}</dt>
						<dd class="mt-2 text-xs leading-relaxed text-ivory/55">{area.description}</dd>
					</div>
				{/each}
			</dl>

			<p class="mt-4 text-xs leading-relaxed text-ivory/55">{pageContent.glossary.note}</p>
		</details>

		<p class="mt-6 max-w-3xl text-xs leading-relaxed text-ivory/55">
			{pageContent.notice}
		</p>
	</div>
</section>
