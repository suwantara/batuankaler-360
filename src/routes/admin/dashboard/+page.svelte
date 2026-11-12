<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const stats: Array<{ label: string; value: number; icon: IconName }> = $derived([
		{ label: 'Total scene', value: data.counts.scenes, icon: 'layers' },
		{ label: 'Scene tayang', value: data.counts.published, icon: 'check' },
		{ label: 'Total hotspot', value: data.counts.hotspots, icon: 'map-pin' },
		{ label: 'Aset panorama', value: data.counts.assets, icon: 'image' }
	]);

	const publishedRatio = $derived(
		data.counts.scenes === 0 ? 0 : Math.round((data.counts.published / data.counts.scenes) * 100)
	);

	function sceneTitle(scene: (typeof data.scenes)[number]): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug;
	}
</script>

<svelte:head>
	<title>Dashboard Admin — Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<header class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Ringkasan</p>
			<h1 class="display-lg mt-4 text-heading">Dashboard</h1>
			<p class="body-copy mt-3 max-w-xl">
				Pantau jumlah scene, hotspot, dan aset panorama yang tersedia.
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<a href={resolve('admin/scenes/new')} class="btn btn--primary btn--sm">
				Tambah scene
				<Icon name="plus" class="h-3.5 w-3.5" />
			</a>
			<a href={resolve('admin/media')} class="btn btn--outline btn--sm">Kelola media</a>
		</div>
	</header>

	<div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
		{#each stats as stat (stat.label)}
			<div class="surface p-5">
				<div class="flex items-start justify-between gap-4">
					<p class="meta text-[0.58rem] text-muted">{stat.label}</p>
					<Icon name={stat.icon} class="h-4 w-4 text-gold-dark/55" />
				</div>
				<p class="mt-6 font-display text-5xl leading-none text-heading">{stat.value}</p>
				<div class="mt-5 h-px w-full bg-charcoal/10">
					<div class="h-px w-10 bg-gold-dark/70"></div>
				</div>
			</div>
		{/each}
	</div>

	<div class="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
		<section class="surface overflow-hidden">
			<div class="flex items-center justify-between gap-4 border-b border-charcoal/10 px-5 py-4">
				<h2 class="title-sm text-heading">Scene terbaru</h2>
				<a
					href={resolve('admin/scenes')}
					class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
				>
					Lihat semua
					<Icon name="arrow-right" class="h-3.5 w-3.5" />
				</a>
			</div>

			{#if data.scenes.length === 0}
				<div class="flex flex-col items-center px-5 py-12 text-center">
					<Icon name="layers" class="h-7 w-7 text-heading/20" />
					<p class="mt-4 text-sm text-muted">Belum ada scene.</p>
					<a
						href={resolve('admin/scenes/new')}
						class="mt-4 text-xs font-semibold text-heading underline decoration-gold-dark/40 underline-offset-4 hover:text-gold-dark"
					>
						Buat scene pertama
					</a>
				</div>
			{:else}
				<div class="divide-y divide-charcoal/10">
					{#each data.scenes.slice(0, 5) as scene (scene.id)}
						<div class="flex items-center gap-4 px-5 py-4">
							<div class="h-12 w-16 shrink-0 overflow-hidden border border-charcoal/10 bg-sand">
								{#if scene.panoramaAsset}
									<img
										src={scene.panoramaAsset.thumbnailPath}
										alt=""
										class="h-full w-full object-cover"
										loading="lazy"
									/>
								{:else}
									<span
										class="flex h-full w-full items-center justify-center text-[0.55rem] tracking-wider text-charcoal/35 uppercase"
									>
										—
									</span>
								{/if}
							</div>

							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-semibold text-heading">{sceneTitle(scene)}</p>
								<p class="mt-0.5 truncate text-xs text-muted">/{scene.slug}</p>
							</div>

							<span
								class="badge {scene.status === 'published' ? 'badge--published' : 'badge--draft'}"
							>
								{scene.status === 'published' ? 'Tayang' : 'Draf'}
							</span>

							<a
								href={resolve(`admin/scenes/${scene.id}`)}
								class="text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
							>
								Edit
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<div class="flex flex-col gap-6">
			<section class="surface surface--dark p-6">
				<p class="meta text-[0.58rem] text-gold-light/60">Aksi cepat</p>
				<div class="mt-4 flex flex-col divide-y divide-ivory/10">
					<a
						href={resolve('admin/scenes/new')}
						class="flex items-center justify-between gap-4 py-3 text-sm text-ivory/70 transition-colors hover:text-gold-light"
					>
						Tambah scene baru
						<Icon name="plus" class="h-4 w-4" />
					</a>
					<a
						href={resolve('admin/media/upload')}
						class="flex items-center justify-between gap-4 py-3 text-sm text-ivory/70 transition-colors hover:text-gold-light"
					>
						Unggah panorama
						<Icon name="upload" class="h-4 w-4" />
					</a>
					<a
						href={resolve('id/tour')}
						class="flex items-center justify-between gap-4 py-3 text-sm text-ivory/70 transition-colors hover:text-gold-light"
					>
						Buka situs publik
						<Icon name="external" class="h-4 w-4" />
					</a>
				</div>
			</section>

			<section class="surface p-6">
				<div class="flex items-center justify-between gap-4">
					<p class="meta text-[0.58rem] text-muted">Status publikasi</p>
					<span class="badge badge--gold">{publishedRatio}%</span>
				</div>
				<div
					class="mt-5 h-1.5 w-full bg-charcoal/10"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={publishedRatio}
					aria-label="Persentase scene tayang"
				>
					<div class="h-full bg-gold-dark/80" style="width: {publishedRatio}%"></div>
				</div>
				<p class="mt-4 text-sm leading-relaxed text-body">
					{data.counts.published} dari {data.counts.scenes} scene sudah tayang di situs publik.
				</p>
				<a href={resolve('admin/scenes')} class="link-arrow mt-5">
					Kelola scene
					<Icon name="arrow-right" class="h-3.5 w-3.5" />
				</a>
			</section>
		</div>
	</div>
</div>
