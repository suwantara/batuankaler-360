<script lang="ts">
	import GuideCard from '#lib/components/public/GuideCard.svelte';
	import LocationMap from '#lib/components/public/LocationMap.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SeoHead from '#lib/components/public/SeoHead.svelte';
	import SitePageArticle from '#lib/components/public/SitePageArticle.svelte';
	import VisitInformation from '#lib/components/public/VisitInformation.svelte';
	import ArrowLink from '#lib/components/ui/ArrowLink.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import { SITE_NAME } from '#lib/seo.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.panduan);
	const page = $derived(data.page);
</script>

<SeoHead
	lang={data.lang}
	origin={data.origin}
	title={`${page?.title || pageContent.title} | ${SITE_NAME}`}
	description={page?.description || pageContent.description}
	path="/panduan"
	type="article"
	breadcrumbs={[
		{ name: content.nav[0]?.label ?? 'Beranda', path: '/' },
		{ name: content.nav[5]?.label ?? 'Panduan', path: '/panduan' }
	]}
/>

<PageIntro
	eyebrow={page?.eyebrow || pageContent.eyebrow}
	title={page?.title || pageContent.title}
	description={page?.description || pageContent.description}
/>

{#if data.visitInfo}
	<VisitInformation content={content.visitInfo} data={data.visitInfo} lang={data.lang} compact />
{/if}

<LocationMap content={content.locationMap} lang={data.lang} />

{#if page}
	<SitePageArticle {page} labels={pageContent} lang={data.lang} />
{:else}
	<section class="section section--paper">
		<div class="container-page grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
			<div class="lg:sticky lg:top-28 lg:self-start">
				<p class="eyebrow">{pageContent.guideEyebrow}</p>
				<h2 class="display-xl mt-6 text-navy">{pageContent.guideTitle}</h2>
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
{/if}
