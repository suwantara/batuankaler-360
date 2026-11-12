<script lang="ts">
	import { resolve } from '$app/paths';
	import SiteContentForm from '#lib/components/admin/SiteContentForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? data.values);
	const status = $derived(values.status);
	const updatedAt = $derived(form?.updatedAt ?? data.content.updatedAt);
	const updatedLabel = $derived(
		new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(updatedAt))
	);
</script>

<svelte:head>
	<title>Informasi Kunjungan — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten situs</p>
			<div class="mt-4 flex flex-wrap items-center gap-3">
				<h1 class="display-lg text-navy">Informasi kunjungan</h1>
				<span class="badge {status === 'published' ? 'badge--published' : 'badge--draft'}">
					{status === 'published' ? 'Tayang' : 'Draf'}
				</span>
			</div>
			<p class="body-copy mt-3 max-w-2xl">
				Informasi praktis ini tampil di beranda dan halaman Panduan setelah berstatus Tayang.
			</p>
			<p class="mt-2 text-xs text-muted">Terakhir diperbarui: {updatedLabel}</p>
		</div>

		<a href={resolve('id')} class="btn btn--outline btn--sm w-fit">
			Lihat beranda
			<Icon name="external" class="h-3.5 w-3.5" />
		</a>
	</header>

	{#if form?.success}
		<div class="alert alert--success" role="status">
			Konten informasi kunjungan berhasil disimpan.
		</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
		<SiteContentForm {values} errors={form?.errors} action="?/save" />

		<aside class="surface surface--dark h-fit p-6 xl:sticky xl:top-24">
			<p class="meta text-[0.65rem] text-gold-light/60">Catatan pengisian</p>
			<ul class="mt-5 flex flex-col gap-4 text-xs leading-relaxed text-ivory/55">
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">01</span>
					<span>Field yang kosong tidak ditampilkan di situs publik.</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">02</span>
					<span>Status Draf menyembunyikan seluruh blok informasi dari pengunjung.</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">03</span>
					<span>
						Jika teks Inggris kosong, pengunjung versi Inggris melihat versi Indonesia dengan
						indikator fallback.
					</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">04</span>
					<span>Gunakan data yang sudah diverifikasi pengelola sebelum menayangkan konten.</span>
				</li>
			</ul>

			<div class="mt-6 border-t border-ivory/10 pt-5">
				<a href={resolve('id/panduan')} class="link-arrow link-arrow--light">
					Lihat halaman panduan
					<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
				</a>
			</div>
		</aside>
	</div>
</div>
