<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { SceneFormValues } from '#lib/schemas/scene.ts';

	let {
		values,
		areas,
		assets,
		errors = {},
		submitLabel,
		action = ''
	}: {
		values: SceneFormValues;
		areas: Array<{ id: string; translations: Array<{ locale: Locale; title: string }> }>;
		assets: Array<{ id: string; originalPath: string; width: number }>;
		errors?: Record<string, string>;
		submitLabel: string;
		action?: string;
	} = $props();

	function areaLabel(area: (typeof areas)[number]): string {
		return area.translations.find((item) => item.locale === 'id')?.title ?? area.id;
	}

	function assetLabel(asset: (typeof assets)[number]): string {
		const fileName = asset.originalPath.split('/').pop() ?? asset.originalPath;
		return `${fileName} (${asset.width}px)`;
	}
</script>

<form method="POST" action={action || undefined} class="flex flex-col gap-5">
	{#if errors.form}
		<div class="alert alert--error" role="alert">
			{errors.form}
		</div>
	{/if}

	{#if assets.length === 0}
		<div class="alert alert--warning">
			Belum ada aset panorama. Tambahkan metadata aset terlebih dahulu di
			<a href={resolve('admin/media')} class="font-semibold underline underline-offset-2"
				>halaman media</a
			>.
		</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<h2 class="title-sm text-navy">Informasi scene</h2>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block">
				<span class="field-label">Slug</span>
				<input
					type="text"
					name="slug"
					value={values.slug}
					required
					aria-invalid={errors.slug ? 'true' : undefined}
					class="field-input"
					placeholder="nama-scene"
				/>
				{#if errors.slug}<p class="field-error">{errors.slug}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Status</span>
				<select name="status" class="field-input">
					<option value="draft" selected={values.status === 'draft'}>Draf</option>
					<option value="published" selected={values.status === 'published'}>Tayang</option>
				</select>
				{#if errors.status}<p class="field-error">{errors.status}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Area</span>
				<select name="areaId" class="field-input">
					<option value="" selected={values.areaId === ''}>— Tidak ada —</option>
					{#each areas as area (area.id)}
						<option value={area.id} selected={values.areaId === area.id}>{areaLabel(area)}</option>
					{/each}
				</select>
				{#if errors.areaId}<p class="field-error">{errors.areaId}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Aset panorama</span>
				<select name="panoramaAssetId" class="field-input">
					<option value="" selected={values.panoramaAssetId === ''}>— Belum dipilih —</option>
					{#each assets as asset (asset.id)}
						<option value={asset.id} selected={values.panoramaAssetId === asset.id}
							>{assetLabel(asset)}</option
						>
					{/each}
				</select>
				{#if errors.panoramaAssetId}<p class="field-error">{errors.panoramaAssetId}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Urutan</span>
				<input
					type="number"
					name="sortOrder"
					value={values.sortOrder}
					min="0"
					step="1"
					class="field-input"
				/>
				{#if errors.sortOrder}<p class="field-error">{errors.sortOrder}</p>{/if}
			</label>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<h2 class="title-sm text-navy">Pandangan awal</h2>
		</div>
		<p class="field-help mt-3">Nilai dalam derajat. Konversi ke radian dilakukan saat disimpan.</p>

		<div class="mt-5 grid gap-5 sm:grid-cols-3">
			<label class="block">
				<span class="field-label">Yaw</span>
				<input
					type="number"
					name="initialYaw"
					value={values.initialYaw}
					min="-180"
					max="180"
					step="0.1"
					class="field-input"
				/>
				{#if errors.initialYaw}<p class="field-error">{errors.initialYaw}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Pitch</span>
				<input
					type="number"
					name="initialPitch"
					value={values.initialPitch}
					min="-90"
					max="90"
					step="0.1"
					class="field-input"
				/>
				{#if errors.initialPitch}<p class="field-error">{errors.initialPitch}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">FOV</span>
				<input
					type="number"
					name="initialFov"
					value={values.initialFov}
					min="30"
					max="100"
					step="0.1"
					class="field-input"
				/>
				{#if errors.initialFov}<p class="field-error">{errors.initialFov}</p>{/if}
			</label>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">03</span>
			<h2 class="title-sm text-navy">Terjemahan</h2>
		</div>

		<div class="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-10">
			<div>
				<h3 class="meta text-gold-dark">Bahasa Indonesia</h3>
				<label class="mt-4 block">
					<span class="field-label">Judul</span>
					<input type="text" name="titleId" value={values.titleId} required class="field-input" />
					{#if errors.titleId}<p class="field-error">{errors.titleId}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class="field-label">Deskripsi</span>
					<textarea name="descriptionId" rows="4" required class="field-input"
						>{values.descriptionId}</textarea
					>
					{#if errors.descriptionId}<p class="field-error">{errors.descriptionId}</p>{/if}
				</label>
			</div>

			<div class="border-t border-charcoal/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
				<h3 class="meta text-gold-dark">English</h3>
				<label class="mt-4 block">
					<span class="field-label">Title</span>
					<input type="text" name="titleEn" value={values.titleEn} required class="field-input" />
					{#if errors.titleEn}<p class="field-error">{errors.titleEn}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class="field-label">Description</span>
					<textarea name="descriptionEn" rows="4" required class="field-input"
						>{values.descriptionEn}</textarea
					>
					{#if errors.descriptionEn}<p class="field-error">{errors.descriptionEn}</p>{/if}
				</label>
			</div>
		</div>
	</section>

	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" class="btn btn--primary">
			{submitLabel}
			<Icon name="check" class="h-4 w-4" />
		</button>
		<a
			href={resolve('admin/scenes')}
			class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-navy"
		>
			<Icon name="arrow-left" class="h-3.5 w-3.5" />
			Batal
		</a>
	</div>
</form>
