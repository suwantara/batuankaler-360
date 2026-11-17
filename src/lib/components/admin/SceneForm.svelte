<script lang="ts">
	import { resolve } from '$app/paths';
	import PanoramaViewer from '#lib/components/tour/PanoramaViewer.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { SceneFormValues } from '#lib/schemas/scene.ts';
	import {
		degreesToRadians,
		formatDegrees,
		parseCoordinate,
		radiansToDegrees
	} from '#lib/tour/coordinates.ts';
	import type { TourScene } from '#lib/tour/scenes.ts';
	import type { PanoramaViewerHandle } from '#lib/types/panorama.ts';

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

	// Local editable copy of server values; reset when a form action returns new values.
	// svelte-ignore state_referenced_locally
	let form = $state<SceneFormValues>({ ...values });
	let pickerOpen = $state(false);
	let viewerHandle: PanoramaViewerHandle | null = $state(null);
	let thumbnailStatus = $state<'idle' | 'capturing' | 'success' | 'error'>('idle');
	let thumbnailMessage = $state('');
	let thumbnailPreview = $state('');

	const valuesSignature = $derived(JSON.stringify(values));
	let lastValuesSignature: string | undefined;
	let initialized = false;

	$effect(() => {
		const signature = valuesSignature;

		if (!initialized) {
			initialized = true;
			lastValuesSignature = signature;
			return;
		}

		if (signature === lastValuesSignature) return;

		lastValuesSignature = signature;
		form = { ...values };
	});

	const selectedAsset = $derived(assets.find((asset) => asset.id === form.panoramaAssetId));
	const initialView = $derived({
		yaw: degreesToRadians(parseCoordinate(form.initialYaw)),
		pitch: degreesToRadians(parseCoordinate(form.initialPitch)),
		fov: degreesToRadians(parseCoordinate(form.initialFov, 90))
	});
	const previewScene = $derived(
		selectedAsset
			? ({
					id: selectedAsset.id,
					slug: 'preview',
					panorama: {
						src: selectedAsset.originalPath,
						thumbnail: '',
						width: selectedAsset.width
					},
					initialView,
					translations: {
						id: { title: '', description: '' },
						en: { title: '', description: '' }
					},
					hotspots: []
				} satisfies TourScene)
			: null
	);

	function handleCoordinatePick(coords: { yaw: number; pitch: number }): void {
		form.initialYaw = formatDegrees(radiansToDegrees(coords.yaw));
		form.initialPitch = formatDegrees(radiansToDegrees(coords.pitch));
	}

	function responseMessage(payload: unknown): string | undefined {
		if (payload && typeof payload === 'object' && 'message' in payload) {
			const message = payload.message;

			if (typeof message === 'string') return message;
		}

		return undefined;
	}

	function responseThumbnail(payload: unknown): string | undefined {
		if (payload && typeof payload === 'object' && 'thumbnailPath' in payload) {
			const thumbnailPath = payload.thumbnailPath;

			if (typeof thumbnailPath === 'string') return thumbnailPath;
		}

		return undefined;
	}

	function responseOk(payload: unknown): boolean {
		return Boolean(
			payload &&
			typeof payload === 'object' &&
			'ok' in payload &&
			typeof payload.ok === 'boolean' &&
			payload.ok
		);
	}

	async function captureThumbnail(): Promise<void> {
		if (!selectedAsset || !viewerHandle || thumbnailStatus === 'capturing') return;

		thumbnailStatus = 'capturing';
		thumbnailMessage = '';

		try {
			const dataUrl = await viewerHandle.captureThumbnail(initialView);
			const response = await fetch(`/admin/media/${selectedAsset.id}/thumbnail`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dataUrl })
			});
			let payload: unknown;

			try {
				payload = await response.json();
			} catch {
				payload = null;
			}

			if (!response.ok || !responseOk(payload)) {
				throw new Error(responseMessage(payload) ?? 'Gagal membuat thumbnail dari panorama.');
			}

			const thumbnailPath = responseThumbnail(payload);
			thumbnailStatus = 'success';
			thumbnailMessage =
				'Thumbnail berhasil dibuat dari titik awal scene dan disimpan pada aset panorama.';
			thumbnailPreview = thumbnailPath ? `${thumbnailPath}?v=${Date.now()}` : '';
		} catch (cause) {
			thumbnailStatus = 'error';
			thumbnailMessage =
				cause instanceof Error ? cause.message : 'Gagal membuat thumbnail dari panorama.';
		}
	}

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

	<nav
		class="surface z-20 flex flex-wrap items-center gap-1 p-2 lg:sticky lg:top-[8.25rem]"
		aria-label="Bagian formulir scene"
	>
		<a
			href="#scene-info"
			class="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
		>
			<span class="font-display text-gold-dark">01</span> Informasi
		</a>
		<a
			href="#scene-view"
			class="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
		>
			<span class="font-display text-gold-dark">02</span> Pandangan &amp; thumbnail
		</a>
		<a
			href="#scene-translations"
			class="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
		>
			<span class="font-display text-gold-dark">03</span> Terjemahan
		</a>
		<button type="submit" class="btn btn--primary btn--sm ml-auto">
			Simpan
			<Icon name="check" class="h-3.5 w-3.5" />
		</button>
	</nav>

	<section id="scene-info" class="surface scroll-mt-40 p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<h2 class="title-sm text-heading">Informasi scene</h2>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block">
				<span class="field-label">Slug</span>
				<input
					type="text"
					name="slug"
					bind:value={form.slug}
					required
					aria-invalid={errors.slug ? 'true' : undefined}
					class="field-input"
					placeholder="nama-scene"
				/>
				{#if errors.slug}<p class="field-error">{errors.slug}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Status</span>
				<select name="status" class="field-input" bind:value={form.status}>
					<option value="draft">Draf</option>
					<option value="published">Tayang</option>
				</select>
				{#if errors.status}<p class="field-error">{errors.status}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Area</span>
				<select name="areaId" class="field-input" bind:value={form.areaId}>
					<option value="">— Tidak ada —</option>
					{#each areas as area (area.id)}
						<option value={area.id}>{areaLabel(area)}</option>
					{/each}
				</select>
				{#if errors.areaId}<p class="field-error">{errors.areaId}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Aset panorama</span>
				<select name="panoramaAssetId" class="field-input" bind:value={form.panoramaAssetId}>
					<option value="">— Belum dipilih —</option>
					{#each assets as asset (asset.id)}
						<option value={asset.id}>{assetLabel(asset)}</option>
					{/each}
				</select>
				{#if errors.panoramaAssetId}<p class="field-error">{errors.panoramaAssetId}</p>{/if}
			</label>

			<label class="block">
				<span class="field-label">Urutan</span>
				<input
					type="number"
					name="sortOrder"
					bind:value={form.sortOrder}
					min="0"
					step="1"
					class="field-input"
				/>
				{#if errors.sortOrder}<p class="field-error">{errors.sortOrder}</p>{/if}
			</label>
		</div>
	</section>

	<section id="scene-view" class="surface scroll-mt-40 p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<h2 class="title-sm text-heading">Pandangan awal</h2>
		</div>
		<p class="field-help mt-3">Nilai dalam derajat. Konversi ke radian dilakukan saat disimpan.</p>

		<div class="mt-5 grid gap-5 sm:grid-cols-3">
			<label class="block">
				<span class="field-label">Yaw</span>
				<input
					type="number"
					name="initialYaw"
					bind:value={form.initialYaw}
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
					bind:value={form.initialPitch}
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
					bind:value={form.initialFov}
					min="30"
					max="100"
					step="0.1"
					class="field-input"
				/>
				{#if errors.initialFov}<p class="field-error">{errors.initialFov}</p>{/if}
			</label>
		</div>

		<div class="mt-5 border-t border-charcoal/10 pt-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p class="field-label">Pilih arah awal dari panorama</p>
					<p class="field-help mt-1">
						Klik titik pada panorama untuk mengisi yaw/pitch. Geser panorama untuk mencari objek.
					</p>
				</div>
				<button
					type="button"
					class="btn btn--outline btn--sm"
					disabled={!selectedAsset}
					onclick={() => (pickerOpen = !pickerOpen)}
				>
					<Icon name="map-pin" class="h-3.5 w-3.5" />
					{pickerOpen ? 'Tutup pemilih' : 'Buka pemilih'}
				</button>
			</div>

			{#if pickerOpen}
				<div class="mt-4">
					{#if selectedAsset && previewScene}
						{#key selectedAsset.id}
							<PanoramaViewer
								scenes={[previewScene]}
								sceneId={previewScene.id}
								lang="id"
								pickMode
								compact
								onCoordinatePick={handleCoordinatePick}
								onready={(handle) => (viewerHandle = handle)}
							/>
						{/key}
						<p class="field-help mt-2">
							Marker emas menunjukkan arah awal terpilih. Nilai yaw/pitch di atas diperbarui
							otomatis.
						</p>
					{:else}
						<p class="alert alert--warning">
							Pilih aset panorama terlebih dahulu untuk membuka pemilih koordinat.
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<div class="mt-5 border-t border-charcoal/10 pt-4">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<p class="field-label">Thumbnail scene</p>
					<p class="field-help mt-1">
						Ambil gambar dari titik awal scene. Thumbnail disimpan pada aset panorama dan dipakai
						daftar scene serta navigasi tur.
					</p>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					{#if thumbnailPreview}
						<img
							src={thumbnailPreview}
							alt="Pratinjau thumbnail baru"
							class="h-12 w-24 border border-charcoal/10 object-cover"
						/>
					{/if}
					<button
						type="button"
						class="btn btn--outline btn--sm"
						disabled={!viewerHandle || thumbnailStatus === 'capturing'}
						onclick={captureThumbnail}
					>
						<Icon name="image" class="h-3.5 w-3.5" />
						{thumbnailStatus === 'capturing'
							? 'Mengambil thumbnail…'
							: 'Ambil thumbnail dari titik awal'}
					</button>
				</div>
			</div>

			{#if !viewerHandle && thumbnailStatus !== 'success'}
				<p class="field-help mt-2">
					Buka pemilih panorama di atas untuk memuat viewer, lalu tombol thumbnail akan aktif.
				</p>
			{/if}

			{#if thumbnailStatus === 'success'}
				<p class="mt-3 text-xs leading-relaxed text-success" role="status">{thumbnailMessage}</p>
			{:else if thumbnailStatus === 'error'}
				<p class="mt-3 text-xs leading-relaxed text-danger" role="alert">{thumbnailMessage}</p>
			{/if}

			<p class="field-help mt-2">
				Jika aset panorama yang sama dipakai beberapa scene, thumbnail mengikuti pengambilan
				terakhir.
			</p>
		</div>
	</section>

	<section id="scene-translations" class="surface scroll-mt-40 p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">03</span>
			<h2 class="title-sm text-heading">Terjemahan</h2>
		</div>

		<div class="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-10">
			<div>
				<h3 class="meta text-gold-dark">Bahasa Indonesia</h3>
				<label class="mt-4 block">
					<span class="field-label">Judul</span>
					<input
						type="text"
						name="titleId"
						bind:value={form.titleId}
						required
						class="field-input"
					/>
					{#if errors.titleId}<p class="field-error">{errors.titleId}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class="field-label">Deskripsi</span>
					<textarea
						name="descriptionId"
						rows="4"
						required
						class="field-input"
						bind:value={form.descriptionId}></textarea>
					{#if errors.descriptionId}<p class="field-error">{errors.descriptionId}</p>{/if}
				</label>
			</div>

			<div class="border-t border-charcoal/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
				<h3 class="meta text-gold-dark">English</h3>
				<label class="mt-4 block">
					<span class="field-label">Title</span>
					<input
						type="text"
						name="titleEn"
						bind:value={form.titleEn}
						required
						class="field-input"
					/>
					{#if errors.titleEn}<p class="field-error">{errors.titleEn}</p>{/if}
				</label>
				<label class="mt-4 block">
					<span class="field-label">Description</span>
					<textarea
						name="descriptionEn"
						rows="4"
						required
						class="field-input"
						bind:value={form.descriptionEn}></textarea>
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
			class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-heading"
		>
			<Icon name="arrow-left" class="h-3.5 w-3.5" />
			Batal
		</a>
	</div>
</form>
