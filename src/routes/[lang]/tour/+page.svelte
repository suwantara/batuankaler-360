<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SeoHead from '#lib/components/public/SeoHead.svelte';
	import TourStage from '#lib/components/tour/TourStage.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { SITE_NAME } from '#lib/seo.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.tour);
</script>

<SeoHead
	lang={data.lang}
	origin={data.origin}
	title={`${pageContent.title} | ${SITE_NAME}`}
	description={pageContent.description}
	path="/tour"
	breadcrumbs={[
		{ name: content.nav[0]?.label ?? 'Beranda', path: '/' },
		{ name: content.nav[1]?.label ?? 'Virtual Tour', path: '/tour' }
	]}
/>

<PageIntro
	eyebrow={pageContent.eyebrow}
	title={pageContent.title}
	description={pageContent.description}
/>

<TourStage lang={data.lang} scenes={data.scenes} areas={content.home.areas.items} {pageContent} />
