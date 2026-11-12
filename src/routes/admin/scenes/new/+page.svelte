<script lang="ts">
	import { resolve } from '$app/paths';
	import SceneForm from '#lib/components/admin/SceneForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { emptySceneFormValues } from '#lib/schemas/scene.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? emptySceneFormValues);
</script>

<svelte:head>
	<title>Tambah Scene — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<nav class="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="transition-colors hover:text-heading">Scene</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-heading/60">Tambah</span>
		</nav>
		<div>
			<p class="eyebrow">Scene baru</p>
			<h1 class="display-lg mt-4 text-heading">Tambah scene</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Buat scene baru, hubungkan dengan aset panorama, lalu tentukan status publikasinya.
			</p>
		</div>
	</header>

	<SceneForm
		{values}
		areas={data.areas}
		assets={data.assets}
		errors={form?.errors}
		submitLabel="Simpan scene"
	/>
</div>
