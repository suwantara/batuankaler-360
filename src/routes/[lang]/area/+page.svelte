<script lang="ts">
	import AreaCard from '#lib/components/public/AreaCard.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SitePageIndex from '#lib/components/public/SitePageIndex.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.area);
	const page = $derived(data.page);
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
{:else}
	<section class="section section--paper">
		<div class="container-page">
			<div
				class="flex max-w-3xl items-start gap-4 border-l-2 border-gold-dark/50 bg-ivory px-5 py-5 sm:px-6"
			>
				<span class="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 border border-gold-dark/60"></span>
				<p class="text-sm leading-relaxed text-body">{pageContent.notice}</p>
			</div>

			<div class="mt-12 border-b border-charcoal/12">
				{#each content.home.areas.items as area, index (area.name)}
					<AreaCard
						name={area.name}
						description={area.description}
						{index}
						href={localeHref(data.lang, '/area')}
						tone="light"
					/>
				{/each}
			</div>
		</div>
	</section>
{/if}
