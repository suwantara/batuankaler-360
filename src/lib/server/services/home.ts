import { getPublishedSitePageData } from './site-page.ts';
import { parseHomeContent, type HomeContent } from '#lib/schemas/home-content.ts';
import type { Locale } from '#lib/i18n/locales.ts';

export interface PublishedHomeContent {
	content: HomeContent;
	fallbackUsed: boolean;
}

export async function getPublishedHomeContent(
	locale: Locale
): Promise<PublishedHomeContent | null> {
	const page = await getPublishedSitePageData('beranda');

	if (!page) return null;

	const primary = parseHomeContent(page.data[locale]);

	if (primary) {
		return { content: primary, fallbackUsed: false };
	}

	if (locale === 'en') {
		const fallback = parseHomeContent(page.data.id);
		if (fallback) return { content: fallback, fallbackUsed: true };
	}

	return null;
}
