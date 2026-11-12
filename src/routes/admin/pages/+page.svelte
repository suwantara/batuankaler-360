<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import { getSitePageDefinition } from '#lib/site-pages.ts';
	import type { SitePageAdmin } from '#lib/types/site-page.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function definitionFor(page: SitePageAdmin) {
		return getSitePageDefinition(page.slug);
	}

	function pageTitle(page: SitePageAdmin): string {
		return page.translations.id.title.trim() || definitionFor(page)?.label || page.slug;
	}

	function updatedLabel(page: SitePageAdmin): string {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(page.updatedAt));
	}
</script>

<svelte:head>
	<title>Halaman — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header>
		<p class="eyebrow">Konten publik</p>
		<div class="mt-4 flex flex-wrap items-center gap-3">
			<h1 class="display-lg text-heading">Halaman</h1>
			<span class="badge badge--quiet">{data.pages.length} halaman</span>
		</div>
		<p class="body-copy mt-3 max-w-2xl">
			Kelola teks, artikel, dan status publikasi halaman situs. Halaman yang belum tayang tidak akan
			mengubah tampilan publik.
		</p>
	</header>

	<div class="flex flex-col gap-4">
		{#each data.pages as page (page.id)}
			{@const definition = definitionFor(page)}
			<article class="surface p-5 sm:p-6">
				<div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
					<div class="min-w-0">
						<div class="flex flex-wrap items-center gap-3">
							<p class="meta text-gold-dark">{definition?.label ?? page.slug}</p>
							<span
								class="badge {page.status === 'published' ? 'badge--published' : 'badge--draft'}"
							>
								{page.status === 'published' ? 'Tayang' : 'Draf'}
							</span>
						</div>
						<h2 class="display-md mt-2 text-heading">{pageTitle(page)}</h2>
						<p class="body-copy mt-2 max-w-2xl">
							{definition?.description ?? 'Konten halaman publik.'}
						</p>
						<p class="mt-3 text-xs text-muted">Terakhir diperbarui: {updatedLabel(page)}</p>
					</div>

					<div class="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
						{#if page.slug === 'beranda'}
							<a href={resolve('admin/home')} class="btn btn--primary btn--sm">
								<Icon name="file" class="h-3.5 w-3.5" />
								Edit beranda
							</a>
						{:else}
							<a href={resolve(`admin/pages/${page.slug}`)} class="btn btn--primary btn--sm">
								<Icon name="file" class="h-3.5 w-3.5" />
								Edit halaman
							</a>
						{/if}
						{#if page.status === 'published' && definition}
							<a href={localeHref('id', definition.path)} class="btn btn--outline btn--sm">
								Lihat halaman
								<Icon name="external" class="h-3.5 w-3.5" />
							</a>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>

	<div class="surface flex items-start gap-4 p-5">
		<Icon name="info" class="mt-0.5 h-5 w-5 shrink-0 text-gold-dark/70" />
		<p class="max-w-3xl text-sm leading-relaxed text-muted">
			Beranda, Sejarah, Panduan, Area, dan Galeri sudah bisa diedit. Konten Virtual Tour dan foto
			galeri masih menunggu tahap berikutnya.
		</p>
	</div>
</div>
