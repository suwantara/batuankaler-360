<script lang="ts">
	import { resolve } from '$app/paths';
	import HotspotForm from '#lib/components/admin/HotspotForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { emptyHotspotFormValues, type HotspotFormValues } from '#lib/schemas/scene.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const radiansToDegrees = (value: number) => ((value * 180) / Math.PI).toFixed(2);

	function sceneTitle(scene: typeof data.scene): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug;
	}

	function hotspotValues(hotspot: (typeof data.scene.hotspots)[number]): HotspotFormValues {
		const id = hotspot.translations.find((item) => item.locale === 'id');
		const en = hotspot.translations.find((item) => item.locale === 'en');

		return {
			type: hotspot.type,
			targetSceneId: hotspot.targetSceneId ?? '',
			yaw: radiansToDegrees(hotspot.yaw),
			pitch: radiansToDegrees(hotspot.pitch),
			sortOrder: String(hotspot.sortOrder),
			isActive: hotspot.isActive,
			labelId: id?.label ?? '',
			titleId: id?.title ?? '',
			bodyId: id?.description ?? '',
			labelEn: en?.label ?? '',
			titleEn: en?.title ?? '',
			bodyEn: en?.description ?? '',
			externalUrl: id?.externalUrl ?? ''
		};
	}

	const createValues = $derived(
		form?.hotspotId === null && form.values ? form.values : emptyHotspotFormValues
	);
	const createErrors = $derived(form?.hotspotId === null ? (form?.errors ?? {}) : {});

	function valuesFor(hotspot: (typeof data.scene.hotspots)[number]): HotspotFormValues {
		return form?.hotspotId === hotspot.id && form.values ? form.values : hotspotValues(hotspot);
	}

	function errorsFor(hotspot: (typeof data.scene.hotspots)[number]): Record<string, string> {
		return form?.hotspotId === hotspot.id ? (form?.errors ?? {}) : {};
	}
</script>

<svelte:head>
	<title>Hotspot {sceneTitle(data.scene)} — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<nav class="flex flex-wrap items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="transition-colors hover:text-navy">Scene</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<a href={resolve(`admin/scenes/${data.scene.id}`)} class="transition-colors hover:text-navy"
				>{sceneTitle(data.scene)}</a
			>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-navy/60">Hotspot</span>
		</nav>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="eyebrow">Interaksi panorama</p>
				<h1 class="display-lg mt-4 text-navy">Hotspot</h1>
				<p class="mt-2 text-sm text-muted">
					{sceneTitle(data.scene)} · {data.scene.hotspots.length} hotspot
				</p>
			</div>
			<a href={resolve(`admin/scenes/${data.scene.id}`)} class="btn btn--outline btn--sm w-fit">
				<Icon name="arrow-left" class="h-3.5 w-3.5" />
				Kembali ke scene
			</a>
		</div>
	</header>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-center gap-3 border-b border-charcoal/10 pb-4">
			<span class="badge badge--gold">Baru</span>
			<h2 class="title-sm text-navy">Tambah hotspot</h2>
		</div>
		<div class="mt-5">
			<HotspotForm
				values={createValues}
				scenes={data.scenes}
				errors={createErrors}
				sceneId={data.scene.id}
				action="?/create"
				submitLabel="Tambah hotspot"
			/>
		</div>
	</section>

	<section class="flex flex-col gap-3">
		<div class="flex items-center justify-between gap-4">
			<h2 class="title-sm text-navy">Daftar hotspot</h2>
			<span class="badge badge--quiet">{data.scene.hotspots.length} item</span>
		</div>

		{#if data.scene.hotspots.length === 0}
			<div class="surface flex flex-col items-center px-5 py-12 text-center">
				<Icon name="map-pin" class="h-7 w-7 text-navy/20" />
				<p class="mt-4 text-sm text-muted">Belum ada hotspot pada scene ini.</p>
			</div>
		{:else}
			{#each data.scene.hotspots as hotspot (hotspot.id)}
				<details class="surface overflow-hidden" open={form?.hotspotId === hotspot.id}>
					<summary
						class="flex cursor-pointer list-none flex-col gap-2 px-5 py-4 transition-colors hover:bg-navy/[0.02] sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden"
					>
						<div class="flex flex-wrap items-center gap-2.5">
							<span class="badge {hotspot.type === 'navigation' ? 'badge--gold' : 'badge--quiet'}">
								{hotspot.type === 'navigation' ? 'Navigasi' : 'Informasi'}
							</span>
							<span class="font-medium text-navy">
								{hotspot.translations.find((item) => item.locale === 'id')?.label ?? hotspot.id}
							</span>
							{#if !hotspot.isActive}
								<span class="badge badge--draft">Nonaktif</span>
							{/if}
						</div>
						<p class="text-xs text-muted">
							yaw {radiansToDegrees(hotspot.yaw)}° · pitch {radiansToDegrees(hotspot.pitch)}°
						</p>
					</summary>

					<div class="border-t border-charcoal/10 p-5">
						<HotspotForm
							values={valuesFor(hotspot)}
							scenes={data.scenes}
							errors={errorsFor(hotspot)}
							sceneId={data.scene.id}
							hotspotId={hotspot.id}
							action="?/update"
							submitLabel="Simpan hotspot"
						/>

						<form
							method="POST"
							action="?/delete"
							class="mt-5 border-t border-danger/15 pt-4"
							onsubmit={(event) => {
								if (!confirm('Hapus hotspot ini?')) {
									event.preventDefault();
								}
							}}
						>
							<input type="hidden" name="hotspotId" value={hotspot.id} />
							<button type="submit" class="btn btn--danger btn--sm">Hapus hotspot</button>
						</form>
					</div>
				</details>
			{/each}
		{/if}
	</section>
</div>
