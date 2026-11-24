<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function title(item: (typeof data.items)[number]): string {
		return item.translations.id.title.trim() || 'Foto tanpa judul';
	}

	function updatedLabel(item: (typeof data.items)[number]): string {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(item.updatedAt));
	}
</script>

<svelte:head>
	<title>Galeri | Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Media</p>
			<h1 class="display-lg mt-4 text-heading">Galeri</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Kelola foto dokumentasi kawasan pura yang tampil di halaman galeri publik.
			</p>
		</div>
		<a href={resolve('admin/gallery/new')} class="btn btn--primary btn--sm w-fit">
			Tambah foto
			<Icon name="plus" class="h-3.5 w-3.5" />
		</a>
	</header>

	{#if data.items.length === 0}
		<div class="surface flex flex-col items-center px-5 py-16 text-center">
			<span
				class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
			>
				<Icon name="image" class="h-5 w-5 text-heading/35" />
			</span>
			<p class="mt-5 text-sm text-muted">Belum ada foto galeri.</p>
			<a href={resolve('admin/gallery/new')} class="btn btn--outline btn--sm mt-5">
				Unggah foto pertama
			</a>
		</div>
	{:else}
		<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{#each data.items as item (item.id)}
				<article class="surface overflow-hidden">
					<img
						src={item.imagePath}
						alt=""
						class="aspect-[4/3] w-full object-cover"
						loading="lazy"
					/>
					<div class="p-5">
						<div class="flex flex-wrap items-center gap-2">
							<p class="line-clamp-1 text-sm font-semibold text-heading">{title(item)}</p>
							<span
								class="badge {item.status === 'published' ? 'badge--published' : 'badge--draft'}"
							>
								{item.status === 'published' ? 'Tayang' : 'Draf'}
							</span>
						</div>
						<p class="mt-1.5 text-xs text-muted">
							Urutan {item.sortOrder} · Diperbarui {updatedLabel(item)}
						</p>
						<div class="mt-4 flex flex-wrap items-center gap-3">
							{#if item.status === 'published'}
								<a
									href={localeHref('id', '/galeri')}
									class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
								>
									<Icon name="eye" class="h-3.5 w-3.5" />
									Lihat
								</a>
							{/if}
							<a
								href={resolve(`admin/gallery/${item.id}`)}
								class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
							>
								Edit
								<Icon name="arrow-right" class="h-3.5 w-3.5" />
							</a>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
