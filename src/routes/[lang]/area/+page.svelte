<script lang="ts">
	import AreaCard from '#lib/components/public/AreaCard.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SitePageIndex from '#lib/components/public/SitePageIndex.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.area);
	const page = $derived(data.page);
	const hasFallback = $derived(data.areas.some((area) => area.fallbackUsed));
</script>

<svelte:head>
	<title>{page?.title || pageContent.title} — {content.meta.title}</title>
	<meta name="description" content={page?.description || pageContent.description} />
</svelte:head>

<PageIntro
	eyebrow={page?.eyebrow || pageContent.eyebrow}
	title={page?.title || pageContent.title}
	description={page?.description || pageContent.description}
/>

{#if page}
	<SitePageIndex {page} labels={pageContent} lang={data.lang} />
{/if}

<section class="section section--sand">
	<div class="container-page">
		{#if hasFallback}
			<div class="alert alert--info mb-8">{pageContent.fallback}</div>
		{/if}

		{#if data.areas.length === 0}
			<p class="surface surface--sand p-5 text-sm leading-relaxed text-muted">
				{pageContent.empty}
			</p>
		{:else}
			<div class="border-b border-charcoal/12">
				{#each data.areas as area, index (area.id)}
					<AreaCard
						name={area.title}
						description={area.description}
						{index}
						href={localeHref(data.lang, `/area/${area.slug}`)}
						tone="light"
					/>
				{/each}
			</div>
		{/if}

		{#if !page}
			<p class="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
				{pageContent.notice}
			</p>
		{/if}

		<a href={localeHref(data.lang, '/tour')} class="link-arrow mt-8">
			{content.actions.exploreTour}
			<Icon name="arrow-right" class="h-3.5 w-3.5" />
		</a>
	</div>
</section>
