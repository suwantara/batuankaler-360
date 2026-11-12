<script lang="ts">
	import AreaCard from '#lib/components/public/AreaCard.svelte';
	import GalleryCard from '#lib/components/public/GalleryCard.svelte';
	import GuideCard from '#lib/components/public/GuideCard.svelte';
	import VisitInformation from '#lib/components/public/VisitInformation.svelte';
	import ArrowLink from '#lib/components/ui/ArrowLink.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Ornament from '#lib/components/ui/Ornament.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const content = $derived(dictionary[data.lang]);
	const home = $derived(data.home ?? content.home);
	const hero = $derived(home.hero);

	function href(path = '') {
		return localeHref(data.lang, path);
	}
</script>

<svelte:head>
	<title>{data.homeSeo?.title ?? content.meta.title}</title>
	<meta name="description" content={data.homeSeo?.description ?? content.meta.description} />
</svelte:head>

<!-- Hero -->
<section class="dark-surface relative isolate overflow-hidden bg-navy-deep">
	<img
		src={data.homeMedia.heroBackgroundPath}
		alt=""
		class="absolute inset-0 h-full w-full object-cover opacity-70"
	/>
	<div class="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/25"></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(242,222,168,0.16),transparent_55%)]"
	></div>

	<div
		class="container-page relative grid min-h-[34rem] gap-12 py-16 sm:py-20 lg:min-h-[44rem] lg:grid-cols-[1.06fr_0.74fr] lg:items-center lg:py-24"
	>
		<div class="max-w-3xl">
			<p class="eyebrow">{hero.eyebrow}</p>

			<h1 class="display-hero mt-6 text-ivory">
				<span class="block">{hero.titleLead}</span>
				<span class="mt-2 block text-[0.78em] leading-[1.04] text-gold-light italic">
					{hero.titleAccent}
				</span>
			</h1>

			<p class="mt-7 max-w-xl text-base leading-relaxed text-ivory/65 sm:text-lg">
				{hero.description}
			</p>

			<div class="mt-9 flex flex-wrap gap-3">
				<a href={href('/tour')} class="btn btn--gold">
					{content.actions.exploreTour}
					<Icon name="arrow-up-right" class="h-4 w-4" />
				</a>
				<a href={href('/sejarah')} class="btn btn--outline">
					{content.actions.learnHistory}
				</a>
			</div>

			<dl class="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-ivory/15 pt-5">
				{#each hero.meta as item (item.label)}
					<div>
						<dt class="meta text-[0.6rem] text-ivory/55">{item.label}</dt>
						<dd class="mt-1.5 font-display text-lg text-gold-light/85">{item.value}</dd>
					</div>
				{/each}
			</dl>
		</div>

		<div class="relative hidden lg:block">
			<div
				class="arch-frame frame-inset relative ml-auto w-full max-w-[24rem] border border-ivory/15 bg-navy"
			>
				<img
					src={data.homeMedia.heroImagePath}
					alt={hero.viewLabel}
					class="h-[32rem] w-full object-cover object-[58%_62%] opacity-85"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-navy-deep/10"
				></div>
				<div class="absolute inset-x-0 bottom-0 p-6">
					<span class="badge badge--gold">360°</span>
					<p class="mt-3 text-xs tracking-[0.16em] text-ivory/70 uppercase">{hero.viewLabel}</p>
				</div>
			</div>
			<p class="mt-5 text-right text-[0.6rem] tracking-[0.18em] text-ivory/55 uppercase">
				Pura Batuan Kaler
			</p>
		</div>
	</div>

	<div class="container-page relative pb-8">
		<div
			class="hidden max-w-2xl flex-wrap items-center gap-3 border-t border-ivory/10 pt-4 sm:flex"
		>
			{#if data.visitInfo?.heritageLabel}
				<span class="badge badge--gold">{data.visitInfo.heritageLabel}</span>
			{/if}
			<p class="text-[0.65rem] leading-relaxed tracking-[0.1em] text-ivory/55 uppercase">
				{data.visitInfo?.verificationNote || hero.note}
			</p>
		</div>
	</div>
</section>

{#if data.homeFallback}
	<div class="container-page py-4">
		<div class="alert alert--info">{content.visitInfo.fallback}</div>
	</div>
{/if}

{#if data.visitInfo}
	<VisitInformation content={content.visitInfo} data={data.visitInfo} lang={data.lang} />
{/if}

<!-- Pengenalan -->
<section class="section section--paper">
	<div class="container-page grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
		<div class="lg:sticky lg:top-28 lg:self-start">
			<p class="eyebrow">{home.intro.eyebrow}</p>
			<h2 class="display-xl mt-6 text-navy">{home.intro.title}</h2>
			<Ornament class="mt-8 h-3 w-44 text-gold-dark/45" />
		</div>

		<div>
			<p class="lede max-w-2xl">{home.intro.body}</p>

			<div class="mt-10 border-t border-charcoal/12">
				{#each home.intro.points as point, index (point.title)}
					<div
						class="grid gap-2 border-b border-charcoal/12 py-6 sm:grid-cols-[2.5rem_10rem_1fr] sm:gap-5"
					>
						<span class="font-display text-lg leading-none text-gold-dark">
							0{index + 1}
						</span>
						<h3 class="text-sm font-semibold text-navy">{point.title}</h3>
						<p class="max-w-md text-sm leading-relaxed text-body">{point.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Virtual tour -->
<section class="dark-surface section relative overflow-hidden">
	<div
		class="pointer-events-none absolute -top-16 right-0 hidden font-display text-[22rem] leading-none text-ivory/[0.035] select-none lg:block"
		aria-hidden="true"
	>
		360
	</div>

	<div class="container-page relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
		<div class="max-w-xl">
			<p class="eyebrow">{home.tour.eyebrow}</p>
			<h2 class="display-xl mt-6 text-ivory">{home.tour.title}</h2>
			<p class="mt-6 text-base leading-relaxed text-ivory/60">{home.tour.body}</p>
			<div class="mt-8">
				<ArrowLink href={href('/tour')} label={content.actions.exploreTour} tone="light" />
			</div>
		</div>

		<div class="relative">
			<div class="absolute -inset-3 border border-gold/25" aria-hidden="true"></div>
			<a
				href={href('/tour')}
				class="group relative block overflow-hidden border border-ivory/15 bg-navy-deep"
			>
				<img
					src={data.homeMedia.previewImagePath}
					alt={home.tour.previewLabel}
					loading="lazy"
					decoding="async"
					class="aspect-[16/10] w-full object-cover opacity-90 transition duration-700 ease-out group-hover:scale-[1.025]"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy/10 to-transparent"
				></div>

				<span
					class="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/40 bg-ivory/10 text-ivory backdrop-blur-md transition group-hover:border-gold-light group-hover:bg-gold group-hover:text-ink"
				>
					<Icon name="play" class="ml-0.5 h-5 w-5" />
				</span>

				<div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
					<p class="text-[0.65rem] tracking-[0.18em] text-ivory/65 uppercase">
						{home.tour.previewLabel}
					</p>
					<span class="meta text-gold-light/70">360°</span>
				</div>
			</a>
		</div>
	</div>
</section>

<!-- Sejarah -->
<section class="section section--ivory">
	<div class="container-page grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
		<div>
			<p class="eyebrow">{home.history.eyebrow}</p>
			<h2 class="display-xl mt-6 text-navy">{home.history.title}</h2>
			<Ornament class="mt-8 h-3 w-40 text-gold-dark/45" />
		</div>

		<div class="relative border-l border-gold-dark/30 pl-6 sm:pl-10">
			<span
				class="absolute top-0 -left-[5px] h-2.5 w-2.5 rotate-45 border border-gold-dark bg-ivory"
				aria-hidden="true"
			></span>
			<p class="meta text-gold-dark">
				{home.history.noteLabel} · {home.history.status}
			</p>
			<blockquote class="mt-6">
				<p class="font-display text-2xl leading-snug text-navy italic sm:text-3xl">
					“{home.history.body}”
				</p>
			</blockquote>
			<div class="mt-8">
				<ArrowLink href={href('/sejarah')} label={content.actions.readHistory} />
			</div>
		</div>
	</div>
</section>

<!-- Area -->
<section class="section section--sand">
	<div class="container-page">
		<SectionHeading
			eyebrow={home.areas.eyebrow}
			title={home.areas.title}
			description={home.areas.body}
		>
			{#snippet action()}
				<ArrowLink href={href('/area')} label={content.actions.viewAllAreas} />
			{/snippet}
		</SectionHeading>

		<div class="mt-12 border-b border-charcoal/12">
			{#each home.areas.items as area, index (area.name)}
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

<!-- Galeri -->
<section class="section section--paper">
	<div class="container-page">
		<SectionHeading
			eyebrow={home.gallery.eyebrow}
			title={home.gallery.title}
			description={home.gallery.body}
		>
			{#snippet action()}
				<ArrowLink href={href('/galeri')} label={content.actions.openGallery} />
			{/snippet}
		</SectionHeading>

		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each home.gallery.items as item, index (item.title)}
				<div class={index === 1 ? 'lg:mt-10' : ''}>
					<GalleryCard
						title={item.title}
						caption={item.caption}
						{index}
						pending={home.gallery.pending}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Panduan -->
<section class="section section--ivory">
	<div class="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
		<div>
			<p class="eyebrow">{home.guide.eyebrow}</p>
			<h2 class="display-xl mt-6 text-navy">{home.guide.title}</h2>
			<p class="mt-6 max-w-md text-base leading-relaxed text-body">
				{home.guide.body}
			</p>

			<div class="mt-8 max-w-md border-l-2 border-gold-dark/40 pl-5">
				<p class="meta text-gold-dark">{home.history.noteLabel}</p>
				<p class="mt-2 text-sm leading-relaxed text-muted">{content.footer.note}</p>
			</div>

			<div class="mt-8">
				<ArrowLink href={href('/panduan')} label={content.actions.readGuide} />
			</div>
		</div>

		<div class="border-b border-charcoal/12">
			{#each home.guide.items as item, index (item.title)}
				<GuideCard title={item.title} body={item.body} {index} />
			{/each}
		</div>
	</div>
</section>
