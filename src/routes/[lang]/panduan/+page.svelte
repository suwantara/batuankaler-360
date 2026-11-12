<script lang="ts">
	import GuideCard from '#lib/components/public/GuideCard.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import ArrowLink from '#lib/components/ui/ArrowLink.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.panduan);
</script>

<svelte:head>
	<title>{pageContent.title} — {content.meta.title}</title>
	<meta name="description" content={pageContent.description} />
</svelte:head>

<PageIntro
	eyebrow={pageContent.eyebrow}
	title={pageContent.title}
	description={pageContent.description}
/>

<section class="section section--paper">
	<div class="container-page grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
		<div class="lg:sticky lg:top-28 lg:self-start">
			<p class="eyebrow">{content.home.guide.eyebrow}</p>
			<h2 class="display-xl mt-6 text-navy">{content.home.guide.title}</h2>
			<p class="mt-6 max-w-md text-base leading-relaxed text-body">
				{content.home.guide.body}
			</p>

			<div class="mt-8 max-w-md border-l-2 border-gold-dark/50 bg-ivory px-5 py-5">
				<p class="meta text-gold-dark">{content.home.history.noteLabel}</p>
				<p class="mt-2 text-sm leading-relaxed text-body">{pageContent.notice}</p>
			</div>

			<div class="mt-8">
				<ArrowLink href={localeHref(data.lang, '/tour')} label={content.actions.exploreTour} />
			</div>
		</div>

		<div class="border-b border-charcoal/12">
			{#each content.home.guide.items as item, index (item.title)}
				<GuideCard title={item.title} body={item.body} {index} />
			{/each}
		</div>
	</div>
</section>
