<script lang="ts">
	import { resolve } from '$app/paths';
	import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	const inputClass =
		'mt-2 w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-navy/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-navy focus:border-gold-dark focus:ring-2 focus:ring-gold/20';
</script>

<svelte:head>
	<title>Upload Panorama — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header>
		<nav class="text-xs text-charcoal/45" aria-label="Breadcrumb">
			<a href={resolve('admin/media')} class="hover:text-navy">Media</a>
			<span aria-hidden="true"> / </span>
			<span>Upload</span>
		</nav>
		<h1 class="mt-3 font-display text-3xl text-navy sm:text-4xl">Upload panorama</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
			Unggah panorama equirectangular beserta thumbnail dan preview opsional. File disimpan di
			storage lokal server.
		</p>
	</header>

	{#if form?.message}
		<div
			class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-6 rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6"
	>
		<div class="grid gap-5 sm:grid-cols-2">
			<label class="block sm:col-span-2">
				<span class="text-sm font-medium text-navy">Panorama asli</span>
				<input
					type="file"
					name="original"
					accept=".jpg,.jpeg,.png,.webp"
					required
					class={inputClass}
				/>
				<span class="mt-1 block text-xs text-charcoal/45">
					{ALLOWED_IMAGE_LABEL}, rasio 2:1, lebar minimal 2000px, maksimal {Math.round(
						UPLOAD_LIMITS.original / (1024 * 1024)
					)} MB.
				</span>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Thumbnail</span>
				<input
					type="file"
					name="thumbnail"
					accept=".jpg,.jpeg,.png,.webp"
					required
					class={inputClass}
				/>
				<span class="mt-1 block text-xs text-charcoal/45">
					Maksimal {Math.round(UPLOAD_LIMITS.thumbnail / (1024 * 1024))} MB.
				</span>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Preview (opsional)</span>
				<input type="file" name="preview" accept=".jpg,.jpeg,.png,.webp" class={inputClass} />
				<span class="mt-1 block text-xs text-charcoal/45">
					Maksimal {Math.round(UPLOAD_LIMITS.preview / (1024 * 1024))} MB.
				</span>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Proyeksi</span>
				<input type="text" name="projection" value="equirectangular" required class={inputClass} />
			</label>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<button
				type="submit"
				class="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
			>
				Unggah aset
			</button>
			<a
				href={resolve('admin/media')}
				class="text-sm font-semibold text-charcoal/50 hover:text-navy">Batal</a
			>
		</div>
	</form>
</div>
