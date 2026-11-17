import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedAreas } from '#lib/server/services/area.ts';
import { getPublishedSitePage } from '#lib/server/services/site-page.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	const [areas, page] = await Promise.all([
		getPublishedAreas(params.lang),
		getPublishedSitePage('area', params.lang)
	]);

	return {
		areas,
		page
	};
};
