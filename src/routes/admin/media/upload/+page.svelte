<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Upload Panorama — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<nav class="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/media')} class="transition-colors hover:text-heading">Media</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-heading/60">Upload</span>
		</nav>
		<div>
			<p class="eyebrow">Media baru</p>
			<h1 class="display-lg mt-4 text-heading">Upload panorama</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Unggah panorama equirectangular beserta thumbnail dan preview opsional. File disimpan di
				storage lokal server.
			</p>
		</div>
	</header>

	{#if form?.message}
		<div class="alert alert--error" role="alert">{form.message}</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
		<form
			method="POST"
			enctype="multipart/form-data"
			class="surface flex flex-col gap-6 p-5 sm:p-6"
		>
			<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<h2 class="title-sm text-heading">Berkas panorama</h2>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<label class="block sm:col-span-2">
					<span class="field-label">Panorama asli</span>
					<input
						type="file"
						name="original"
						accept=".jpg,.jpeg,.png,.webp"
						required
						class="field-input"
					/>
					<span class="field-help">
						{ALLOWED_IMAGE_LABEL}, rasio 2:1, lebar minimal 2000px, maksimal {Math.round(
							UPLOAD_LIMITS.original / (1024 * 1024)
						)} MB.
					</span>
				</label>

				<label class="block">
					<span class="field-label">Thumbnail</span>
					<input
						type="file"
						name="thumbnail"
						accept=".jpg,.jpeg,.png,.webp"
						required
						class="field-input"
					/>
					<span class="field-help">
						Maksimal {Math.round(UPLOAD_LIMITS.thumbnail / (1024 * 1024))} MB.
					</span>
				</label>

				<label class="block">
					<span class="field-label">Preview (opsional)</span>
					<input type="file" name="preview" accept=".jpg,.jpeg,.png,.webp" class="field-input" />
					<span class="field-help">
						Maksimal {Math.round(UPLOAD_LIMITS.preview / (1024 * 1024))} MB.
					</span>
				</label>

				<label class="block sm:col-span-2">
					<span class="field-label">Proyeksi</span>
					<input
						type="text"
						name="projection"
						value="equirectangular"
						required
						class="field-input"
					/>
				</label>
			</div>

			<div class="flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-5">
				<button type="submit" class="btn btn--primary">
					Unggah aset
					<Icon name="upload" class="h-4 w-4" />
				</button>
				<a
					href={resolve('admin/media')}
					class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-heading"
				>
					<Icon name="arrow-left" class="h-3.5 w-3.5" />
					Batal
				</a>
			</div>
		</form>

		<aside class="surface surface--dark h-fit p-6">
			<p class="meta text-[0.58rem] text-gold-light/60">Ketentuan upload</p>
			<div class="mt-5 flex flex-col gap-5">
				<div>
					<p class="text-sm font-semibold text-ivory">Format</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">{ALLOWED_IMAGE_LABEL}.</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<p class="text-sm font-semibold text-ivory">Rasio &amp; resolusi</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						Panorama equirectangular 2:1 dengan lebar minimal 2000px. Gunakan thumbnail terpisah
						agar daftar scene tetap ringan.
					</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<p class="text-sm font-semibold text-ivory">Validasi</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						File divalidasi berdasarkan MIME, ekstensi, dimensi, dan ukuran. Nama file tidak
						digunakan langsung sebagai path penyimpanan.
					</p>
				</div>
			</div>
		</aside>
	</div>
</div>
