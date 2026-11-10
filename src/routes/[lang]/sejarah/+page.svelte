<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
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

<section class="container-page py-16 sm:py-24">
	<div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
		<div>
			<p class="eyebrow">{content.home.history.eyebrow}</p>
			<h2 class="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
				{content.home.history.title}
			</h2>
		</div>
		<div class="rounded-3xl border border-gold-dark/30 bg-gold/20 p-8 sm:p-10">
			<p class="text-base leading-relaxed text-charcoal/75">{pageContent.notice}</p>
		</div>
	</div>
</section>
