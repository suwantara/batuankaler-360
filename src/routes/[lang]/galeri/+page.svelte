<script lang="ts">
	import GalleryCard from '#lib/components/public/GalleryCard.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.galeri);
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
	<div class="container-page">
		<div
			class="flex max-w-3xl items-start gap-4 border-l-2 border-gold-dark/50 bg-ivory px-5 py-5 sm:px-6"
		>
			<span class="mt-1 h-1.5 w-1.5 shrink-0 rotate-45 border border-gold-dark/60"></span>
			<p class="text-sm leading-relaxed text-body">{pageContent.notice}</p>
		</div>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each content.home.gallery.items as item, index (item.title)}
				<div class={index === 1 ? 'lg:mt-10' : ''}>
					<GalleryCard
						title={item.title}
						caption={item.caption}
						{index}
						pending={content.home.gallery.pending}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
