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
	const scene = $derived(data.scenes.find((item) => item.id === data.sceneId));
	const sceneTranslation = $derived(scene?.translations[data.lang] ?? pageContent);
	const scenePath = $derived(scene ? `/tour/${scene.slug}` : '/tour');
</script>

<SeoHead
	lang={data.lang}
	origin={data.origin}
	title={`${sceneTranslation.title} | ${SITE_NAME}`}
	description={sceneTranslation.description}
	path={scenePath}
	image={scene?.panorama.thumbnail}
	type="article"
	breadcrumbs={[
		{ name: content.nav[0]?.label ?? 'Beranda', path: '/' },
		{ name: content.nav[1]?.label ?? 'Virtual Tour', path: '/tour' },
		{ name: sceneTranslation.title, path: scenePath }
	]}
/>

<PageIntro
	eyebrow={pageContent.eyebrow}
	title={sceneTranslation.title}
	description={sceneTranslation.description}
/>

<TourStage
	lang={data.lang}
	scenes={data.scenes}
	initialSceneId={data.sceneId}
	areas={content.home.areas.items}
	{pageContent}
/>
