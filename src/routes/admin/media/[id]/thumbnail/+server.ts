import { json } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import { updatePanoramaThumbnail } from '#lib/server/services/panorama.ts';
import type { RequestHandler } from './$types';

const DATA_URL_PATTERN = /^data:image\/(jpeg|png|webp);base64,([a-zA-Z0-9+/=\s]+)$/;

function dataUrlToFile(value: unknown): File | null {
	if (typeof value !== 'string') return null;

	const match = DATA_URL_PATTERN.exec(value);
	if (!match) return null;

	const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
	const buffer = Buffer.from(match[2] ?? '', 'base64');

	if (buffer.length === 0) return null;

	return new File([buffer], `scene-thumbnail.${extension}`, {
		type: `image/${match[1]}`
	});
}

export const POST: RequestHandler = async ({ params, request }) => {
	let payload: unknown;

	try {
		payload = await request.json();
	} catch {
		return json(
			{ ok: false, message: 'Payload thumbnail tidak valid.' },
			{ status: 400, headers: { 'Cache-Control': 'no-store' } }
		);
	}

	const dataUrl =
		payload && typeof payload === 'object' && 'dataUrl' in payload ? payload.dataUrl : null;
	const thumbnail = dataUrlToFile(dataUrl);

	if (!thumbnail) {
		return json(
			{ ok: false, message: 'Thumbnail harus berupa data URL JPEG, PNG, atau WebP.' },
			{ status: 400, headers: { 'Cache-Control': 'no-store' } }
		);
	}

	try {
		const asset = await updatePanoramaThumbnail(params.id, thumbnail);

		return json(
			{ ok: true, thumbnailPath: asset.thumbnailPath },
			{ headers: { 'Cache-Control': 'no-store' } }
		);
	} catch (cause) {
		if (cause instanceof AppError) {
			return json(
				{ ok: false, message: cause.message },
				{ status: cause.status, headers: { 'Cache-Control': 'no-store' } }
			);
		}

		console.error('Scene thumbnail capture failed', cause);
		return json(
			{ ok: false, message: 'Gagal menyimpan thumbnail dari panorama.' },
			{ status: 500, headers: { 'Cache-Control': 'no-store' } }
		);
	}
};
