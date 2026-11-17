import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedAreaBySlug } from '#lib/server/services/area.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	const area = await getPublishedAreaBySlug(params.slug, params.lang);

	if (!area) {
		error(404, 'Area tidak ditemukan.');
	}

	return { area };
};
