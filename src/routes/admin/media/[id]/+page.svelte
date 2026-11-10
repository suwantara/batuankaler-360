<script lang="ts">
	import { resolve } from '$app/paths';
	import PanoramaViewer from '#lib/components/tour/PanoramaViewer.svelte';
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
		<nav class="text-xs text-charcoal/45" aria-label="Breadcrumb">
			<a href={resolve('admin/media')} class="hover:text-navy">Media</a>
			<span aria-hidden="true"> / </span>
			<span>Preview</span>
		</nav>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="font-display text-3xl text-navy sm:text-4xl">Preview aset</h1>
				<p class="mt-2 text-sm break-all text-charcoal/50">{data.asset.originalPath}</p>
				<p class="mt-1 text-xs text-charcoal/40">
					{data.asset.width}{data.asset.height ? ` × ${data.asset.height}` : ''} px ·
					{data.asset.projection} · {data.asset.processingStatus}
				</p>
			</div>
			<a
				href={resolve('admin/media')}
				class="w-fit rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition hover:border-gold-dark hover:text-gold-dark"
			>
				Kembali ke media
			</a>
		</div>
	</header>

	{#if data.asset.processingStatus !== 'processed'}
		<div class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
			Aset ini belum berstatus processed. Scene yang menggunakan aset ini tidak dapat
			dipublikasikan.
		</div>
	{/if}

	<PanoramaViewer scenes={[previewScene]} sceneId={data.asset.id} lang="id" />
</div>
