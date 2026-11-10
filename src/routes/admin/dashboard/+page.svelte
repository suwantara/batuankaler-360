<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const stats = $derived([
		{ label: 'Total scene', value: data.counts.scenes },
		{ label: 'Scene published', value: data.counts.published },
		{ label: 'Total hotspot', value: data.counts.hotspots },
		{ label: 'Aset panorama', value: data.counts.assets }
	]);
</script>

<svelte:head>
	<title>Dashboard Admin — Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header>
		<p class="text-xs font-semibold tracking-[0.24em] text-gold-dark uppercase">Ringkasan</p>
		<h1 class="mt-2 font-display text-3xl text-navy sm:text-4xl">Dashboard</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
			Pantau jumlah scene, hotspot, dan aset panorama yang tersedia.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as stat (stat.label)}
			<div class="rounded-2xl border border-navy/10 bg-ivory p-5">
				<p class="text-xs font-medium text-charcoal/50">{stat.label}</p>
				<p class="mt-3 font-display text-4xl text-navy">{stat.value}</p>
			</div>
		{/each}
	</div>

	<div class="flex flex-wrap gap-3">
		<a
			href={resolve('admin/scenes/new')}
			class="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
		>
			Tambah scene
		</a>
		<a
			href={resolve('admin/media')}
			class="rounded-full border border-navy/15 px-5 py-2.5 text-sm font-semibold text-navy transition hover:border-gold-dark hover:text-gold-dark"
		>
			Kelola media
		</a>
	</div>

	<section class="rounded-2xl border border-navy/10 bg-ivory">
		<div class="flex items-center justify-between border-b border-navy/10 px-5 py-4">
			<h2 class="font-display text-xl text-navy">Scene terbaru</h2>
			<a
				href={resolve('admin/scenes')}
				class="text-xs font-semibold text-navy hover:text-gold-dark"
			>
				Lihat semua
			</a>
		</div>

		<div class="divide-y divide-navy/10">
			{#if data.scenes.length === 0}
				<p class="px-5 py-6 text-sm text-charcoal/50">Belum ada scene.</p>
			{:else}
				{#each data.scenes.slice(0, 5) as scene (scene.id)}
					<div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="min-w-0">
							<p class="truncate font-medium text-navy">
								{scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug}
							</p>
							<p class="mt-0.5 truncate text-xs text-charcoal/45">/{scene.slug}</p>
						</div>
						<div class="flex items-center gap-3">
							<span
								class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase {scene.status ===
								'published'
									? 'bg-emerald-50 text-emerald-700'
									: 'bg-amber-50 text-amber-700'}"
							>
								{scene.status}
							</span>
							<a
								href={resolve(`admin/scenes/${scene.id}`)}
								class="text-xs font-semibold text-navy hover:text-gold-dark"
							>
								Edit
							</a>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</section>
</div>
