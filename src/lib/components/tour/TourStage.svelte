<script lang="ts">
	import TourExperience from './TourExperience.svelte';
	import type { SiteDictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { TourScene } from '#lib/tour/scenes.ts';

	let {
		lang,
		scenes,
		initialSceneId,
		pageContent
	}: {
		lang: Locale;
		scenes: TourScene[];
		initialSceneId?: string;
		pageContent: SiteDictionary['pages']['tour'];
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

		<p class="mt-6 max-w-3xl text-xs leading-relaxed text-ivory/55">
			{pageContent.notice}
		</p>
	</div>
</section>
