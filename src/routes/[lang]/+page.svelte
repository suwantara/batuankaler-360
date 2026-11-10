<script lang="ts">
	import AreaCard from '#lib/components/public/AreaCard.svelte';
	import GalleryCard from '#lib/components/public/GalleryCard.svelte';
	import GuideCard from '#lib/components/public/GuideCard.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);

	function href(path = '') {
		return localeHref(data.lang, path);
	}
</script>

<svelte:head>
	<title>{content.meta.title}</title>
	<meta name="description" content={content.meta.description} />
</svelte:head>

<section class="relative isolate overflow-hidden bg-navy">
	<img
		src="/images/hero-pura.svg"
		alt=""
		class="absolute inset-0 h-full w-full object-cover opacity-80"
	/>
	<div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/20"></div>
	<div class="container-page relative flex min-h-[82vh] flex-col justify-end pt-32 pb-16 sm:pb-24">
		<p class="text-xs font-semibold tracking-[0.28em] text-gold-light uppercase">
			{content.home.hero.eyebrow}
		</p>
		<h1
			class="mt-5 max-w-3xl font-display text-5xl leading-[1.04] text-ivory sm:text-6xl lg:text-7xl"
		>
			{content.home.hero.title}
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/75">
			{content.home.hero.description}
		</p>
		<div class="mt-9 flex flex-wrap gap-3">
			<a
				href={href('/tour')}
				class="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-gold/90"
			>
				{content.actions.exploreTour}
			</a>
			<a
				href={href('/sejarah')}
				class="rounded-full border border-ivory/30 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:border-gold-light hover:text-gold-light"
			>
				{content.actions.learnHistory}
			</a>
		</div>
		<p class="mt-12 text-xs tracking-[0.2em] text-ivory/50 uppercase">
			{content.home.hero.note}
		</p>
	</div>
</section>

<section class="container-page py-20 sm:py-28">
	<div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
		<div>
			<p class="eyebrow">{content.home.intro.eyebrow}</p>
			<h2 class="mt-4 max-w-xl font-display text-4xl leading-tight text-navy sm:text-5xl">
				{content.home.intro.title}
			</h2>
		</div>
		<div>
			<p class="text-lg leading-relaxed text-charcoal/70">{content.home.intro.body}</p>
			<dl class="mt-10 grid gap-6 sm:grid-cols-3">
				{#each content.home.intro.points as point (point.title)}
					<div class="border-t border-navy/15 pt-4">
						<dt class="text-sm font-semibold text-navy">{point.title}</dt>
						<dd class="mt-2 text-sm leading-relaxed text-charcoal/65">{point.body}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>

<section class="border-y border-navy/10 bg-sand/60">
	<div class="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
		<div>
			<p class="eyebrow">{content.home.tour.eyebrow}</p>
			<h2 class="mt-4 max-w-xl font-display text-4xl leading-tight text-navy sm:text-5xl">
				{content.home.tour.title}
			</h2>
			<p class="mt-6 max-w-xl text-base leading-relaxed text-charcoal/70">
				{content.home.tour.body}
			</p>
			<a
				href={href('/tour')}
				class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold-dark"
			>
				{content.actions.exploreTour}
				<span aria-hidden="true">→</span>
			</a>
		</div>

		<a
			href={href('/tour')}
			class="group relative block overflow-hidden rounded-[2rem] border border-navy/10 bg-navy"
		>
			<img
				src="/images/panoramas/scene-jaba.jpg"
				alt={content.home.tour.previewLabel}
				class="aspect-[16/10] w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent"></div>
			<div class="absolute inset-0 flex items-center justify-center">
				<span
					class="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/50 bg-ivory/10 text-ivory backdrop-blur transition group-hover:border-gold-light group-hover:text-gold-light"
				>
					<svg class="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7L8 5Z" />
					</svg>
				</span>
			</div>
			<p class="absolute bottom-5 left-5 text-xs tracking-[0.2em] text-ivory/70 uppercase">
				{content.home.tour.previewLabel}
			</p>
		</a>
	</div>
</section>

<section class="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_1fr]">
	<div class="rounded-[2rem] bg-navy p-8 text-ivory sm:p-12">
		<p class="eyebrow text-gold-light">{content.home.history.eyebrow}</p>
		<h2 class="mt-4 font-display text-4xl leading-tight sm:text-5xl">
			{content.home.history.title}
		</h2>
	</div>
	<div class="flex flex-col justify-center">
		<p class="text-lg leading-relaxed text-charcoal/70">{content.home.history.body}</p>
		<a
			href={href('/sejarah')}
			class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold-dark"
		>
			{content.actions.readHistory}
			<span aria-hidden="true">→</span>
		</a>
	</div>
</section>

<section class="bg-sand/60 py-20 text-charcoal sm:py-28">
	<div class="container-page">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p class="eyebrow text-gold-dark">{content.home.areas.eyebrow}</p>
				<h2 class="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
					{content.home.areas.title}
				</h2>
			</div>
			<a
				href={href('/area')}
				class="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark transition-colors hover:text-navy"
			>
				{content.actions.viewAllAreas}
				<span aria-hidden="true">→</span>
			</a>
		</div>
		<p class="mt-6 max-w-2xl text-sm leading-relaxed text-charcoal/65">
			{content.home.areas.body}
		</p>

		<div class="mt-12 grid gap-5 md:grid-cols-3">
			{#each content.home.areas.items as area, index (area.name)}
				<AreaCard
					name={area.name}
					description={area.description}
					{index}
					href={href('/area')}
					tone="light"
				/>
			{/each}
		</div>
	</div>
</section>

<section class="container-page py-20 sm:py-28">
	<div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">{content.home.gallery.eyebrow}</p>
			<h2 class="mt-4 max-w-2xl font-display text-4xl leading-tight text-navy sm:text-5xl">
				{content.home.gallery.title}
			</h2>
		</div>
		<a
			href={href('/galeri')}
			class="inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold-dark"
		>
			{content.actions.openGallery}
			<span aria-hidden="true">→</span>
		</a>
	</div>
	<p class="mt-6 max-w-2xl text-base leading-relaxed text-charcoal/70">
		{content.home.gallery.body}
	</p>

	<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each content.home.gallery.items as item, index (item.title)}
			<GalleryCard title={item.title} caption={item.caption} {index} />
		{/each}
	</div>
</section>

<section class="bg-sand/60 py-20 sm:py-28">
	<div class="container-page">
		<div class="max-w-3xl">
			<p class="eyebrow">{content.home.guide.eyebrow}</p>
			<h2 class="mt-4 font-display text-4xl leading-tight text-navy sm:text-5xl">
				{content.home.guide.title}
			</h2>
			<p class="mt-6 text-base leading-relaxed text-charcoal/70">
				{content.home.guide.body}
			</p>
		</div>

		<div class="mt-12 grid gap-5 md:grid-cols-3">
			{#each content.home.guide.items as item, index (item.title)}
				<GuideCard title={item.title} body={item.body} {index} />
			{/each}
		</div>

		<a
			href={href('/panduan')}
			class="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold-dark"
		>
			{content.actions.readGuide}
			<span aria-hidden="true">→</span>
		</a>
	</div>
</section>
