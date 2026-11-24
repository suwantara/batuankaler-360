import { googleMapsPlaceUrl } from './location.ts';
import type { Locale } from './i18n/locales.ts';

export const SITE_NAME = 'Pura Batuan Kaler 360';
export const DEFAULT_SOCIAL_IMAGE = '/images/panoramas/scene-jaba-preview.jpg';

export const SITE_ADDRESS = {
	streetAddress: 'Pura Puseh Ganggangan Canggi, Dusun Canggi',
	addressLocality: 'Batuan Kaler',
	addressRegion: 'Bali',
	postalCode: '80582',
	addressCountry: 'ID'
} as const;

export interface AlternateLink {
	hreflang: Locale | 'x-default';
	href: string;
}

export interface BreadcrumbItem {
	name: string;
	path: string;
}

export interface SitemapPath {
	path: string;
	changefreq: 'weekly' | 'monthly';
	priority: string;
	lastmod?: string;
}

export interface SitemapEntry {
	loc: string;
	changefreq: SitemapPath['changefreq'];
	priority: string;
	lastmod?: string;
	alternates: AlternateLink[];
}

export type JsonLd = Record<string, unknown>;

export const SITEMAP_STATIC_PATHS: readonly SitemapPath[] = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/tour', changefreq: 'weekly', priority: '0.9' },
	{ path: '/area', changefreq: 'monthly', priority: '0.8' },
	{ path: '/sejarah', changefreq: 'monthly', priority: '0.7' },
	{ path: '/galeri', changefreq: 'monthly', priority: '0.7' },
	{ path: '/panduan', changefreq: 'monthly', priority: '0.7' }
];

export function normalizePath(path: string): string {
	const pathname = path.split('?')[0]?.split('#')[0] ?? '/';
	const withoutLocale = pathname.replace(/^\/(id|en)(?=\/|$)/, '') || '/';
	const withLeadingSlash = withoutLocale.startsWith('/') ? withoutLocale : `/${withoutLocale}`;

	return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : '/';
}

export function localePath(locale: Locale, path: string): string {
	const normalized = normalizePath(path);

	return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

export function absoluteUrl(origin: string, path: string): string {
	return new URL(path, origin).toString();
}

export function canonicalUrl(origin: string, lang: Locale, path: string): string {
	return absoluteUrl(origin, localePath(lang, path));
}

export function alternateLinks(origin: string, path: string): AlternateLink[] {
	const normalized = normalizePath(path);

	return [
		{ hreflang: 'id', href: absoluteUrl(origin, localePath('id', normalized)) },
		{ hreflang: 'en', href: absoluteUrl(origin, localePath('en', normalized)) },
		{ hreflang: 'x-default', href: absoluteUrl(origin, localePath('id', normalized)) }
	];
}

export function socialImageUrl(origin: string, image?: string): string {
	const rasterImage = /\.(?:jpe?g|png|webp|avif)(?:[?#].*)?$/i;
	const candidate = image && rasterImage.test(image) ? image : DEFAULT_SOCIAL_IMAGE;

	return absoluteUrl(origin, candidate);
}

export function buildSitemapEntries(origin: string, paths: readonly SitemapPath[]): SitemapEntry[] {
	const entries: SitemapEntry[] = [];
	const seen = new Set<string>();

	for (const item of paths) {
		const alternates = alternateLinks(origin, item.path);

		for (const alternate of alternates.filter((link) => link.hreflang !== 'x-default')) {
			if (seen.has(alternate.href)) continue;

			seen.add(alternate.href);
			entries.push({
				loc: alternate.href,
				changefreq: item.changefreq,
				priority: item.priority,
				lastmod: item.lastmod,
				alternates
			});
		}
	}

	return entries;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export function renderSitemap(entries: readonly SitemapEntry[]): string {
	const lines = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
	];

	for (const entry of entries) {
		lines.push('  <url>');
		lines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
		if (entry.lastmod) {
			lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
		}
		lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
		lines.push(`    <priority>${entry.priority}</priority>`);

		for (const alternate of entry.alternates) {
			lines.push(
				`    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}" />`
			);
		}

		lines.push('  </url>');
	}

	lines.push('</urlset>');

	return `${lines.join('\n')}\n`;
}

export function renderRobots(origin: string): string {
	return [
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin',
		'',
		`Sitemap: ${absoluteUrl(origin, '/sitemap.xml')}`,
		''
	].join('\n');
}

export function serializeJsonLd(value: unknown): string {
	return JSON.stringify(value)?.replace(/</g, '\\u003c') ?? 'null';
}

export function jsonLdScript(value: unknown): string {
	return `<script type="application/ld+json">${serializeJsonLd(value)}</script>`;
}

export function buildBreadcrumbJsonLd(
	origin: string,
	lang: Locale,
	items: readonly BreadcrumbItem[]
): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: canonicalUrl(origin, lang, item.path)
		}))
	};
}

export interface PageJsonLdInput {
	origin: string;
	lang: Locale;
	path: string;
	title: string;
	description: string;
	image: string;
	breadcrumbs: readonly BreadcrumbItem[];
}

export function buildPageJsonLd(input: PageJsonLdInput): JsonLd {
	const url = canonicalUrl(input.origin, input.lang, input.path);
	const organizationId = `${input.origin}/#organization`;
	const websiteId = `${input.origin}/#website`;
	const placeId = `${input.origin}/#place`;
	const webpage: Record<string, unknown> = {
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: input.title,
		description: input.description,
		inLanguage: input.lang,
		isPartOf: { '@id': websiteId },
		about: { '@id': placeId },
		primaryImageOfPage: { '@type': 'ImageObject', url: input.image }
	};

	if (input.breadcrumbs.length > 0) {
		webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
	}

	const graph: JsonLd[] = [
		{
			'@type': 'Organization',
			'@id': organizationId,
			name: SITE_NAME,
			url: input.origin,
			logo: absoluteUrl(input.origin, '/apple-touch-icon.png')
		},
		{
			'@type': 'WebSite',
			'@id': websiteId,
			url: input.origin,
			name: SITE_NAME,
			inLanguage: ['id', 'en'],
			publisher: { '@id': organizationId }
		},
		{
			'@type': 'Place',
			'@id': placeId,
			name: 'Pura Batuan Kaler',
			url: input.origin,
			address: {
				'@type': 'PostalAddress',
				...SITE_ADDRESS
			},
			hasMap: googleMapsPlaceUrl()
		},
		webpage
	];

	if (input.breadcrumbs.length > 0) {
		graph.push({
			...buildBreadcrumbJsonLd(input.origin, input.lang, input.breadcrumbs),
			'@id': `${url}#breadcrumb`
		});
	}

	return {
		'@context': 'https://schema.org',
		'@graph': graph
	};
}
