<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	function title(scene: (typeof data.scenes)[number]): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug;
	}
</script>

<svelte:head>
	<title>Scene — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten</p>
			<h1 class="display-lg mt-4 text-navy">Scene</h1>
			<p class="body-copy mt-3 max-w-2xl">Kelola scene panorama, status publikasi, dan hotspot.</p>
		</div>
		<a href={resolve('admin/scenes/new')} class="btn btn--primary btn--sm w-fit">
			Tambah scene
			<Icon name="plus" class="h-3.5 w-3.5" />
		</a>
	</header>

	<div class="surface overflow-hidden">
		{#if data.scenes.length === 0}
			<div class="flex flex-col items-center px-5 py-16 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
				>
					<Icon name="layers" class="h-5 w-5 text-navy/35" />
				</span>
				<p class="mt-5 text-sm text-muted">Belum ada scene.</p>
				<a href={resolve('admin/scenes/new')} class="btn btn--outline btn--sm mt-5">
					Buat scene pertama
				</a>
			</div>
		{:else}
			<div class="divide-y divide-charcoal/10">
				{#each data.scenes as scene (scene.id)}
					<div
						class="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
					>
						<div class="flex min-w-0 items-center gap-4">
							{#if scene.panoramaAsset}
								<img
									src={scene.panoramaAsset.thumbnailPath}
									alt=""
									class="h-14 w-20 shrink-0 border border-charcoal/10 object-cover"
									loading="lazy"
								/>
							{:else}
								<div
									class="flex h-14 w-20 shrink-0 items-center justify-center border border-charcoal/10 bg-sand text-[0.55rem] tracking-wider text-charcoal/35 uppercase"
								>
									Tanpa aset
								</div>
							{/if}
							<div class="min-w-0">
								<p class="truncate text-sm font-semibold text-navy">{title(scene)}</p>
								<p class="mt-0.5 truncate text-xs text-muted">/{scene.slug}</p>
								<p
									class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-muted"
								>
									<span>{scene.hotspots.length} hotspot</span>
									<span class="h-1 w-1 rounded-full bg-charcoal/20" aria-hidden="true"></span>
									<span>
										{scene.area
											? (scene.area.translations.find((item) => item.locale === 'id')?.title ??
												scene.area.slug)
											: 'Tanpa area'}
									</span>
								</p>
							</div>
						</div>

						<div class="flex flex-wrap items-center gap-3 sm:pl-24 lg:justify-end lg:pl-0">
							<span
								class="badge {scene.status === 'published' ? 'badge--published' : 'badge--draft'}"
							>
								{scene.status === 'published' ? 'Tayang' : 'Draf'}
							</span>
							<a
								href={resolve(`admin/scenes/${scene.id}/hotspots`)}
								class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-navy"
							>
								<Icon name="map-pin" class="h-3.5 w-3.5" />
								Hotspot
							</a>
							<a
								href={resolve(`admin/scenes/${scene.id}`)}
								class="inline-flex items-center gap-1.5 text-xs font-semibold text-navy transition-colors hover:text-gold-dark"
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
</div>
