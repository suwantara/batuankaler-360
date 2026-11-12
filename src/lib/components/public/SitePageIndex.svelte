<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
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

	const sections = $derived(
		page.blocks.filter((block) => block.type === 'section' && block.body.trim() !== '')
	);

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
			<div
				class="flex max-w-3xl items-start gap-4 border-l-2 border-gold-dark/50 bg-ivory px-5 py-5 sm:px-6"
			>
				<Icon name="info" class="mt-0.5 h-5 w-5 shrink-0 text-gold-dark/70" />
				<p class="text-sm leading-relaxed text-body">{page.verificationNote}</p>
			</div>
		{/if}

		{#if page.fallbackUsed}
			<div class="alert alert--info mt-6 max-w-3xl">{labels.fallback}</div>
		{/if}

		{#if sections.length === 0}
			<p class="surface surface--sand mt-10 p-5 text-sm leading-relaxed text-muted">
				{labels.empty}
			</p>
		{:else}
			<div class="mt-10 border-b border-charcoal/12">
				{#each sections as block, index (block.id)}
					<div
						class="grid gap-3 border-t border-charcoal/12 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:py-7"
					>
						<span class="font-display text-lg leading-none text-gold-dark/60">
							{String(index + 1).padStart(2, '0')}
						</span>
						<div>
							<h2
								class="font-display text-2xl leading-tight tracking-tight text-navy sm:text-[1.65rem]"
							>
								{block.heading}
							</h2>
							<p class="mt-2 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-body">
								{block.body}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<p class="mt-6 text-xs text-muted">{labels.updated}: {updatedLabel}</p>
	</div>
</section>
