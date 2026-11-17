<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { AreaFormValues } from '#lib/schemas/area.ts';

	let {
		values,
		errors = {},
		action,
		submitLabel
	}: {
		values: AreaFormValues;
		errors?: Record<string, string>;
		action: string;
		submitLabel: string;
	} = $props();

	// Local editable copy; reset when a form action returns new values.
	// svelte-ignore state_referenced_locally
	let form = $state<AreaFormValues>({ ...values });

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

	function errorFor(name: keyof AreaFormValues): string | undefined {
		return errors[name];
	}
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<div>
				<h2 class="title-sm text-heading">Informasi area</h2>
				<p class="field-help">Slug dipakai pada alamat halaman publik area.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block">
				<span class="field-label">Slug</span>
				<input
					type="text"
					name="slug"
					bind:value={form.slug}
					required
					maxlength="120"
					class="field-input"
					placeholder="jaba-pura"
				/>
				{#if errorFor('slug')}
					<p class="field-error mt-1.5" role="alert">{errorFor('slug')}</p>
				{:else}
					<span class="field-help">Huruf kecil, angka, dan tanda hubung.</span>
				{/if}
			</label>

			<label class="block">
				<span class="field-label">Status</span>
				<select name="status" bind:value={form.status} class="field-input">
					<option value="draft">Draf</option>
					<option value="published">Tayang</option>
				</select>
				<span class="field-help">Area hanya tampil di situs publik setelah Tayang.</span>
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
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<div>
				<h2 class="title-sm text-heading">Terjemahan</h2>
				<p class="field-help">Bahasa Indonesia wajib untuk area yang ditayangkan.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-6 lg:grid-cols-2">
			<div class="flex flex-col gap-4">
				<p class="meta text-gold-dark">Bahasa Indonesia</p>

				<label class="block">
					<span class="field-label">Judul area</span>
					<input
						type="text"
						name="titleId"
						bind:value={form.titleId}
						maxlength="200"
						class="field-input"
						placeholder="Jaba Pura"
					/>
					{#if errorFor('titleId')}
						<p class="field-error mt-1.5" role="alert">{errorFor('titleId')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="field-label">Deskripsi</span>
					<textarea
						name="descriptionId"
						bind:value={form.descriptionId}
						rows="6"
						maxlength="5000"
						class="field-input"></textarea>
					{#if errorFor('descriptionId')}
						<p class="field-error mt-1.5" role="alert">{errorFor('descriptionId')}</p>
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
					<span class="field-label">Judul area (EN)</span>
					<input
						type="text"
						name="titleEn"
						bind:value={form.titleEn}
						maxlength="200"
						class="field-input"
						placeholder="Jaba Pura"
					/>
					{#if errorFor('titleEn')}
						<p class="field-error mt-1.5" role="alert">{errorFor('titleEn')}</p>
					{/if}
				</label>

				<label class="block">
					<span class="field-label">Deskripsi (EN)</span>
					<textarea
						name="descriptionEn"
						bind:value={form.descriptionEn}
						rows="6"
						maxlength="5000"
						class="field-input"></textarea>
					{#if errorFor('descriptionEn')}
						<p class="field-error mt-1.5" role="alert">{errorFor('descriptionEn')}</p>
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
