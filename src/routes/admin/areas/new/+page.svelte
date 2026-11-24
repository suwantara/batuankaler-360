<script lang="ts">
	import { resolve } from '$app/paths';
	import AreaForm from '#lib/components/admin/AreaForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? data.values);
</script>

<svelte:head>
	<title>Tambah Area | Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten</p>
			<h1 class="display-lg mt-4 text-heading">Tambah area</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Buat area baru untuk mengelompokkan scene dan menampilkan informasi area di situs publik.
			</p>
		</div>
		<a href={resolve('admin/areas')} class="btn btn--outline btn--sm w-fit">
			<Icon name="arrow-left" class="h-3.5 w-3.5" />
			Kembali ke area
		</a>
	</header>

	<AreaForm {values} errors={form?.errors} action="?/save" submitLabel="Buat area" />
</div>
