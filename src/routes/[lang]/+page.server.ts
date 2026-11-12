import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedVisitInformation } from '#lib/server/services/site-content.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	return {
		visitInfo: await getPublishedVisitInformation(params.lang)
	};
};
