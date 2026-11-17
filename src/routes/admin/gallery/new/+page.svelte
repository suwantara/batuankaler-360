<script lang="ts">
	import { resolve } from '$app/paths';
	import GalleryForm from '#lib/components/admin/GalleryForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? data.values);
</script>

<svelte:head>
	<title>Tambah Foto Galeri — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Media</p>
			<h1 class="display-lg mt-4 text-heading">Tambah foto galeri</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Unggah foto dokumentasi kawasan. Foto hanya tampil di situs publik setelah berstatus Tayang.
			</p>
		</div>
		<a href={resolve('admin/gallery')} class="btn btn--outline btn--sm w-fit">
			<Icon name="arrow-left" class="h-3.5 w-3.5" />
			Kembali ke galeri
		</a>
	</header>

	<GalleryForm {values} errors={form?.errors} action="?/save" submitLabel="Simpan foto" />
</div>
