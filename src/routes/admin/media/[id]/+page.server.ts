import { error, fail } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import { getPanoramaAsset, updatePanoramaThumbnail } from '#lib/server/services/panorama.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const asset = await getPanoramaAsset(params.id);

	if (!asset) {
		error(404, 'Aset panorama tidak ditemukan.');
	}

	return { asset };
};

export const actions: Actions = {
	updateThumbnail: async ({ params, request }) => {
		const formData = await request.formData();
		const thumbnail = formData.get('thumbnail');

		if (!(thumbnail instanceof File) || thumbnail.size === 0) {
			return fail(400, { thumbnailError: 'Pilih file thumbnail baru.' });
		}

		try {
			const asset = await updatePanoramaThumbnail(params.id, thumbnail);

			return {
				success: true,
				asset
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, { thumbnailError: cause.message });
			}

			console.error('Panorama thumbnail update failed', cause);
			return fail(500, { thumbnailError: 'Gagal memperbarui thumbnail panorama.' });
		}
	}
};
