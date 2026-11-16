<script lang="ts">
	import { resolve } from '$app/paths';
	import PanoramaViewer from '#lib/components/tour/PanoramaViewer.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';
	import type { TourScene } from '#lib/tour/scenes.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const asset = $derived(form?.asset ?? data.asset);
	const thumbnailLimit = Math.round(UPLOAD_LIMITS.thumbnail / (1024 * 1024));

	const previewScene = $derived({
		id: asset.id,
		slug: asset.id,
		panorama: {
			src: asset.originalPath,
			thumbnail: asset.thumbnailPath,
			width: asset.width
		},
		initialView: { yaw: 0, pitch: 0, fov: Math.PI / 2 },
		translations: {
			id: {
				title: 'Preview aset panorama',
				description: asset.originalPath
			},
			en: {
				title: 'Panorama asset preview',
				description: asset.originalPath
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
				<p class="mt-2 max-w-xl truncate text-sm text-muted">{asset.originalPath}</p>
				<p class="mt-1 text-xs text-muted">
					{asset.width}{asset.height ? ` × ${asset.height}` : ''} px ·
					{asset.projection} · {asset.processingStatus}
				</p>
			</div>
			<a href={resolve('admin/media')} class="btn btn--outline btn--sm w-fit">
				<Icon name="arrow-left" class="h-3.5 w-3.5" />
				Kembali ke media
			</a>
		</div>
	</header>

	{#if asset.processingStatus !== 'processed'}
		<div class="alert alert--warning">
			Aset ini belum berstatus processed. Scene yang menggunakan aset ini tidak dapat
			dipublikasikan.
		</div>
	{/if}

	{#if form?.success}
		<div class="alert alert--success" role="status">Thumbnail panorama berhasil diperbarui.</div>
	{/if}

	<section id="thumbnail" class="surface scroll-mt-24 p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<div>
				<h2 class="title-sm text-heading">Thumbnail panorama</h2>
				<p class="field-help">Gambar kecil yang tampil di daftar scene dan navigasi tur.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-[14rem_1fr] sm:items-start">
			<img
				src={asset.thumbnailPath}
				alt="Thumbnail saat ini"
				class="aspect-[2/1] w-full border border-charcoal/10 bg-sand object-cover"
			/>

			<form
				method="POST"
				action="?/updateThumbnail"
				enctype="multipart/form-data"
				class="flex flex-col gap-4"
			>
				<label class="block">
					<span class="field-label">File thumbnail baru</span>
					<input
						type="file"
						name="thumbnail"
						accept=".jpg,.jpeg,.png,.webp"
						required
						class="field-input"
					/>
					<span class="field-help">
						{ALLOWED_IMAGE_LABEL}, maksimal {thumbnailLimit} MB. Rasio 2:1 direkomendasikan, misalnya
						480 × 240 px.
					</span>
				</label>

				{#if form?.thumbnailError}
					<p class="field-error" role="alert">{form.thumbnailError}</p>
				{/if}

				<div>
					<button type="submit" class="btn btn--primary btn--sm">
						Simpan thumbnail
						<Icon name="check" class="h-3.5 w-3.5" />
					</button>
				</div>
			</form>
		</div>
	</section>

	<div class="bg-navy p-2 sm:p-3">
		<PanoramaViewer scenes={[previewScene]} sceneId={asset.id} lang="id" />
	</div>
</div>
