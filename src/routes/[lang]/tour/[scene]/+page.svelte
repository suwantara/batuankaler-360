<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import TourExperience from '#lib/components/tour/TourExperience.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.tour);
	const scene = $derived(data.scenes.find((item) => item.id === data.sceneId));
	const sceneTranslation = $derived(scene?.translations[data.lang] ?? pageContent);
</script>

<svelte:head>
	<title>{sceneTranslation.title} — {content.meta.title}</title>
	<meta name="description" content={sceneTranslation.description} />
</svelte:head>

<PageIntro
	eyebrow={pageContent.eyebrow}
	title={sceneTranslation.title}
	description={sceneTranslation.description}
/>

<section class="container-page py-12 sm:py-16">
	<TourExperience lang={data.lang} initialSceneId={data.sceneId} scenes={data.scenes} />

	<div class="mt-6 grid gap-4 sm:grid-cols-3">
		{#each pageContent.tips as tip (tip.title)}
			<div class="rounded-2xl border border-navy/10 bg-ivory p-5">
				<p class="text-sm font-semibold text-navy">{tip.title}</p>
				<p class="mt-2 text-sm leading-relaxed text-charcoal/65">{tip.body}</p>
			</div>
		{/each}
	</div>

	<p class="mt-8 max-w-3xl text-sm leading-relaxed text-charcoal/60">
		{pageContent.notice}
	</p>
</section>
