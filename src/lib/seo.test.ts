import { describe, expect, it } from 'vitest';
import {
	buildPageJsonLd,
	buildSitemapEntries,
	canonicalUrl,
	jsonLdScript,
	localePath,
	normalizePath,
	renderRobots,
	renderSitemap,
	serializeJsonLd,
	socialImageUrl,
	alternateLinks
} from './seo.ts';

const origin = 'https://example.com';

describe('SEO URL helpers', () => {
	it('normalizes locale-prefixed and trailing-slash paths', () => {
		expect(normalizePath('/')).toBe('/');
		expect(normalizePath('/id')).toBe('/');
		expect(normalizePath('/en/tour/')).toBe('/tour');
		expect(normalizePath('/id/tour/jaba-pura?source=test#section')).toBe('/tour/jaba-pura');
		expect(normalizePath('tour')).toBe('/tour');
	});

	it('builds localized paths and canonical URLs', () => {
		expect(localePath('id', '/')).toBe('/id');
		expect(localePath('en', '/tour')).toBe('/en/tour');
		expect(canonicalUrl(origin, 'en', '/tour')).toBe('https://example.com/en/tour');
	});

	it('builds id, en, and x-default alternate links', () => {
		expect(alternateLinks(origin, '/area/jaba-pura')).toEqual([
			{ hreflang: 'id', href: 'https://example.com/id/area/jaba-pura' },
			{ hreflang: 'en', href: 'https://example.com/en/area/jaba-pura' },
			{ hreflang: 'x-default', href: 'https://example.com/id/area/jaba-pura' }
		]);
	});

	it('uses a raster social image and falls back for SVG', () => {
		expect(socialImageUrl(origin, '/images/panoramas/scene-jaba-preview.jpg')).toBe(
			'https://example.com/images/panoramas/scene-jaba-preview.jpg'
		);
		expect(socialImageUrl(origin, '/images/hero-pura.svg')).toBe(
			'https://example.com/images/panoramas/scene-jaba-preview.jpg'
		);
	});
});

describe('sitemap and robots', () => {
	it('creates two locale entries with alternate links per path', () => {
		const entries = buildSitemapEntries(origin, [
			{
				path: '/tour',
				changefreq: 'weekly',
				priority: '0.9',
				lastmod: '2026-01-01T00:00:00.000Z'
			}
		]);

		expect(entries).toHaveLength(2);
		expect(entries[0]?.loc).toBe('https://example.com/id/tour');
		expect(entries[0]?.lastmod).toBe('2026-01-01T00:00:00.000Z');
		expect(entries[0]?.alternates).toHaveLength(3);
		expect(entries[1]?.loc).toBe('https://example.com/en/tour');
	});

	it('renders valid sitemap XML with hreflang links and lastmod', () => {
		const xml = renderSitemap(
			buildSitemapEntries(origin, [
				{
					path: '/',
					changefreq: 'weekly',
					priority: '1.0',
					lastmod: '2026-01-01T00:00:00.000Z'
				}
			])
		);

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<loc>https://example.com/id</loc>');
		expect(xml).toContain('<loc>https://example.com/en</loc>');
		expect(xml).toContain('<lastmod>2026-01-01T00:00:00.000Z</lastmod>');
		expect(xml).toContain('hreflang="x-default"');
		expect(xml).toContain('</urlset>');
	});

	it('renders robots.txt with the sitemap and admin disallow', () => {
		const robots = renderRobots(origin);

		expect(robots).toContain('Disallow: /admin');
		expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
	});
});

describe('JSON-LD', () => {
	it('builds a graph with organization, website, place, webpage, and breadcrumb', () => {
		const jsonLd = buildPageJsonLd({
			origin,
			lang: 'id',
			path: '/tour',
			title: 'Virtual Tour | Pura Batuan Kaler 360',
			description: 'Jelajahi kawasan pura.',
			image: 'https://example.com/images/panoramas/scene-jaba-preview.jpg',
			breadcrumbs: [
				{ name: 'Beranda', path: '/' },
				{ name: 'Virtual Tour', path: '/tour' }
			]
		});
		const graph = jsonLd['@graph'] as Array<Record<string, unknown>>;

		expect(graph.map((item) => item['@type'])).toEqual([
			'Organization',
			'WebSite',
			'Place',
			'WebPage',
			'BreadcrumbList'
		]);
		expect(graph[3]?.['@id']).toBe('https://example.com/id/tour#webpage');
	});

	it('escapes script-closing characters in serialized JSON-LD', () => {
		expect(serializeJsonLd({ value: '</script>' })).toBe('{"value":"\\u003c/script>"}');
		expect(jsonLdScript({ value: '</script>' })).toBe(
			'<script type="application/ld+json">{"value":"\\u003c/script>"}</script>'
		);
	});
});
