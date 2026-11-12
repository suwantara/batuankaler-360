<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import VisitField from './VisitField.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { HomeSeo } from '#lib/schemas/home-content.ts';

	let {
		data = $bindable(),
		locale
	}: {
		data: HomeSeo;
		locale: Locale;
	} = $props();

	const tag = $derived(locale === 'id' ? 'ID' : 'EN');
</script>

<details class="surface p-5 sm:p-6">
	<summary
		class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
	>
		<div class="flex items-center gap-3">
			<Icon name="globe" class="h-4 w-4 text-gold-dark/65" />
			<h3 class="title-sm text-heading">SEO halaman ({tag})</h3>
		</div>
		<Icon
			name="chevron-down"
			class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
		/>
	</summary>

	<div class="mt-5 grid gap-5">
		<VisitField
			name={`${locale}-seo-title`}
			label={`Judul SEO (${tag})`}
			bind:value={data.title}
			hint="Dipakai sebagai judul tab browser dan hasil pencarian. Kosongkan untuk memakai default."
		/>
		<VisitField
			name={`${locale}-seo-description`}
			label={`Deskripsi SEO (${tag})`}
			bind:value={data.description}
			multiline
			rows={3}
			hint="Idealnya 150–160 karakter. Kosongkan untuk memakai deskripsi default."
		/>
	</div>
</details>
