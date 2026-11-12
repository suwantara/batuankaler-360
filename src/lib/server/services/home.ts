import { getPanoramaAsset, requirePanoramaAsset } from './panorama.ts';
import { getPublishedSitePageData, saveSitePageData } from './site-page.ts';
import {
	parseHomeContent,
	parseHomeShared,
	type HomeContent,
	type HomeContentFormValues
} from '#lib/schemas/home-content.ts';
import { dictionary } from '#lib/i18n/dictionary.ts';
import type { Locale } from '#lib/i18n/locales.ts';
import type { SitePageDataAdmin } from '#lib/types/site-page.ts';

export const DEFAULT_HOME_MEDIA = {
	heroImagePath: '/images/panoramas/scene-jaba-preview.jpg',
	heroBackgroundPath: '/images/hero-pura.svg',
	previewImagePath: '/images/panoramas/scene-jaba-preview.jpg'
} as const;

export interface HomeMediaPaths {
	heroImagePath: string;
	heroBackgroundPath: string;
	previewImagePath: string;
}

export interface HomeSeoView {
	title: string;
	description: string;
}

export interface PublishedHomeContent {
	content: HomeContent;
	fallbackUsed: boolean;
	media: HomeMediaPaths;
	seo: HomeSeoView;
}

async function resolveHomeMedia(shared: unknown): Promise<HomeMediaPaths> {
	const media = parseHomeShared(shared);
	const [hero, preview] = await Promise.all([
		media.heroAssetId ? getPanoramaAsset(media.heroAssetId) : Promise.resolve(undefined),
		media.previewAssetId ? getPanoramaAsset(media.previewAssetId) : Promise.resolve(undefined)
	]);
	const heroPath = hero?.previewPath ?? hero?.originalPath;

	return {
		heroImagePath: heroPath ?? DEFAULT_HOME_MEDIA.heroImagePath,
		heroBackgroundPath: heroPath ?? DEFAULT_HOME_MEDIA.heroBackgroundPath,
		previewImagePath:
			preview?.previewPath ?? preview?.originalPath ?? DEFAULT_HOME_MEDIA.previewImagePath
	};
}

function resolveHomeSeo(page: SitePageDataAdmin, locale: Locale): HomeSeoView {
	const current = page.meta[locale];
	const fallback = locale === 'en' ? page.meta.id : current;
	const defaults = dictionary[locale].meta;

	return {
		title: current.title.trim() || fallback.title.trim() || defaults.title,
		description: current.description.trim() || fallback.description.trim() || defaults.description
	};
}

export async function getPublishedHomeContent(
	locale: Locale
): Promise<PublishedHomeContent | null> {
	const page = await getPublishedSitePageData('beranda');

	if (!page) return null;

	const primary = parseHomeContent(page.data[locale]);

	if (primary) {
		return {
			content: primary,
			fallbackUsed: false,
			media: await resolveHomeMedia(page.shared),
			seo: resolveHomeSeo(page, locale)
		};
	}

	if (locale === 'en') {
		const fallback = parseHomeContent(page.data.id);

		if (fallback) {
			return {
				content: fallback,
				fallbackUsed: true,
				media: await resolveHomeMedia(page.shared),
				seo: resolveHomeSeo(page, locale)
			};
		}
	}

	return null;
}

export async function saveHomeContent(values: HomeContentFormValues): Promise<SitePageDataAdmin> {
	const assetIds = [...new Set([values.media.heroAssetId, values.media.previewAssetId])].filter(
		(id) => id !== ''
	);

	await Promise.all(assetIds.map((id) => requirePanoramaAsset(id)));

	return saveSitePageData('beranda', {
		status: values.status,
		content: values.content,
		meta: {
			id: values.seo.id,
			en: values.seo.en
		},
		shared: { media: values.media }
	});
}
