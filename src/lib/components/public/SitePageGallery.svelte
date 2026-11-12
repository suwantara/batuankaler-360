<script lang="ts">
	import GalleryCard from '#lib/components/public/GalleryCard.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { SitePageView } from '#lib/types/site-page.ts';

	let {
		page,
		labels,
		lang
	}: {
		page: SitePageView;
		labels: { updated: string; empty: string; fallback: string };
		lang: Locale;
	} = $props();

	const items = $derived(page.blocks.filter((block) => block.type === 'section'));

	const updatedLabel = $derived(
		new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(page.updatedAt))
	);
</script>

<section class="section section--paper">
	<div class="container-page">
		{#if page.verificationNote}
			<div class="max-w-3xl border-l-2 border-gold-dark/50 bg-ivory px-5 py-5 sm:px-6">
				<p class="text-sm leading-relaxed text-body">{page.verificationNote}</p>
			</div>
		{/if}

		{#if page.fallbackUsed}
			<div class="alert alert--info mt-6 max-w-3xl">{labels.fallback}</div>
		{/if}

		{#if items.length === 0}
			<p class="surface surface--sand mt-10 p-5 text-sm leading-relaxed text-muted">
				{labels.empty}
			</p>
		{:else}
			<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each items as item, index (item.id)}
					<div class={index === 1 ? 'lg:mt-10' : ''}>
						<GalleryCard title={item.heading} caption={item.body} {index} />
					</div>
				{/each}
			</div>
		{/if}

		<p class="mt-6 text-xs text-muted">{labels.updated}: {updatedLabel}</p>
	</div>
</section>
