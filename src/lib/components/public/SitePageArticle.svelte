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
		labels: {
			toc: string;
			updated: string;
			source: string;
			empty: string;
			fallback: string;
		};
		lang: Locale;
	} = $props();

	const sections = $derived(
		page.blocks
			.map((block, index) => ({ ...block, anchor: `bagian-${index + 1}` }))
			.filter((block) => block.type === 'section' && block.heading.trim() !== '')
	);

	const updatedLabel = $derived(
		new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(page.updatedAt))
	);

	function paragraphs(body: string): string[] {
		return body
			.split(/\n{2,}/)
			.map((item) => item.trim())
			.filter(Boolean);
	}
</script>

<section class="section section--paper">
	<div
		class="container-page grid gap-10 lg:grid-cols-[13rem_minmax(0,46rem)] lg:justify-center lg:gap-16"
	>
		<aside class="lg:sticky lg:top-28 lg:self-start">
			{#if sections.length > 0}
				<p class="meta text-gold-dark">{labels.toc}</p>
				<nav class="mt-4 flex flex-col gap-2.5 border-l border-charcoal/12 pl-4">
					{#each sections as section (section.id)}
						<a
							href={`#${section.anchor}`}
							class="text-sm leading-snug text-body transition-colors hover:text-gold-dark"
						>
							{section.heading}
						</a>
					{/each}
				</nav>
			{/if}

			<div class="mt-6 border-t border-charcoal/12 pt-4">
				<p class="text-xs text-muted">{labels.updated}: {updatedLabel}</p>
				{#if page.verificationNote}
					<p class="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
						<Icon name="info" class="mt-0.5 h-4 w-4 shrink-0 text-gold-dark/70" />
						<span>{page.verificationNote}</span>
					</p>
				{/if}
			</div>
		</aside>

		<article>
			{#if page.fallbackUsed}
				<div class="alert alert--info mb-8">{labels.fallback}</div>
			{/if}

			{#if page.blocks.length === 0}
				<p class="surface surface--sand p-5 text-sm leading-relaxed text-muted">
					{labels.empty}
				</p>
			{:else}
				{#each page.blocks as block, index (block.id)}
					{#if block.type === 'section'}
						<section
							id={`bagian-${index + 1}`}
							class="scroll-mt-28 border-t border-charcoal/12 pt-8 first:border-t-0 first:pt-0"
						>
							<h2 class="display-md text-navy">{block.heading}</h2>
							<div class="mt-5 flex flex-col gap-4">
								{#each paragraphs(block.body) as paragraph, paragraphIndex (paragraphIndex)}
									<p class="body-copy whitespace-pre-line">{paragraph}</p>
								{/each}
							</div>
						</section>
					{:else if block.type === 'quote'}
						<blockquote
							class="my-10 border-l-2 border-gold-dark/50 pl-5 font-display text-2xl leading-snug text-navy italic sm:pl-7 sm:text-3xl"
						>
							<span class="whitespace-pre-line">{block.body}</span>
						</blockquote>
						{#if block.heading}
							<p class="mt-2 text-right text-xs text-muted">{block.heading}</p>
						{/if}
					{:else if block.type === 'source'}
						<aside class="surface surface--sand my-8 p-5">
							<p class="meta text-gold-dark">{block.heading || labels.source}</p>
							<p class="mt-2 text-sm leading-relaxed whitespace-pre-line text-body">
								{block.body}
							</p>
						</aside>
					{/if}
				{/each}
			{/if}
		</article>
	</div>
</section>
