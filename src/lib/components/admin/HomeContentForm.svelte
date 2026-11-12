<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { HomeContentFormValues } from '#lib/schemas/home-content.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import HomeLocaleFields from './HomeLocaleFields.svelte';

	let {
		values,
		errors = {},
		action
	}: {
		values: HomeContentFormValues;
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
	const contentError = $derived(
		Object.entries(errors).find(([key]) => key === 'content' || key.startsWith('content.'))?.[1] ??
			''
	);
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	<input type="hidden" name="content" value={contentPayload} />

	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	{#if contentError}
		<div class="alert alert--error" role="alert">Periksa konten beranda: {contentError}</div>
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

	<div class:hidden={activeLocale !== 'id'}>
		<HomeLocaleFields bind:data={form.content.id} locale="id" />
	</div>

	<div class:hidden={activeLocale !== 'en'}>
		<HomeLocaleFields bind:data={form.content.en} locale="en" />
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" class="btn btn--primary">
			Simpan beranda
			<Icon name="check" class="h-4 w-4" />
		</button>
	</div>
</form>
