import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedHomeContent } from '#lib/server/services/home.ts';
import { getPublishedVisitInformation } from '#lib/server/services/site-content.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	const [visitInfo, homeResult] = await Promise.all([
		getPublishedVisitInformation(params.lang),
		getPublishedHomeContent(params.lang)
	]);

	return {
		visitInfo,
		home: homeResult?.content ?? null,
		homeFallback: homeResult?.fallbackUsed ?? false
	};
};
