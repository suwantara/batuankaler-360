import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedSitePage } from '#lib/server/services/site-page.ts';
import { getPublishedVisitInformation } from '#lib/server/services/site-content.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	const [visitInfo, page] = await Promise.all([
		getPublishedVisitInformation(params.lang),
		getPublishedSitePage('panduan', params.lang)
	]);

	return {
		visitInfo,
		page
	};
};
