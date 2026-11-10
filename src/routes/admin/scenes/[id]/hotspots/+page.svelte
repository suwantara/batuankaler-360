<script lang="ts">
	import { resolve } from '$app/paths';
	import HotspotForm from '#lib/components/admin/HotspotForm.svelte';
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
		<nav class="text-xs text-charcoal/45" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="hover:text-navy">Scene</a>
			<span aria-hidden="true"> / </span>
			<a href={resolve(`admin/scenes/${data.scene.id}`)} class="hover:text-navy"
				>{sceneTitle(data.scene)}</a
			>
			<span aria-hidden="true"> / </span>
			<span>Hotspot</span>
		</nav>

		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h1 class="font-display text-3xl text-navy sm:text-4xl">Hotspot</h1>
				<p class="mt-2 text-sm text-charcoal/60">
					{sceneTitle(data.scene)} · {data.scene.hotspots.length} hotspot
				</p>
			</div>
			<a
				href={resolve(`admin/scenes/${data.scene.id}`)}
				class="w-fit rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition hover:border-gold-dark hover:text-gold-dark"
			>
				Kembali ke scene
			</a>
		</div>
	</header>

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Tambah hotspot</h2>
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
		<h2 class="font-display text-xl text-navy">Daftar hotspot</h2>

		{#if data.scene.hotspots.length === 0}
			<div
				class="rounded-2xl border border-dashed border-navy/15 bg-ivory px-5 py-8 text-center text-sm text-charcoal/50"
			>
				Belum ada hotspot pada scene ini.
			</div>
		{:else}
			{#each data.scene.hotspots as hotspot (hotspot.id)}
				<details
					class="rounded-2xl border border-navy/10 bg-ivory"
					open={form?.hotspotId === hotspot.id}
				>
					<summary
						class="flex cursor-pointer list-none flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden"
					>
						<div class="flex flex-wrap items-center gap-2">
							<span
								class="rounded-full bg-navy/5 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-navy/60 uppercase"
							>
								{hotspot.type}
							</span>
							<span class="font-medium text-navy">
								{hotspot.translations.find((item) => item.locale === 'id')?.label ?? hotspot.id}
							</span>
							{#if !hotspot.isActive}
								<span
									class="rounded-full bg-amber-50 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-700 uppercase"
									>Nonaktif</span
								>
							{/if}
						</div>
						<p class="text-xs text-charcoal/45">
							yaw {radiansToDegrees(hotspot.yaw)}° · pitch {radiansToDegrees(hotspot.pitch)}°
						</p>
					</summary>

					<div class="border-t border-navy/10 p-5">
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
							class="mt-5 border-t border-red-100 pt-4"
							onsubmit={(event) => {
								if (!confirm('Hapus hotspot ini?')) {
									event.preventDefault();
								}
							}}
						>
							<input type="hidden" name="hotspotId" value={hotspot.id} />
							<button type="submit" class="text-xs font-semibold text-red-700 hover:text-red-900">
								Hapus hotspot
							</button>
						</form>
					</div>
				</details>
			{/each}
		{/if}
	</section>
</div>
