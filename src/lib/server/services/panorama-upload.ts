import { randomUUID } from 'node:crypto';
import { panoramaAsset } from '#lib/server/db/schema.ts';
import { ValidationError } from '#lib/server/errors.ts';
import { createPanoramaAsset } from '#lib/server/services/panorama.ts';
import { deletePanoramaFile, savePanoramaImage } from '#lib/server/storage/local.ts';

export interface PanoramaUploadInput {
	original: File | null;
	thumbnail: File | null;
	preview: File | null;
	projection: string;
}

type PanoramaAsset = typeof panoramaAsset.$inferSelect;

export async function uploadPanoramaAsset(input: PanoramaUploadInput): Promise<PanoramaAsset> {
	const projection = input.projection.trim() || 'equirectangular';

	if (projection.length > 32) {
		throw new ValidationError('Nilai proyeksi tidak valid.');
	}

	if (!input.original || input.original.size === 0) {
		throw new ValidationError('Pilih file panorama asli.');
	}

	if (!input.thumbnail || input.thumbnail.size === 0) {
		throw new ValidationError('Pilih file thumbnail.');
	}

	const baseId = randomUUID();
	const savedFiles: string[] = [];

	try {
		const originalImage = await savePanoramaImage(input.original, 'original', baseId);
		savedFiles.push(originalImage.publicPath);

		const thumbnailImage = await savePanoramaImage(input.thumbnail, 'thumbnail', baseId);
		savedFiles.push(thumbnailImage.publicPath);

		let previewImage = null;

		if (input.preview && input.preview.size > 0) {
			previewImage = await savePanoramaImage(input.preview, 'preview', baseId);
			savedFiles.push(previewImage.publicPath);
		}

		return await createPanoramaAsset({
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
		throw cause;
	}
}
