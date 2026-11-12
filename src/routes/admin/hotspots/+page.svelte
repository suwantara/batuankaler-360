<script lang="ts">
	import { resolve } from '$app/paths';
	import { SvelteMap } from 'svelte/reactivity';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type HotspotRow = (typeof data.hotspots)[number];
	type SceneRow = HotspotRow['scene'];
	type SceneGroup = { scene: SceneRow; hotspots: HotspotRow[] };

	function sceneTitle(scene: SceneRow): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug;
	}

	function hotspotLabel(hotspot: HotspotRow): string {
		return hotspot.translations.find((item) => item.locale === 'id')?.label ?? hotspot.id;
	}

	function targetTitle(hotspot: HotspotRow): string | null {
		const target = hotspot.targetScene;
		if (!target) return null;

		return target.translations.find((item) => item.locale === 'id')?.title ?? target.slug;
	}

	function typeLabel(type: HotspotRow['type']): string {
		if (type === 'navigation') return 'Navigasi';
		if (type === 'external') return 'Eksternal';
		return 'Informasi';
	}

	function typeBadge(type: HotspotRow['type']): string {
		return type === 'navigation' ? 'badge--gold' : 'badge--quiet';
	}

	function targetLabel(hotspot: HotspotRow): string {
		if (hotspot.type === 'navigation') {
			const target = targetTitle(hotspot);
			return target ? `Menuju ${target}` : 'Scene tujuan belum dipilih';
		}

		return hotspot.type === 'external' ? 'Tautan eksternal' : 'Konten informasi';
	}

	function radiansToDegrees(value: number): string {
		return ((value * 180) / Math.PI).toFixed(1);
	}

	const groups = $derived.by(() => {
		const map = new SvelteMap<string, SceneGroup>();

		for (const hotspot of data.hotspots) {
			const group = map.get(hotspot.scene.id);

			if (group) {
				group.hotspots.push(hotspot);
			} else {
				map.set(hotspot.scene.id, { scene: hotspot.scene, hotspots: [hotspot] });
			}
		}

		return [...map.values()].sort(
			(a, b) =>
				a.scene.sortOrder - b.scene.sortOrder ||
				sceneTitle(a.scene).localeCompare(sceneTitle(b.scene), 'id')
		);
	});
</script>

<svelte:head>
	<title>Hotspot — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Interaksi panorama</p>
			<div class="mt-4 flex flex-wrap items-center gap-3">
				<h1 class="display-lg text-heading">Hotspot</h1>
				<span class="badge badge--quiet">{data.hotspots.length} hotspot</span>
				<span class="badge badge--quiet">{groups.length} scene</span>
			</div>
			<p class="body-copy mt-3 max-w-2xl">
				Daftar seluruh hotspot dari semua scene. Buka salah satu hotspot untuk mengubah posisi,
				tipe, tujuan, atau kontennya.
			</p>
		</div>

		<a href={resolve('admin/scenes')} class="btn btn--outline btn--sm w-fit">
			<Icon name="layers" class="h-3.5 w-3.5" />
			Kelola scene
		</a>
	</header>

	{#if data.hotspots.length === 0}
		<div class="surface flex flex-col items-center px-5 py-16 text-center">
			<span
				class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
			>
				<Icon name="map-pin" class="h-5 w-5 text-heading/30" />
			</span>
			<p class="mt-5 text-sm text-muted">Belum ada hotspot.</p>
			<p class="mt-1 max-w-md text-xs leading-relaxed text-muted">
				Hotspot dibuat dari halaman scene, setelah scene memiliki aset panorama.
			</p>
			<a href={resolve('admin/scenes')} class="btn btn--outline btn--sm mt-5">Buka daftar scene</a>
		</div>
	{:else}
		<div class="flex flex-col gap-5">
			{#each groups as group (group.scene.id)}
				<section class="surface overflow-hidden">
					<div
						class="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 px-5 py-4"
					>
						<div class="flex flex-wrap items-center gap-3">
							<h2 class="title-sm text-heading">{sceneTitle(group.scene)}</h2>
							<span
								class="badge {group.scene.status === 'published'
									? 'badge--published'
									: 'badge--draft'}"
							>
								{group.scene.status === 'published' ? 'Tayang' : 'Draf'}
							</span>
							<span class="text-xs text-muted">{group.hotspots.length} hotspot</span>
						</div>

						<a
							href={resolve(`admin/scenes/${group.scene.id}/hotspots`)}
							class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
						>
							Kelola hotspot
							<Icon name="arrow-right" class="h-3.5 w-3.5" />
						</a>
					</div>

					<div class="divide-y divide-charcoal/10">
						{#each group.hotspots as hotspot (hotspot.id)}
							<div
								class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div class="flex min-w-0 items-start gap-3">
									<span class="badge {typeBadge(hotspot.type)}">{typeLabel(hotspot.type)}</span>
									<div class="min-w-0">
										<p class="truncate text-sm font-semibold text-heading">
											{hotspotLabel(hotspot)}
										</p>
										<p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
											<span>{targetLabel(hotspot)}</span>
											<span class="h-1 w-1 rounded-full bg-charcoal/20" aria-hidden="true"></span>
											<span>
												yaw {radiansToDegrees(hotspot.yaw)}° · pitch {radiansToDegrees(
													hotspot.pitch
												)}°
											</span>
											{#if !hotspot.isActive}
												<span class="badge badge--draft">Nonaktif</span>
											{/if}
										</p>
									</div>
								</div>

								<form
									method="GET"
									action={resolve(`admin/scenes/${group.scene.id}/hotspots`)}
									class="shrink-0"
								>
									<input type="hidden" name="hotspot" value={hotspot.id} />
									<button
										type="submit"
										class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
									>
										Edit
										<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
									</button>
								</form>
							</div>
						{/each}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</div>
