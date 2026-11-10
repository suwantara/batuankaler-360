<script lang="ts">
	import { resolve } from '$app/paths';
	import SceneForm from '#lib/components/admin/SceneForm.svelte';
	import { emptySceneFormValues } from '#lib/schemas/scene.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? emptySceneFormValues);
</script>

<svelte:head>
	<title>Tambah Scene — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header>
		<nav class="text-xs text-charcoal/45" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="hover:text-navy">Scene</a>
			<span aria-hidden="true"> / </span>
			<span>Tambah</span>
		</nav>
		<h1 class="mt-3 font-display text-3xl text-navy sm:text-4xl">Tambah scene</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
			Buat scene baru, hubungkan dengan aset panorama, lalu tentukan status publikasinya.
		</p>
	</header>

	<SceneForm
		{values}
		areas={data.areas}
		assets={data.assets}
		errors={form?.errors}
		submitLabel="Simpan scene"
	/>
</div>
