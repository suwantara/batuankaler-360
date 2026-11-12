<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import Ornament from '#lib/components/ui/Ornament.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.sejarah);
</script>

<svelte:head>
	<title>{pageContent.title} — {content.meta.title}</title>
	<meta name="description" content={pageContent.description} />
</svelte:head>

<PageIntro
	eyebrow={pageContent.eyebrow}
	title={pageContent.title}
	description={pageContent.description}
/>

<section class="section section--paper">
	<div class="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
		<div>
			<p class="eyebrow">{content.home.history.eyebrow}</p>
			<h2 class="display-xl mt-6 text-navy">{content.home.history.title}</h2>
			<Ornament class="mt-8 h-3 w-44 text-gold-dark/45" />
		</div>

		<div class="surface surface--ivory p-6 sm:p-9">
			<div
				class="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/12 pb-5"
			>
				<p class="meta text-gold-dark">{content.home.history.noteLabel}</p>
				<span class="badge badge--draft">{content.home.history.status}</span>
			</div>

			<blockquote class="mt-7">
				<p class="font-display text-2xl leading-snug text-navy italic sm:text-3xl">
					“{pageContent.notice}”
				</p>
			</blockquote>

			<p class="mt-7 border-t border-charcoal/12 pt-5 text-sm leading-relaxed text-muted">
				{content.home.history.body}
			</p>
		</div>
	</div>
</section>
