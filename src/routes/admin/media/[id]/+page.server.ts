import { error } from '@sveltejs/kit';
import { getPanoramaAsset } from '#lib/server/services/panorama.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const asset = await getPanoramaAsset(params.id);

	if (!asset) {
		error(404, 'Aset panorama tidak ditemukan.');
	}

	return { asset };
};
