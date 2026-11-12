<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { HomeContentFormValues } from '#lib/schemas/home-content.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { SiteMediaAsset } from '#lib/types/site-page.ts';
	import HomeLocaleFields from './HomeLocaleFields.svelte';
	import HomeSeoFields from './HomeSeoFields.svelte';

	let {
		values,
		assets = [],
		errors = {},
		action
	}: {
		values: HomeContentFormValues;
		assets?: SiteMediaAsset[];
		errors?: Record<string, string>;
		action: string;
	} = $props();

	let activeLocale = $state<Locale>('id');

	// Local editable copy of server values; reset when a form action returns new values.
	// svelte-ignore state_referenced_locally
	// eslint-disable-next-line svelte/prefer-writable-derived
	let form = $state<HomeContentFormValues>(structuredClone(values));

	$effect(() => {
		form = structuredClone(values);
	});

	const contentPayload = $derived(JSON.stringify(form.content));
	const seoPayload = $derived(JSON.stringify(form.seo));
	const mediaPayload = $derived(JSON.stringify(form.media));
	const payloadError = $derived(
		Object.entries(errors).find(
			([key]) =>
				key === 'content' ||
				key === 'seo' ||
				key === 'media' ||
				key.startsWith('content.') ||
				key.startsWith('seo.') ||
				key.startsWith('media.')
		)?.[1] ?? ''
	);

	const selectedHero = $derived(assets.find((asset) => asset.id === form.media.heroAssetId));
	const selectedPreview = $derived(assets.find((asset) => asset.id === form.media.previewAssetId));
	const heroImageSrc = $derived(
		selectedHero ? selectedHero.thumbnailPath : '/images/panoramas/scene-jaba-thumb.jpg'
	);
	const previewImageSrc = $derived(
		selectedPreview ? selectedPreview.thumbnailPath : '/images/panoramas/scene-jaba-thumb.jpg'
	);

	function fileName(path: string): string {
		return path.split('/').pop() ?? path;
	}
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	<input type="hidden" name="content" value={contentPayload} />
	<input type="hidden" name="seo" value={seoPayload} />
	<input type="hidden" name="media" value={mediaPayload} />

	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	{#if payloadError}
		<div class="alert alert--error" role="alert">Periksa isian beranda: {payloadError}</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">00</span>
			<h2 class="title-sm text-heading">Publikasi</h2>
		</div>

		<div class="mt-5 flex flex-col gap-5">
			<div class="max-w-md">
				<label class="block">
					<span class="field-label">Status</span>
					<select name="status" class="field-input" bind:value={form.status}>
						<option value="draft">Draf</option>
						<option value="published">Tayang</option>
					</select>
					<span class="field-help">Beranda hanya memakai konten ini setelah status Tayang.</span>
					{#if errors.status}<p class="field-error">{errors.status}</p>{/if}
				</label>
			</div>

			<div>
				<p class="field-label">Bahasa yang sedang diedit</p>
				<div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Pilih bahasa">
					<button
						type="button"
						onclick={() => (activeLocale = 'id')}
						aria-pressed={activeLocale === 'id'}
						class="rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors {activeLocale ===
						'id'
							? 'border-navy bg-navy text-ivory'
							: 'border-line/20 text-heading hover:border-gold-dark hover:text-gold-dark'}"
					>
						Bahasa Indonesia
					</button>
					<button
						type="button"
						onclick={() => (activeLocale = 'en')}
						aria-pressed={activeLocale === 'en'}
						class="rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors {activeLocale ===
						'en'
							? 'border-navy bg-navy text-ivory'
							: 'border-line/20 text-heading hover:border-gold-dark hover:text-gold-dark'}"
					>
						English
					</button>
				</div>

				<p class="field-help mt-2">
					Kedua bahasa disimpan bersama. Konten Inggris yang kosong akan memakai fallback Indonesia.
				</p>
			</div>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-center gap-3 border-b border-charcoal/10 pb-4">
			<Icon name="image" class="h-4 w-4 text-gold-dark/65" />
			<h2 class="title-sm text-heading">Gambar halaman</h2>
		</div>

		<p class="field-help mt-4">
			Gambar dipakai bersama untuk kedua bahasa. Pilih dari aset panorama yang sudah diunggah;
			kosongkan untuk memakai gambar bawaan.
		</p>

		<div class="mt-5 grid gap-6 lg:grid-cols-2">
			<div>
				<label class="block">
					<span class="field-label">Gambar hero</span>
					<select class="field-input" bind:value={form.media.heroAssetId}>
						<option value="">Ilustrasi default</option>
						{#each assets as asset (asset.id)}
							<option value={asset.id}>
								{fileName(asset.originalPath)} · {asset.width}×{asset.height ?? '—'}
							</option>
						{/each}
					</select>
					<span class="field-help">
						Tampil pada latar dan bingkai utama bagian pembuka beranda.
					</span>
				</label>

				<div class="mt-3 aspect-[16/9] overflow-hidden border border-charcoal/10 bg-sand">
					<img src={heroImageSrc} alt="Pratinjau gambar hero" class="h-full w-full object-cover" />
				</div>
			</div>

			<div>
				<label class="block">
					<span class="field-label">Gambar pratinjau virtual tour</span>
					<select class="field-input" bind:value={form.media.previewAssetId}>
						<option value="">Gambar default</option>
						{#each assets as asset (asset.id)}
							<option value={asset.id}>
								{fileName(asset.originalPath)} · {asset.width}×{asset.height ?? '—'}
							</option>
						{/each}
					</select>
					<span class="field-help">Tampil pada kartu pratinjau di bagian virtual tour.</span>
				</label>

				<div class="mt-3 aspect-[16/10] overflow-hidden border border-charcoal/10 bg-sand">
					<img
						src={previewImageSrc}
						alt="Pratinjau gambar virtual tour"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>
		</div>

		{#if assets.length === 0}
			<p class="mt-4 text-xs leading-relaxed text-muted">
				Belum ada aset panorama.
				<a
					href={resolve('admin/media/upload')}
					class="font-semibold text-heading underline underline-offset-2"
				>
					Unggah aset
				</a>
				terlebih dahulu untuk memakai gambar sendiri.
			</p>
		{/if}
	</section>

	<div class:hidden={activeLocale !== 'id'}>
		<div class="flex flex-col gap-4">
			<HomeLocaleFields bind:data={form.content.id} locale="id" />
			<HomeSeoFields bind:data={form.seo.id} locale="id" />
		</div>
	</div>

	<div class:hidden={activeLocale !== 'en'}>
		<div class="flex flex-col gap-4">
			<HomeLocaleFields bind:data={form.content.en} locale="en" />
			<HomeSeoFields bind:data={form.seo.en} locale="en" />
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" class="btn btn--primary">
			Simpan beranda
			<Icon name="check" class="h-4 w-4" />
		</button>
	</div>
</form>
