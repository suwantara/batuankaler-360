import { error } from '@sveltejs/kit';
import { ORIGIN } from '$app/env/private';
import { isLocale } from '#lib/i18n/index.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params, url }) => {
	if (!isLocale(params.lang)) {
		error(404, 'Halaman tidak ditemukan');
	}

	return { lang: params.lang, origin: ORIGIN || url.origin };
};
