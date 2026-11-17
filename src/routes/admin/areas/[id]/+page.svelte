<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AreaForm from '#lib/components/admin/AreaForm.svelte';
	import ConfirmDeleteForm from '#lib/components/admin/ConfirmDeleteForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? data.values);
	const status = $derived(values.status);
	const created = $derived(page.url.searchParams.has('created'));
</script>

<svelte:head>
	<title>Edit Area — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten</p>
			<div class="mt-4 flex flex-wrap items-center gap-3">
				<h1 class="display-lg text-heading">Edit area</h1>
				<span class="badge {status === 'published' ? 'badge--published' : 'badge--draft'}">
					{status === 'published' ? 'Tayang' : 'Draf'}
				</span>
			</div>
			<p class="body-copy mt-3 max-w-2xl">/area/{data.area.slug}</p>
		</div>

		<div class="flex flex-wrap gap-2">
			{#if data.area.status === 'published'}
				<a href={localeHref('id', `/area/${data.area.slug}`)} class="btn btn--outline btn--sm">
					<Icon name="eye" class="h-3.5 w-3.5" />
					Lihat area
				</a>
			{/if}
			<a href={resolve('admin/areas')} class="btn btn--outline btn--sm">
				<Icon name="arrow-left" class="h-3.5 w-3.5" />
				Kembali ke area
			</a>
		</div>
	</header>

	{#if form?.success || created}
		<div class="alert alert--success" role="status">Area berhasil disimpan.</div>
	{/if}

	{#if form?.deleteError}
		<div class="alert alert--error" role="alert">{form.deleteError}</div>
	{/if}

	<AreaForm {values} errors={form?.errors} action="?/save" submitLabel="Simpan area" />

	<section class="surface border border-danger/20 p-5 sm:p-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h2 class="title-sm text-heading">Hapus area</h2>
				<p class="field-help">
					Area hanya dapat dihapus jika tidak lagi digunakan oleh scene mana pun.
				</p>
			</div>
			<ConfirmDeleteForm
				action="?/delete"
				fields={{}}
				buttonLabel="Hapus area"
				confirmTitle="Hapus area ini?"
				confirmDescription="Area akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
			/>
		</div>
	</section>
</div>
