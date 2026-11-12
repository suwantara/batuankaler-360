<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ConfirmDeleteForm from '#lib/components/admin/ConfirmDeleteForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { emptyPanoramaAssetFormValues } from '#lib/schemas/scene.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? emptyPanoramaAssetFormValues);
	const uploadSucceeded = $derived(page.url.searchParams.get('uploaded') === '1');
</script>

<svelte:head>
	<title>Media Panorama — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Media</p>
			<h1 class="display-lg mt-4 text-heading">Aset panorama</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Upload panorama equirectangular dan kelola metadata aset. File disimpan di storage lokal
				server.
			</p>
		</div>
		<a href={resolve('admin/media/upload')} class="btn btn--primary btn--sm w-fit">
			<Icon name="upload" class="h-3.5 w-3.5" />
			Upload panorama
		</a>
	</header>

	{#if form?.success || uploadSucceeded}
		<div class="alert alert--success" role="status">
			{uploadSucceeded ? 'Aset panorama berhasil diunggah.' : 'Aset panorama berhasil disimpan.'}
		</div>
	{/if}

	{#if form?.errors?.form}
		<div class="alert alert--error" role="alert">{form.errors.form}</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
		<section class="surface p-5 sm:p-6">
			<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<h2 class="title-sm text-heading">Tambah metadata aset</h2>
			</div>

			<form method="POST" action="?/metadata" class="mt-5 grid gap-5 sm:grid-cols-2">
				<label class="block sm:col-span-2">
					<span class="field-label">Path panorama asli</span>
					<input
						type="text"
						name="originalPath"
						value={values.originalPath}
						required
						class="field-input"
						placeholder="/images/panoramas/scene.jpg"
					/>
					{#if form?.errors?.originalPath}<p class="field-error">{form.errors.originalPath}</p>{/if}
				</label>

				<label class="block">
					<span class="field-label">Path thumbnail</span>
					<input
						type="text"
						name="thumbnailPath"
						value={values.thumbnailPath}
						required
						class="field-input"
						placeholder="/images/panoramas/scene-thumb.jpg"
					/>
					{#if form?.errors?.thumbnailPath}<p class="field-error">
							{form.errors.thumbnailPath}
						</p>{/if}
				</label>

				<label class="block">
					<span class="field-label">Path preview (opsional)</span>
					<input
						type="text"
						name="previewPath"
						value={values.previewPath}
						class="field-input"
						placeholder="/images/panoramas/scene-preview.jpg"
					/>
				</label>

				<label class="block">
					<span class="field-label">Proyeksi</span>
					<input
						type="text"
						name="projection"
						value={values.projection}
						required
						class="field-input"
					/>
				</label>

				<label class="block">
					<span class="field-label">Status pemrosesan</span>
					<select name="processingStatus" class="field-input">
						<option value="uploaded" selected={values.processingStatus === 'uploaded'}
							>Uploaded</option
						>
						<option value="processed" selected={values.processingStatus === 'processed'}
							>Processed</option
						>
						<option value="failed" selected={values.processingStatus === 'failed'}>Failed</option>
					</select>
				</label>

				<label class="block">
					<span class="field-label">Lebar (px)</span>
					<input
						type="number"
						name="width"
						value={values.width}
						min="1"
						max="20000"
						required
						class="field-input"
					/>
					{#if form?.errors?.width}<p class="field-error">{form.errors.width}</p>{/if}
				</label>

				<label class="block">
					<span class="field-label">Tinggi (px, opsional)</span>
					<input
						type="number"
						name="height"
						value={values.height}
						min="1"
						max="20000"
						class="field-input"
					/>
					{#if form?.errors?.height}<p class="field-error">{form.errors.height}</p>{/if}
				</label>

				<div class="border-t border-charcoal/10 pt-5 sm:col-span-2">
					<button type="submit" class="btn btn--primary">
						Simpan aset
						<Icon name="check" class="h-4 w-4" />
					</button>
				</div>
			</form>
		</section>

		<aside class="surface surface--dark h-fit p-6">
			<p class="meta text-[0.58rem] text-gold-light/60">Panduan singkat</p>
			<div class="mt-5 flex flex-col gap-5">
				<div>
					<p class="text-sm font-semibold text-ivory">Metadata bukan upload</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						Form ini mencatat referensi file yang sudah tersedia. Untuk mengunggah file baru,
						gunakan halaman upload.
					</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<p class="text-sm font-semibold text-ivory">Rasio panorama</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						Gunakan panorama equirectangular dengan rasio 2:1 dan aset berstatus processed sebelum
						dipublikasikan.
					</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<a href={resolve('admin/media/upload')} class="link-arrow link-arrow--light">
						Upload panorama
						<Icon name="upload" class="h-3.5 w-3.5" />
					</a>
				</div>
			</div>
		</aside>
	</div>

	<section class="surface overflow-hidden">
		<div class="flex items-center justify-between gap-4 border-b border-charcoal/10 px-5 py-4">
			<h2 class="title-sm text-heading">Daftar aset</h2>
			<span class="badge badge--quiet">{data.assets.length} aset</span>
		</div>

		{#if data.assets.length === 0}
			<div class="flex flex-col items-center px-5 py-14 text-center">
				<Icon name="image" class="h-7 w-7 text-heading/20" />
				<p class="mt-4 text-sm text-muted">Belum ada aset panorama.</p>
				<a href={resolve('admin/media/upload')} class="btn btn--outline btn--sm mt-5">
					Upload panorama pertama
				</a>
			</div>
		{:else}
			<div class="divide-y divide-charcoal/10">
				{#each data.assets as asset (asset.id)}
					<div
						class="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
						data-testid="asset-row"
					>
						<div class="flex min-w-0 items-center gap-4">
							<img
								src={asset.thumbnailPath}
								alt=""
								class="h-14 w-20 shrink-0 border border-charcoal/10 object-cover"
								loading="lazy"
							/>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-heading">{asset.originalPath}</p>
								<p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
									<span>{asset.width}{asset.height ? ` × ${asset.height}` : ''} px</span>
									<span class="h-1 w-1 rounded-full bg-charcoal/20" aria-hidden="true"></span>
									<span>{asset.projection}</span>
								</p>
							</div>
						</div>
						<div class="flex flex-wrap items-center gap-3 sm:justify-end">
							<span class="badge badge--quiet">{asset.processingStatus}</span>
							<a
								href={resolve(`admin/media/${asset.id}`)}
								class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
							>
								Preview
								<Icon name="eye" class="h-3.5 w-3.5" />
							</a>
							<ConfirmDeleteForm
								action="?/delete"
								fields={{ assetId: asset.id }}
								buttonLabel="Hapus"
								buttonClass="inline-flex items-center gap-1.5 text-xs font-semibold text-danger transition-colors hover:text-danger/70"
								buttonTestId="delete-asset"
								confirmTitle="Hapus aset panorama?"
								confirmDescription="Aset dan file panorama akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
