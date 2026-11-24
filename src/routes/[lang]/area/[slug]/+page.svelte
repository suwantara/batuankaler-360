<script lang="ts">
	import PageIntro from '#lib/components/public/PageIntro.svelte';
	import SeoHead from '#lib/components/public/SeoHead.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import { SITE_NAME } from '#lib/seo.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const pageContent = $derived(content.pages.area);
	const area = $derived(data.area);
</script>

<SeoHead
	lang={data.lang}
	origin={data.origin}
	title={`${area.title} | ${SITE_NAME}`}
	description={area.description}
	path={`/area/${area.slug}`}
	image={area.scenes[0]?.thumbnail}
	type="article"
	breadcrumbs={[
		{ name: content.nav[0]?.label ?? 'Beranda', path: '/' },
		{ name: content.nav[3]?.label ?? 'Area', path: '/area' },
		{ name: area.title, path: `/area/${area.slug}` }
	]}
/>

<PageIntro eyebrow={pageContent.eyebrow} title={area.title} description={area.description} />

<section class="section section--paper">
	<div class="container-page">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="eyebrow">{pageContent.detailScenesTitle}</p>
				<h2 class="display-lg mt-4 text-navy">{area.title}</h2>
				<p class="body-copy mt-3 max-w-2xl">{pageContent.detailScenesDescription}</p>
			</div>
			<a href={localeHref(data.lang, '/area')} class="link-arrow">
				<Icon name="arrow-left" class="h-3.5 w-3.5" />
				{pageContent.backToAreas}
			</a>
		</div>

		{#if area.fallbackUsed}
			<div class="alert alert--info mt-8">{pageContent.fallback}</div>
		{/if}

		{#if area.scenes.length === 0}
			<p class="surface surface--sand mt-8 p-5 text-sm leading-relaxed text-muted">
				{pageContent.detailEmpty}
			</p>
		{:else}
			<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each area.scenes as scene (scene.id)}
					<a
						href={localeHref(data.lang, `/tour/${scene.slug}`)}
						class="group overflow-hidden border border-charcoal/12 bg-ivory transition-colors hover:border-gold-dark/45"
					>
						<div class="aspect-[16/10] overflow-hidden bg-sand">
							<img
								src={scene.thumbnail}
								alt=""
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
							/>
						</div>
						<div class="p-5">
							<p class="meta text-gold-dark">360°</p>
							<h3 class="mt-2 font-display text-2xl leading-tight text-navy">
								{scene.title}
							</h3>
							<p class="mt-2 text-sm leading-relaxed text-body">{scene.description}</p>
							<span class="link-arrow mt-4">
								{content.actions.exploreTour}
								<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
