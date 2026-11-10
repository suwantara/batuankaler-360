import { randomUUID } from 'node:crypto';
import { fail, redirect } from '@sveltejs/kit';
import { createPanoramaAsset } from '#lib/server/services/panorama.ts';
import { deletePanoramaFile, savePanoramaImage } from '#lib/server/storage/local.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const original = formData.get('original');
		const thumbnail = formData.get('thumbnail');
		const preview = formData.get('preview');
		const projection = formData.get('projection')?.toString().trim() || 'equirectangular';

		if (!projection || projection.length > 32) {
			return fail(400, { message: 'Nilai proyeksi tidak valid.' });
		}

		if (!(original instanceof File) || original.size === 0) {
			return fail(400, { message: 'Pilih file panorama asli.' });
		}

		if (!(thumbnail instanceof File) || thumbnail.size === 0) {
			return fail(400, { message: 'Pilih file thumbnail.' });
		}

		const baseId = randomUUID();
		const savedFiles: string[] = [];

		try {
			const originalImage = await savePanoramaImage(original, 'original', baseId);
			savedFiles.push(originalImage.publicPath);

			const thumbnailImage = await savePanoramaImage(thumbnail, 'thumbnail', baseId);
			savedFiles.push(thumbnailImage.publicPath);

			let previewImage = null;

			if (preview instanceof File && preview.size > 0) {
				previewImage = await savePanoramaImage(preview, 'preview', baseId);
				savedFiles.push(previewImage.publicPath);
			}

			await createPanoramaAsset({
				originalPath: originalImage.publicPath,
				thumbnailPath: thumbnailImage.publicPath,
				previewPath: previewImage?.publicPath ?? null,
				projection,
				width: originalImage.width,
				height: originalImage.height,
				processingStatus: 'processed',
				config: {
					levels: [{ width: originalImage.width }],
					format:
						originalImage.mimeType === 'image/png'
							? 'png'
							: originalImage.mimeType === 'image/webp'
								? 'webp'
								: 'jpg'
				}
			});
		} catch (cause) {
			await Promise.all(savedFiles.map((path) => deletePanoramaFile(path)));

			if (cause instanceof AppError) {
				return fail(cause.status, { message: cause.message });
			}

			console.error('Panorama upload failed', cause);
			return fail(500, { message: 'Gagal mengunggah aset panorama.' });
		}

		return redirect(303, '/admin/media');
	}
};
