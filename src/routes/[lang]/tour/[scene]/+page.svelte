<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import TourStage from '#lib/components/tour/TourStage.svelte';
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

<TourStage lang={data.lang} scenes={data.scenes} initialSceneId={data.sceneId} {pageContent} />
