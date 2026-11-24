import { ORIGIN } from '$app/env/private';
import { listPublishedAreaSitemapEntries } from '#lib/server/services/area.ts';
import { listPublishedSceneSitemapEntries } from '#lib/server/services/tour.ts';
import {
	SITEMAP_STATIC_PATHS,
	buildSitemapEntries,
	renderSitemap,
	type SitemapPath
} from '#lib/seo.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const origin = ORIGIN || url.origin;
	const [sceneEntries, areaEntries] = await Promise.all([
		listPublishedSceneSitemapEntries(),
		listPublishedAreaSitemapEntries()
	]);

	const scenePaths: SitemapPath[] = sceneEntries.map((entry) => ({
		path: `/tour/${entry.slug}`,
		changefreq: 'monthly',
		priority: '0.8',
		lastmod: entry.updatedAt.toISOString()
	}));
	const areaPaths: SitemapPath[] = areaEntries.map((entry) => ({
		path: `/area/${entry.slug}`,
		changefreq: 'monthly',
		priority: '0.7',
		lastmod: entry.updatedAt.toISOString()
	}));
	const entries = buildSitemapEntries(origin, [
		...SITEMAP_STATIC_PATHS,
		...scenePaths,
		...areaPaths
	]);

	return new Response(renderSitemap(entries), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
