<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function areaTitle(area: (typeof data.areas)[number]): string {
		return area.translations.id.title.trim() || area.slug;
	}

	function updatedLabel(area: (typeof data.areas)[number]): string {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(area.updatedAt));
	}
</script>

<svelte:head>
	<title>Area — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten</p>
			<h1 class="display-lg mt-4 text-heading">Area</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Kelola nama, deskripsi, urutan, dan status publikasi area kawasan pura.
			</p>
		</div>
		<a href={resolve('admin/areas/new')} class="btn btn--primary btn--sm w-fit">
			Tambah area
			<Icon name="plus" class="h-3.5 w-3.5" />
		</a>
	</header>

	<div class="surface overflow-hidden">
		{#if data.areas.length === 0}
			<div class="flex flex-col items-center px-5 py-16 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
				>
					<Icon name="cube" class="h-5 w-5 text-heading/35" />
				</span>
				<p class="mt-5 text-sm text-muted">Belum ada area.</p>
				<a href={resolve('admin/areas/new')} class="btn btn--outline btn--sm mt-5">
					Buat area pertama
				</a>
			</div>
		{:else}
			<div class="divide-y divide-charcoal/10">
				{#each data.areas as area (area.id)}
					<div
						class="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
					>
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2">
								<p class="truncate text-sm font-semibold text-heading">{areaTitle(area)}</p>
								<span
									class="badge {area.status === 'published' ? 'badge--published' : 'badge--draft'}"
								>
									{area.status === 'published' ? 'Tayang' : 'Draf'}
								</span>
							</div>
							<p class="mt-0.5 truncate text-xs text-muted">/area/{area.slug}</p>
							<p
								class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-muted"
							>
								<span>{area.sceneCount} scene</span>
								<span class="h-1 w-1 rounded-full bg-charcoal/20" aria-hidden="true"></span>
								<span>Diperbarui {updatedLabel(area)}</span>
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-3 lg:justify-end">
							{#if area.status === 'published'}
								<a
									href={localeHref('id', `/area/${area.slug}`)}
									class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
								>
									<Icon name="eye" class="h-3.5 w-3.5" />
									Lihat
								</a>
							{/if}
							<a
								href={resolve(`admin/areas/${area.id}`)}
								class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
							>
								Edit
								<Icon name="arrow-right" class="h-3.5 w-3.5" />
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="surface flex items-start gap-4 p-5">
		<Icon name="info" class="mt-0.5 h-5 w-5 shrink-0 text-gold-dark/70" />
		<p class="max-w-3xl text-sm leading-relaxed text-muted">
			Area yang masih digunakan oleh scene tidak dapat dihapus. Pindahkan scene ke area lain
			terlebih dahulu.
		</p>
	</div>
</div>
