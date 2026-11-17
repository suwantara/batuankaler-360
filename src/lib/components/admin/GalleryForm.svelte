<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { GalleryItemFormValues } from '#lib/schemas/gallery.ts';
	import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';

	let {
		values,
		image = null,
		errors = {},
		action,
		submitLabel
	}: {
		values: GalleryItemFormValues;
		image?: { imagePath: string; width: number; height: number } | null;
		errors?: Record<string, string>;
		action: string;
		submitLabel: string;
	} = $props();

	// Local editable copy; reset when a form action returns new values.
	// svelte-ignore state_referenced_locally
	let form = $state<GalleryItemFormValues>({ ...values });
	// svelte-ignore state_referenced_locally
	let previewUrl = $state(image?.imagePath ?? '');
	// svelte-ignore state_referenced_locally
	let lastServerPath = $state(image?.imagePath ?? '');
	let objectUrl: string | null = null;

	$effect(() => {
		const path = image?.imagePath ?? '';

		if (path === lastServerPath) return;

		lastServerPath = path;

		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}

		previewUrl = path;
	});

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

	function errorFor(name: keyof GalleryItemFormValues): string | undefined {
		return errors[name];
	}

	function handleFileChange(event: Event): void {
		const input = event.currentTarget;

		if (!(input instanceof HTMLInputElement)) return;

		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}

		const file = input.files?.[0];

		if (file) {
			objectUrl = URL.createObjectURL(file);
			previewUrl = objectUrl;
		} else {
			previewUrl = image?.imagePath ?? '';
		}
	}

	onDestroy(() => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<form method="POST" enctype="multipart/form-data" {action} class="flex flex-col gap-5">
	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<div>
				<h2 class="title-sm text-heading">Foto galeri</h2>
				<p class="field-help">File disimpan di storage server yang dikonfigurasi.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
			<div class="flex flex-col gap-5">
				<label class="block">
					<span class="field-label">{image ? 'Ganti foto (opsional)' : 'File foto'}</span>
					<input
						type="file"
						name="image"
						accept=".jpg,.jpeg,.png,.webp"
						required={!image}
						class="field-input"
						onchange={handleFileChange}
					/>
					{#if errors.image}
						<p class="field-error mt-1.5" role="alert">{errors.image}</p>
					{:else}
						<span class="field-help">
							{ALLOWED_IMAGE_LABEL}, maksimal {Math.round(UPLOAD_LIMITS.gallery / (1024 * 1024))} MB.
						</span>
					{/if}
				</label>

				<div class="grid gap-5 sm:grid-cols-2">
					<label class="block">
						<span class="field-label">Status</span>
						<select name="status" bind:value={form.status} class="field-input">
							<option value="draft">Draf</option>
							<option value="published">Tayang</option>
						</select>
						<span class="field-help">Foto tampil di situs publik setelah Tayang.</span>
					</label>

					<label class="block">
						<span class="field-label">Urutan tampil</span>
						<input
							type="number"
							name="sortOrder"
							bind:value={form.sortOrder}
							min="0"
							max="10000"
							class="field-input"
						/>
						<span class="field-help">Angka lebih kecil tampil lebih dahulu.</span>
					</label>
				</div>
			</div>

			<div>
				{#if previewUrl}
					<div class="overflow-hidden border border-charcoal/12 bg-sand">
						<img
							src={previewUrl}
							alt="Pratinjau foto galeri"
							class="aspect-[4/3] h-full w-full object-cover"
						/>
					</div>
				{:else}
					<div
						class="flex aspect-[4/3] items-center justify-center border border-dashed border-charcoal/15 bg-sand/60 text-center"
					>
						<div>
							<Icon name="image" class="mx-auto h-7 w-7 text-heading/25" />
							<p class="mt-3 text-xs text-muted">Pratinjau foto akan tampil di sini.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<div>
				<h2 class="title-sm text-heading">Judul &amp; keterangan</h2>
				<p class="field-help">Bahasa Indonesia wajib untuk foto yang ditayangkan.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-6 lg:grid-cols-2">
			<div class="flex flex-col gap-4">
				<p class="meta text-gold-dark">Bahasa Indonesia</p>

				<label class="block">
					<span class="field-label">Judul foto</span>
					<input
						type="text"
						name="titleId"
						bind:value={form.titleId}
						maxlength="200"
						class="field-input"
						placeholder="Gapura Canggi"
					/>
					{#if errorFor('titleId')}
						<p class="field-error mt-1.5" role="alert">{errorFor('titleId')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="field-label">Keterangan</span>
					<textarea
						name="captionId"
						bind:value={form.captionId}
						rows="4"
						maxlength="1000"
						class="field-input"></textarea>
					{#if errorFor('captionId')}
						<p class="field-error mt-1.5" role="alert">{errorFor('captionId')}</p>
					{/if}
				</label>
			</div>

			<div class="flex flex-col gap-4">
				<div>
					<p class="meta text-gold-dark">Bahasa Inggris</p>
					<p class="mt-1.5 text-xs leading-relaxed text-muted">
						Kosongkan jika terjemahan belum tersedia. Pengunjung versi Inggris akan melihat versi
						Indonesia dengan indikator fallback.
					</p>
				</div>

				<label class="block">
					<span class="field-label">Judul foto (EN)</span>
					<input
						type="text"
						name="titleEn"
						bind:value={form.titleEn}
						maxlength="200"
						class="field-input"
						placeholder="Canggi Gate"
					/>
					{#if errorFor('titleEn')}
						<p class="field-error mt-1.5" role="alert">{errorFor('titleEn')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="field-label">Keterangan (EN)</span>
					<textarea
						name="captionEn"
						bind:value={form.captionEn}
						rows="4"
						maxlength="1000"
						class="field-input"></textarea>
					{#if errorFor('captionEn')}
						<p class="field-error mt-1.5" role="alert">{errorFor('captionEn')}</p>
					{/if}
				</label>
			</div>
		</div>
	</section>

	<div class="flex flex-wrap items-center gap-3">
		<button type="submit" class="btn btn--primary btn--sm">
			{submitLabel}
			<Icon name="check" class="h-3.5 w-3.5" />
		</button>
		<p class="text-xs leading-relaxed text-muted">
			Perubahan langsung tersimpan setelah tombol ditekan.
		</p>
	</div>
</form>
