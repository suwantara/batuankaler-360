import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index.ts';
import { getPublishedGalleryItems } from '#lib/server/services/gallery.ts';
import { getPublishedSitePage } from '#lib/server/services/site-page.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	const [gallery, page] = await Promise.all([
		getPublishedGalleryItems(params.lang),
		getPublishedSitePage('galeri', params.lang)
	]);

	return {
		gallery,
		page
	};
};
