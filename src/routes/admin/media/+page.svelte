<script lang="ts">
	import { resolve } from '$app/paths';
	import { emptyPanoramaAssetFormValues } from '#lib/schemas/scene.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? emptyPanoramaAssetFormValues);
	const inputClass =
		'mt-2 w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold-dark focus:ring-2 focus:ring-gold/20';
</script>

<svelte:head>
	<title>Media Panorama — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="text-xs font-semibold tracking-[0.24em] text-gold-dark uppercase">Media</p>
			<h1 class="mt-2 font-display text-3xl text-navy sm:text-4xl">Aset panorama</h1>
			<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
				Upload panorama equirectangular dan kelola metadata aset. File disimpan di storage lokal
				server.
			</p>
		</div>
		<a
			href={resolve('admin/media/upload')}
			class="w-fit rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
		>
			Upload panorama
		</a>
	</header>

	{#if form?.success}
		<div
			class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
			role="status"
		>
			Aset panorama berhasil disimpan.
		</div>
	{/if}

	{#if form?.errors?.form}
		<div
			class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
			{form.errors.form}
		</div>
	{/if}

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Tambah metadata aset</h2>
		<form method="POST" action="?/metadata" class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block sm:col-span-2">
				<span class="text-sm font-medium text-navy">Path panorama asli</span>
				<input
					type="text"
					name="originalPath"
					value={values.originalPath}
					required
					class={inputClass}
					placeholder="/images/panoramas/scene.jpg"
				/>
				{#if form?.errors?.originalPath}<p class="mt-1 text-xs text-red-600">
						{form.errors.originalPath}
					</p>{/if}
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Path thumbnail</span>
				<input
					type="text"
					name="thumbnailPath"
					value={values.thumbnailPath}
					required
					class={inputClass}
					placeholder="/images/panoramas/scene-thumb.jpg"
				/>
				{#if form?.errors?.thumbnailPath}<p class="mt-1 text-xs text-red-600">
						{form.errors.thumbnailPath}
					</p>{/if}
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Path preview (opsional)</span>
				<input
					type="text"
					name="previewPath"
					value={values.previewPath}
					class={inputClass}
					placeholder="/images/panoramas/scene-preview.jpg"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Proyeksi</span>
				<input
					type="text"
					name="projection"
					value={values.projection}
					required
					class={inputClass}
				/>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Status pemrosesan</span>
				<select name="processingStatus" class={inputClass}>
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
				<span class="text-sm font-medium text-navy">Lebar (px)</span>
				<input
					type="number"
					name="width"
					value={values.width}
					min="1"
					max="20000"
					required
					class={inputClass}
				/>
				{#if form?.errors?.width}<p class="mt-1 text-xs text-red-600">{form.errors.width}</p>{/if}
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Tinggi (px, opsional)</span>
				<input
					type="number"
					name="height"
					value={values.height}
					min="1"
					max="20000"
					class={inputClass}
				/>
				{#if form?.errors?.height}<p class="mt-1 text-xs text-red-600">{form.errors.height}</p>{/if}
			</label>

			<div class="sm:col-span-2">
				<button
					type="submit"
					class="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
				>
					Simpan aset
				</button>
			</div>
		</form>
	</section>

	<section class="rounded-2xl border border-navy/10 bg-ivory">
		<div class="border-b border-navy/10 px-5 py-4">
			<h2 class="font-display text-xl text-navy">Daftar aset</h2>
		</div>

		{#if data.assets.length === 0}
			<p class="px-5 py-8 text-sm text-charcoal/50">Belum ada aset panorama.</p>
		{:else}
			<div class="divide-y divide-navy/10">
				{#each data.assets as asset (asset.id)}
					<div
						class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
						data-testid="asset-row"
					>
						<div class="flex min-w-0 items-center gap-4">
							<img
								src={asset.thumbnailPath}
								alt=""
								class="h-14 w-20 shrink-0 rounded-xl object-cover"
								loading="lazy"
							/>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-navy">{asset.originalPath}</p>
								<p class="mt-0.5 text-xs text-charcoal/45">
									{asset.width}{asset.height ? ` × ${asset.height}` : ''} px · {asset.projection}
								</p>
							</div>
						</div>
						<div class="flex flex-wrap items-center gap-3">
							<span
								class="w-fit rounded-full bg-navy/5 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-navy/60 uppercase"
							>
								{asset.processingStatus}
							</span>
							<a
								href={resolve(`admin/media/${asset.id}`)}
								class="text-xs font-semibold text-navy hover:text-gold-dark"
							>
								Preview
							</a>
							<form
								method="POST"
								action="?/delete"
								onsubmit={(event) => {
									if (!confirm('Hapus aset panorama ini?')) {
										event.preventDefault();
									}
								}}
							>
								<input type="hidden" name="assetId" value={asset.id} />
								<button
									type="submit"
									data-testid="delete-asset"
									class="text-xs font-semibold text-red-700 hover:text-red-900"
								>
									Hapus
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
