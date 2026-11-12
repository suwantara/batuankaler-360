<script lang="ts">
	import { resolve } from '$app/paths';
	import PanoramaViewer from '#lib/components/tour/PanoramaViewer.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { TourScene } from '#lib/tour/scenes.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const previewScene = $derived({
		id: data.asset.id,
		slug: data.asset.id,
		panorama: {
			src: data.asset.originalPath,
			thumbnail: data.asset.thumbnailPath,
			width: data.asset.width
		},
		initialView: { yaw: 0, pitch: 0, fov: Math.PI / 2 },
		translations: {
			id: {
				title: 'Preview aset panorama',
				description: data.asset.originalPath
			},
			en: {
				title: 'Panorama asset preview',
				description: data.asset.originalPath
			}
		},
		hotspots: []
	} satisfies TourScene);
</script>

<svelte:head>
	<title>Preview Aset — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<nav class="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/media')} class="transition-colors hover:text-heading">Media</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-heading/60">Preview</span>
		</nav>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="eyebrow">Media</p>
				<h1 class="display-lg mt-4 text-heading">Preview aset</h1>
				<p class="mt-2 max-w-xl truncate text-sm text-muted">{data.asset.originalPath}</p>
				<p class="mt-1 text-xs text-muted">
					{data.asset.width}{data.asset.height ? ` × ${data.asset.height}` : ''} px ·
					{data.asset.projection} · {data.asset.processingStatus}
				</p>
			</div>
			<a href={resolve('admin/media')} class="btn btn--outline btn--sm w-fit">
				<Icon name="arrow-left" class="h-3.5 w-3.5" />
				Kembali ke media
			</a>
		</div>
	</header>

	{#if data.asset.processingStatus !== 'processed'}
		<div class="alert alert--warning">
			Aset ini belum berstatus processed. Scene yang menggunakan aset ini tidak dapat
			dipublikasikan.
		</div>
	{/if}

	<div class="bg-navy p-2 sm:p-3">
		<PanoramaViewer scenes={[previewScene]} sceneId={data.asset.id} lang="id" />
	</div>
</div>
