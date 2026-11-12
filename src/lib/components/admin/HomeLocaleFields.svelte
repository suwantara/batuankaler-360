<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import VisitField from './VisitField.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { HomeContent } from '#lib/schemas/home-content.ts';

	let {
		data = $bindable(),
		locale
	}: {
		data: HomeContent;
		locale: Locale;
	} = $props();

	const tag = $derived(locale === 'id' ? 'ID' : 'EN');
</script>

<div class="flex flex-col gap-4">
	<details class="surface p-5 sm:p-6" open>
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<h3 class="title-sm text-heading">Hero</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-hero-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.hero.eyebrow}
			/>
			<VisitField
				name={`${locale}-hero-title`}
				label={`Judul meta (${tag})`}
				bind:value={data.hero.title}
				hint="Dipakai sebagai judul alternatif bila diperlukan."
			/>
			<VisitField
				name={`${locale}-hero-title-lead`}
				label={`Baris utama judul (${tag})`}
				bind:value={data.hero.titleLead}
			/>
			<VisitField
				name={`${locale}-hero-title-accent`}
				label={`Baris aksen judul (${tag})`}
				bind:value={data.hero.titleAccent}
			/>
			<VisitField
				name={`${locale}-hero-description`}
				label={`Deskripsi hero (${tag})`}
				bind:value={data.hero.description}
				multiline
				rows={4}
				class="sm:col-span-2"
			/>
			<VisitField
				name={`${locale}-hero-note`}
				label={`Catatan hero (${tag})`}
				bind:value={data.hero.note}
			/>
			<VisitField
				name={`${locale}-hero-view-label`}
				label={`Label pratinjau (${tag})`}
				bind:value={data.hero.viewLabel}
			/>

			<div class="border-t border-charcoal/10 pt-4 sm:col-span-2">
				<p class="meta text-gold-dark">Metadata hero</p>
				<div class="mt-3 grid gap-3 sm:grid-cols-3">
					{#each data.hero.meta as item, index (index)}
						<div class="rounded-md border border-heading/10 bg-ivory p-3">
							<VisitField
								name={`${locale}-hero-meta-${index}-label`}
								label={`Label ${index + 1} (${tag})`}
								bind:value={item.label}
							/>
							<VisitField
								name={`${locale}-hero-meta-${index}-value`}
								label={`Nilai ${index + 1} (${tag})`}
								bind:value={item.value}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
				<h3 class="title-sm text-heading">Pengenalan</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-intro-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.intro.eyebrow}
			/>
			<VisitField
				name={`${locale}-intro-title`}
				label={`Judul (${tag})`}
				bind:value={data.intro.title}
			/>
			<VisitField
				name={`${locale}-intro-body`}
				label={`Isi pengenalan (${tag})`}
				bind:value={data.intro.body}
				multiline
				rows={4}
				class="sm:col-span-2"
			/>

			<div class="border-t border-charcoal/10 pt-4 sm:col-span-2">
				<p class="meta text-gold-dark">Poin pengenalan</p>
				<div class="mt-3 grid gap-3 lg:grid-cols-3">
					{#each data.intro.points as point, index (index)}
						<div class="rounded-md border border-heading/10 bg-ivory p-3">
							<VisitField
								name={`${locale}-intro-point-${index}-title`}
								label={`Poin ${index + 1} — judul (${tag})`}
								bind:value={point.title}
							/>
							<VisitField
								name={`${locale}-intro-point-${index}-body`}
								label={`Poin ${index + 1} — isi (${tag})`}
								bind:value={point.body}
								multiline
								rows={3}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">03</span>
				<h3 class="title-sm text-heading">Virtual tour</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-tour-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.tour.eyebrow}
			/>
			<VisitField
				name={`${locale}-tour-title`}
				label={`Judul (${tag})`}
				bind:value={data.tour.title}
			/>
			<VisitField
				name={`${locale}-tour-body`}
				label={`Isi (${tag})`}
				bind:value={data.tour.body}
				multiline
				rows={4}
				class="sm:col-span-2"
			/>
			<VisitField
				name={`${locale}-tour-preview-label`}
				label={`Label pratinjau (${tag})`}
				bind:value={data.tour.previewLabel}
			/>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">04</span>
				<h3 class="title-sm text-heading">Sejarah singkat</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-history-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.history.eyebrow}
			/>
			<VisitField
				name={`${locale}-history-title`}
				label={`Judul (${tag})`}
				bind:value={data.history.title}
			/>
			<VisitField
				name={`${locale}-history-body`}
				label={`Isi (${tag})`}
				bind:value={data.history.body}
				multiline
				rows={4}
				class="sm:col-span-2"
			/>
			<VisitField
				name={`${locale}-history-note-label`}
				label={`Label catatan (${tag})`}
				bind:value={data.history.noteLabel}
			/>
			<VisitField
				name={`${locale}-history-status`}
				label={`Status catatan (${tag})`}
				bind:value={data.history.status}
			/>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">05</span>
				<h3 class="title-sm text-heading">Area</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-areas-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.areas.eyebrow}
			/>
			<VisitField
				name={`${locale}-areas-title`}
				label={`Judul (${tag})`}
				bind:value={data.areas.title}
			/>
			<VisitField
				name={`${locale}-areas-body`}
				label={`Isi (${tag})`}
				bind:value={data.areas.body}
				multiline
				rows={3}
				class="sm:col-span-2"
			/>

			<div class="border-t border-charcoal/10 pt-4 sm:col-span-2">
				<p class="meta text-gold-dark">Tiga area unggulan</p>
				<div class="mt-3 grid gap-3 lg:grid-cols-3">
					{#each data.areas.items as area, index (index)}
						<div class="rounded-md border border-heading/10 bg-ivory p-3">
							<VisitField
								name={`${locale}-area-${index}-name`}
								label={`Area ${index + 1} (${tag})`}
								bind:value={area.name}
							/>
							<VisitField
								name={`${locale}-area-${index}-description`}
								label={`Deskripsi area ${index + 1} (${tag})`}
								bind:value={area.description}
								multiline
								rows={3}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">06</span>
				<h3 class="title-sm text-heading">Galeri</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-gallery-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.gallery.eyebrow}
			/>
			<VisitField
				name={`${locale}-gallery-title`}
				label={`Judul (${tag})`}
				bind:value={data.gallery.title}
			/>
			<VisitField
				name={`${locale}-gallery-body`}
				label={`Isi (${tag})`}
				bind:value={data.gallery.body}
				multiline
				rows={3}
				class="sm:col-span-2"
			/>
			<VisitField
				name={`${locale}-gallery-pending`}
				label={`Label dokumentasi menyusul (${tag})`}
				bind:value={data.gallery.pending}
			/>

			<div class="border-t border-charcoal/10 pt-4 sm:col-span-2">
				<p class="meta text-gold-dark">Tiga item galeri</p>
				<div class="mt-3 grid gap-3 lg:grid-cols-3">
					{#each data.gallery.items as item, index (index)}
						<div class="rounded-md border border-heading/10 bg-ivory p-3">
							<VisitField
								name={`${locale}-gallery-${index}-title`}
								label={`Item ${index + 1} — judul (${tag})`}
								bind:value={item.title}
							/>
							<VisitField
								name={`${locale}-gallery-${index}-caption`}
								label={`Item ${index + 1} — keterangan (${tag})`}
								bind:value={item.caption}
								multiline
								rows={2}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</details>

	<details class="surface p-5 sm:p-6">
		<summary
			class="group flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"
		>
			<div class="flex items-baseline gap-3">
				<span class="font-display text-lg leading-none text-gold-dark/55">07</span>
				<h3 class="title-sm text-heading">Panduan</h3>
			</div>
			<Icon
				name="chevron-down"
				class="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
			/>
		</summary>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name={`${locale}-guide-eyebrow`}
				label={`Eyebrow (${tag})`}
				bind:value={data.guide.eyebrow}
			/>
			<VisitField
				name={`${locale}-guide-title`}
				label={`Judul (${tag})`}
				bind:value={data.guide.title}
			/>
			<VisitField
				name={`${locale}-guide-body`}
				label={`Isi (${tag})`}
				bind:value={data.guide.body}
				multiline
				rows={3}
				class="sm:col-span-2"
			/>

			<div class="border-t border-charcoal/10 pt-4 sm:col-span-2">
				<p class="meta text-gold-dark">Tiga poin panduan</p>
				<div class="mt-3 grid gap-3 lg:grid-cols-3">
					{#each data.guide.items as item, index (index)}
						<div class="rounded-md border border-heading/10 bg-ivory p-3">
							<VisitField
								name={`${locale}-guide-${index}-title`}
								label={`Poin ${index + 1} — judul (${tag})`}
								bind:value={item.title}
							/>
							<VisitField
								name={`${locale}-guide-${index}-body`}
								label={`Poin ${index + 1} — isi (${tag})`}
								bind:value={item.body}
								multiline
								rows={3}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</details>
</div>
