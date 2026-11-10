<script lang="ts">
	import { resolve } from '$app/paths';
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

	const inputClass =
		'mt-2 w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold-dark focus:ring-2 focus:ring-gold/20';
	const labelClass = 'text-sm font-medium text-navy';

	function areaLabel(area: (typeof areas)[number]): string {
		return area.translations.find((item) => item.locale === 'id')?.title ?? area.id;
	}

	function assetLabel(asset: (typeof assets)[number]): string {
		const fileName = asset.originalPath.split('/').pop() ?? asset.originalPath;
		return `${fileName} (${asset.width}px)`;
	}
</script>

<form method="POST" action={action || undefined} class="flex flex-col gap-6">
	{#if errors.form}
		<div
			class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
			{errors.form}
		</div>
	{/if}

	{#if assets.length === 0}
		<div class="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
			Belum ada aset panorama. Tambahkan metadata aset terlebih dahulu di
			<a href={resolve('admin/media')} class="font-semibold underline">halaman media</a>.
		</div>
	{/if}

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Informasi scene</h2>
		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block">
				<span class={labelClass}>Slug</span>
				<input
					type="text"
					name="slug"
					value={values.slug}
					required
					aria-invalid={errors.slug ? 'true' : undefined}
					class={inputClass}
					placeholder="nama-scene"
				/>
				{#if errors.slug}<p class="mt-1 text-xs text-red-600">{errors.slug}</p>{/if}
			</label>

			<label class="block">
				<span class={labelClass}>Status</span>
				<select name="status" class={inputClass}>
					<option value="draft" selected={values.status === 'draft'}>Draft</option>
					<option value="published" selected={values.status === 'published'}>Published</option>
				</select>
				{#if errors.status}<p class="mt-1 text-xs text-red-600">{errors.status}</p>{/if}
			</label>

			<label class="block">
				<span class={labelClass}>Area</span>
				<select name="areaId" class={inputClass}>
					<option value="" selected={values.areaId === ''}>— Tidak ada —</option>
					{#each areas as area (area.id)}
						<option value={area.id} selected={values.areaId === area.id}>{areaLabel(area)}</option>
					{/each}
				</select>
				{#if errors.areaId}<p class="mt-1 text-xs text-red-600">{errors.areaId}</p>{/if}
			</label>

			<label class="block">
				<span class={labelClass}>Aset panorama</span>
				<select name="panoramaAssetId" class={inputClass}>
					<option value="" selected={values.panoramaAssetId === ''}>— Belum dipilih —</option>
					{#each assets as asset (asset.id)}
						<option value={asset.id} selected={values.panoramaAssetId === asset.id}
							>{assetLabel(asset)}</option
						>
					{/each}
				</select>
				{#if errors.panoramaAssetId}<p class="mt-1 text-xs text-red-600">
						{errors.panoramaAssetId}
					</p>{/if}
			</label>

			<label class="block">
				<span class={labelClass}>Urutan</span>
				<input
					type="number"
					name="sortOrder"
					value={values.sortOrder}
					min="0"
					step="1"
					class={inputClass}
				/>
				{#if errors.sortOrder}<p class="mt-1 text-xs text-red-600">{errors.sortOrder}</p>{/if}
			</label>
		</div>
	</section>

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Pandangan awal</h2>
		<p class="mt-1 text-xs text-charcoal/50">
			Nilai dalam derajat. Konversi ke radian dilakukan saat disimpan.
		</p>
		<div class="mt-5 grid gap-5 sm:grid-cols-3">
			<label class="block">
				<span class={labelClass}>Yaw</span>
				<input
					type="number"
					name="initialYaw"
					value={values.initialYaw}
					min="-180"
					max="180"
					step="0.1"
					class={inputClass}
				/>
				{#if errors.initialYaw}<p class="mt-1 text-xs text-red-600">{errors.initialYaw}</p>{/if}
			</label>
			<label class="block">
				<span class={labelClass}>Pitch</span>
				<input
					type="number"
					name="initialPitch"
					value={values.initialPitch}
					min="-90"
					max="90"
					step="0.1"
					class={inputClass}
				/>
				{#if errors.initialPitch}<p class="mt-1 text-xs text-red-600">{errors.initialPitch}</p>{/if}
			</label>
			<label class="block">
				<span class={labelClass}>FOV</span>
				<input
					type="number"
					name="initialFov"
					value={values.initialFov}
					min="30"
					max="100"
					step="0.1"
					class={inputClass}
				/>
				{#if errors.initialFov}<p class="mt-1 text-xs text-red-600">{errors.initialFov}</p>{/if}
			</label>
		</div>
	</section>

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Terjemahan</h2>
		<div class="mt-5 grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
					Bahasa Indonesia
				</h3>
				<label class="mt-4 block">
					<span class={labelClass}>Judul</span>
					<input type="text" name="titleId" value={values.titleId} required class={inputClass} />
					{#if errors.titleId}<p class="mt-1 text-xs text-red-600">{errors.titleId}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class={labelClass}>Deskripsi</span>
					<textarea name="descriptionId" rows="4" required class={inputClass}
						>{values.descriptionId}</textarea
					>
					{#if errors.descriptionId}<p class="mt-1 text-xs text-red-600">
							{errors.descriptionId}
						</p>{/if}
				</label>
			</div>
			<div>
				<h3 class="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">English</h3>
				<label class="mt-4 block">
					<span class={labelClass}>Title</span>
					<input type="text" name="titleEn" value={values.titleEn} required class={inputClass} />
					{#if errors.titleEn}<p class="mt-1 text-xs text-red-600">{errors.titleEn}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class={labelClass}>Description</span>
					<textarea name="descriptionEn" rows="4" required class={inputClass}
						>{values.descriptionEn}</textarea
					>
					{#if errors.descriptionEn}<p class="mt-1 text-xs text-red-600">
							{errors.descriptionEn}
						</p>{/if}
				</label>
			</div>
		</div>
	</section>

	<div class="flex flex-wrap items-center gap-3">
		<button
			type="submit"
			class="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
		>
			{submitLabel}
		</button>
		<a href={resolve('admin/scenes')} class="text-sm font-semibold text-charcoal/50 hover:text-navy"
			>Batal</a
		>
	</div>
</form>
