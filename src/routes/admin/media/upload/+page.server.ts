import { fail, redirect } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import { uploadPanoramaAsset } from '#lib/server/services/panorama-upload.ts';
import type { Actions } from './$types';

function asFile(value: FormDataEntryValue | null): File | null {
	return value instanceof File && value.size > 0 ? value : null;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		try {
			await uploadPanoramaAsset({
				original: asFile(formData.get('original')),
				thumbnail: asFile(formData.get('thumbnail')),
				preview: asFile(formData.get('preview')),
				projection: formData.get('projection')?.toString() ?? 'equirectangular'
			});
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, { message: cause.message });
			}

			console.error('Panorama upload failed', cause);
			return fail(500, { message: 'Gagal mengunggah aset panorama.' });
		}

		return redirect(303, '/admin/media?uploaded=1');
	}
};
