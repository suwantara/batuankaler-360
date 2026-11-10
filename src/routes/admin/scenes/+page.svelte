<script lang="ts">
	import { resolve } from '$app/paths';
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
			<p class="text-xs font-semibold tracking-[0.24em] text-gold-dark uppercase">Konten</p>
			<h1 class="mt-2 font-display text-3xl text-navy sm:text-4xl">Scene</h1>
			<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
				Kelola scene panorama, status publikasi, dan hotspot.
			</p>
		</div>
		<a
			href={resolve('admin/scenes/new')}
			class="w-fit rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
		>
			Tambah scene
		</a>
	</header>

	<div class="overflow-hidden rounded-2xl border border-navy/10 bg-ivory">
		{#if data.scenes.length === 0}
			<div class="px-5 py-10 text-center">
				<p class="text-sm text-charcoal/60">Belum ada scene.</p>
				<a
					href={resolve('admin/scenes/new')}
					class="mt-3 inline-block text-sm font-semibold text-navy hover:text-gold-dark"
				>
					Buat scene pertama
				</a>
			</div>
		{:else}
			<div class="divide-y divide-navy/10">
				{#each data.scenes as scene (scene.id)}
					<div
						class="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
					>
						<div class="flex min-w-0 items-center gap-4">
							{#if scene.panoramaAsset}
								<img
									src={scene.panoramaAsset.thumbnailPath}
									alt=""
									class="h-14 w-20 shrink-0 rounded-xl object-cover"
									loading="lazy"
								/>
							{:else}
								<div
									class="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-sand text-xs text-charcoal/40"
								>
									Tanpa aset
								</div>
							{/if}
							<div class="min-w-0">
								<p class="truncate font-medium text-navy">{title(scene)}</p>
								<p class="mt-0.5 truncate text-xs text-charcoal/45">/{scene.slug}</p>
								<p class="mt-1 text-xs text-charcoal/40">
									{scene.hotspots.length} hotspot · {scene.area
										? (scene.area.translations.find((item) => item.locale === 'id')?.title ??
											scene.area.slug)
										: 'Tanpa area'}
								</p>
							</div>
						</div>

						<div class="flex flex-wrap items-center gap-3 sm:justify-end">
							<span
								class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase {scene.status ===
								'published'
									? 'bg-emerald-50 text-emerald-700'
									: 'bg-amber-50 text-amber-700'}"
							>
								{scene.status}
							</span>
							<a
								href={resolve(`admin/scenes/${scene.id}/hotspots`)}
								class="text-xs font-semibold text-charcoal/55 hover:text-navy"
							>
								Hotspot
							</a>
							<a
								href={resolve(`admin/scenes/${scene.id}`)}
								class="text-xs font-semibold text-navy hover:text-gold-dark"
							>
								Edit
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
