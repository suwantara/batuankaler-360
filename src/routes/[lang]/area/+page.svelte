<script lang="ts">
	import AreaCard from '#lib/components/public/AreaCard.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.area);
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
	<div class="rounded-3xl border border-gold/30 bg-gold/5 p-6 sm:p-8">
		<p class="text-sm leading-relaxed text-charcoal/75">{pageContent.notice}</p>
	</div>

	<div class="mt-10 grid gap-5 md:grid-cols-3">
		{#each content.home.areas.items as area, index (area.name)}
			<AreaCard
				name={area.name}
				description={area.description}
				{index}
				href={localeHref(data.lang, '/area')}
				tone="light"
			/>
		{/each}
	</div>
</section>
