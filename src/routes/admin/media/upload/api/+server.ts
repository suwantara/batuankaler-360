import { json } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import { uploadPanoramaAsset } from '#lib/server/services/panorama-upload.ts';
import type { RequestHandler } from './$types';

function asFile(value: FormDataEntryValue | null): File | null {
	return value instanceof File && value.size > 0 ? value : null;
}

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	try {
		const asset = await uploadPanoramaAsset({
			original: asFile(formData.get('original')),
			thumbnail: asFile(formData.get('thumbnail')),
			preview: asFile(formData.get('preview')),
			projection: formData.get('projection')?.toString() ?? 'equirectangular'
		});

		return json({ ok: true, assetId: asset.id }, { headers: { 'Cache-Control': 'no-store' } });
	} catch (cause) {
		if (cause instanceof AppError) {
			return json(
				{ ok: false, message: cause.message },
				{ status: cause.status, headers: { 'Cache-Control': 'no-store' } }
			);
		}

		console.error('Panorama upload failed', cause);
		return json(
			{ ok: false, message: 'Gagal mengunggah aset panorama.' },
			{ status: 500, headers: { 'Cache-Control': 'no-store' } }
		);
	}
};
