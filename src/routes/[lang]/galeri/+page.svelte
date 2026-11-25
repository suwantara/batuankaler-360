<script lang="ts">
	import GalleryCard from '#lib/components/public/GalleryCard.svelte';
	import GalleryPhotoCard from '#lib/components/public/GalleryPhotoCard.svelte';
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SeoHead from '#lib/components/public/SeoHead.svelte';
	import SitePageGallery from '#lib/components/public/SitePageGallery.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { SITE_NAME } from '#lib/seo.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.galeri);
	const page = $derived(data.page);
	const gallery = $derived(data.gallery);
	const hasFallback = $derived(gallery.some((item) => item.fallbackUsed));

	let lightboxIndex = $state<number | null>(null);
	let lightboxDialog: HTMLDialogElement | undefined = $state();

	function openLightbox(index: number): void {
		if (!gallery[index]) return;

		lightboxIndex = index;
		lightboxDialog?.showModal();
	}

	function closeLightbox(): void {
		lightboxDialog?.close();
	}

	function stepLightbox(delta: number): void {
		if (lightboxIndex === null || gallery.length === 0) return;

		lightboxIndex = (lightboxIndex + delta + gallery.length) % gallery.length;
	}

	function handleLightboxKeydown(event: KeyboardEvent): void {
		if (lightboxIndex === null) return;

		if (event.key === 'ArrowLeft') {
			stepLightbox(-1);
		} else if (event.key === 'ArrowRight') {
			stepLightbox(1);
		}
	}
</script>

<svelte:window onkeydown={handleLightboxKeydown} />

<SeoHead
	lang={data.lang}
	origin={data.origin}
	title={`${page?.title || pageContent.title} | ${SITE_NAME}`}
	description={page?.description || pageContent.description}
	path="/galeri"
	image={gallery[0]?.imagePath}
	breadcrumbs={[
		{ name: content.nav[0]?.label ?? 'Beranda', path: '/' },
		{ name: content.nav[4]?.label ?? 'Galeri', path: '/galeri' }
	]}
/>

<PageIntro
	eyebrow={page?.eyebrow || pageContent.eyebrow}
	title={page?.title || pageContent.title}
	description={page?.description || pageContent.description}
/>

{#if gallery.length > 0}
	<section class="section section--paper">
		<div class="container-page">
			{#if hasFallback}
				<div class="alert alert--info mb-8">{pageContent.fallback}</div>
			{/if}

			<div class="columns-1 gap-6 sm:columns-2 lg:columns-3">
				{#each gallery as item, index (item.id)}
					<div class="mb-6 break-inside-avoid">
						<GalleryPhotoCard {item} {index} onopen={openLightbox} />
					</div>
				{/each}
			</div>
		</div>
	</section>
{:else if page}
	<SitePageGallery {page} labels={pageContent} lang={data.lang} />
{:else}
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
{/if}

<dialog
	bind:this={lightboxDialog}
	onclose={() => (lightboxIndex = null)}
	onclick={(event) => {
		if (event.target === lightboxDialog) closeLightbox();
	}}
	class="m-auto max-h-[94dvh] max-w-[94dvw] bg-transparent p-0 backdrop:bg-ink/85"
	aria-label="Pratinjau foto galeri"
>
	{#if lightboxIndex !== null}
		{@const item = gallery[lightboxIndex]}
		<figure class="flex max-h-[94dvh] flex-col items-center gap-4 p-4 sm:p-6">
			<img
				src={item.imagePath}
				alt={item.title}
				class="max-h-[74dvh] w-auto max-w-full rounded border border-ivory/20 object-contain"
			/>
			<figcaption
				class="flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-ivory"
			>
				<div class="min-w-0">
					<p class="truncate font-display text-lg leading-snug">{item.title}</p>
					{#if item.caption}
						<p class="mt-1 truncate text-xs text-ivory/60">{item.caption}</p>
					{/if}
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<button
						type="button"
						onclick={() => stepLightbox(-1)}
						aria-label="Foto sebelumnya"
						class="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold-light hover:text-gold-light"
					>
						<Icon name="arrow-left" class="h-4 w-4" />
					</button>
					<span class="min-w-16 text-center text-xs text-ivory/70">
						{lightboxIndex + 1} / {gallery.length}
					</span>
					<button
						type="button"
						onclick={() => stepLightbox(1)}
						aria-label="Foto berikutnya"
						class="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold-light hover:text-gold-light"
					>
						<Icon name="arrow-right" class="h-4 w-4" />
					</button>
					<button
						type="button"
						onclick={closeLightbox}
						aria-label="Tutup pratinjau"
						class="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold-light hover:text-gold-light"
					>
						<Icon name="close" class="h-4 w-4" />
					</button>
				</div>
			</figcaption>
		</figure>
	{/if}
</dialog>
