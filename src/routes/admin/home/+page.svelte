<script lang="ts">
	import { resolve } from '$app/paths';
	import HomeContentForm from '#lib/components/admin/HomeContentForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const values = $derived(form?.values ?? data.values);
	const status = $derived(values.status);
	const updatedAt = $derived(form?.updatedAt ?? data.page.updatedAt);
	const updatedLabel = $derived(
		new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(updatedAt))
	);
</script>

<svelte:head>
	<title>Beranda — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-5">
		<nav class="flex flex-wrap items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/pages')} class="transition-colors hover:text-heading">Halaman</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-heading/60">Beranda</span>
		</nav>

		<div class="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
			<div>
				<p class="eyebrow">Halaman publik</p>
				<div class="mt-4 flex flex-wrap items-center gap-3">
					<h1 class="display-lg text-heading">Beranda</h1>
					<span class="badge {status === 'published' ? 'badge--published' : 'badge--draft'}">
						{status === 'published' ? 'Tayang' : 'Draf'}
					</span>
				</div>
				<p class="body-copy mt-3 max-w-2xl">
					Kelola seluruh teks beranda: hero, pengenalan, virtual tour, sejarah, area, galeri, dan
					panduan.
				</p>
				<p class="mt-2 text-xs text-muted">Terakhir diperbarui: {updatedLabel}</p>
			</div>

			<div class="flex flex-wrap gap-2">
				{#if status === 'published'}
					<a href={localeHref('id', '/')} class="btn btn--outline btn--sm">
						Lihat versi ID
						<Icon name="external" class="h-3.5 w-3.5" />
					</a>
					<a href={localeHref('en', '/')} class="btn btn--outline btn--sm">
						Lihat versi EN
						<Icon name="external" class="h-3.5 w-3.5" />
					</a>
				{:else}
					<p class="max-w-xs text-xs leading-relaxed text-muted">
						Publikasikan beranda untuk melihat hasilnya di situs publik.
					</p>
				{/if}
			</div>
		</div>
	</header>

	{#if form?.success}
		<div class="alert alert--success" role="status">Beranda berhasil disimpan.</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
		<HomeContentForm {values} assets={data.assets} errors={form?.errors} action="?/save" />

		<aside class="surface surface--dark h-fit p-6 xl:sticky xl:top-24">
			<p class="meta text-[0.65rem] text-gold-light/60">Catatan pengisian</p>
			<ul class="mt-5 flex flex-col gap-4 text-xs leading-relaxed text-ivory/55">
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">01</span>
					<span>Nilai awal diambil dari konten beranda yang sedang tampil.</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">02</span>
					<span>Edit satu bahasa pada satu waktu; kedua bahasa disimpan bersama.</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">03</span>
					<span>Bagian yang belum diubah tetap memakai nilai awal sampai disimpan.</span>
				</li>
				<li class="flex gap-3">
					<span class="font-display text-sm text-gold-light/70">04</span>
					<span>Status Draf tidak mengubah beranda publik.</span>
				</li>
			</ul>

			{#if status === 'published'}
				<div class="mt-6 border-t border-ivory/10 pt-5">
					<a href={localeHref('id', '/')} class="link-arrow link-arrow--light">
						Buka beranda publik
						<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
					</a>
				</div>
			{/if}
		</aside>
	</div>
</div>
