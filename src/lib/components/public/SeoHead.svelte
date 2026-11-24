<script lang="ts">
	import type { Locale } from '#lib/i18n/locales.ts';
	import {
		SITE_NAME,
		alternateLinks,
		buildPageJsonLd,
		canonicalUrl,
		jsonLdScript,
		socialImageUrl,
		type BreadcrumbItem
	} from '#lib/seo.ts';

	let {
		lang,
		origin,
		title,
		description,
		path,
		image,
		type = 'website',
		breadcrumbs = [],
		noindex = false
	}: {
		lang: Locale;
		origin: string;
		title: string;
		description: string;
		path: string;
		image?: string;
		type?: 'website' | 'article';
		breadcrumbs?: readonly BreadcrumbItem[];
		noindex?: boolean;
	} = $props();

	const canonical = $derived(canonicalUrl(origin, lang, path));
	const alternates = $derived(alternateLinks(origin, path));
	const imageUrl = $derived(socialImageUrl(origin, image));
	const ogLocale = $derived(lang === 'id' ? 'id_ID' : 'en_US');
	const ogAlternate = $derived(lang === 'id' ? 'en_US' : 'id_ID');
	const robots = $derived(noindex ? 'noindex, nofollow' : 'index, follow');
	const jsonLd = $derived(
		buildPageJsonLd({ origin, lang, path, title, description, image: imageUrl, breadcrumbs })
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonical} />
	{#each alternates as alternate (alternate.hreflang)}
		<link rel="alternate" hreflang={alternate.hreflang} href={alternate.href} />
	{/each}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={title} />
	<meta property="og:locale" content={ogLocale} />
	<meta property="og:locale:alternate" content={ogAlternate} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD is serialized with "<" escaped -->
	{@html jsonLdScript(jsonLd)}
</svelte:head>
