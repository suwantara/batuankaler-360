import { fail } from '@sveltejs/kit';
import {
	collectFieldErrors,
	panoramaAssetFormSchema,
	type PanoramaAssetFormValues
} from '#lib/schemas/scene.ts';
import {
	createPanoramaAsset,
	deletePanoramaAsset,
	listPanoramaAssets
} from '#lib/server/services/panorama.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function rawToFormValues(raw: Record<string, string>): PanoramaAssetFormValues {
	return {
		originalPath: raw.originalPath ?? '',
		thumbnailPath: raw.thumbnailPath ?? '',
		previewPath: raw.previewPath ?? '',
		projection: raw.projection ?? 'equirectangular',
		width: raw.width ?? '4096',
		height: raw.height ?? '2048',
		processingStatus:
			raw.processingStatus === 'uploaded' || raw.processingStatus === 'failed'
				? raw.processingStatus
				: 'processed'
	};
}

export const load: PageServerLoad = async () => {
	return { assets: await listPanoramaAssets() };
};

export const actions: Actions = {
	metadata: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = panoramaAssetFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: rawToFormValues(raw)
			});
		}

		try {
			await createPanoramaAsset({
				originalPath: result.data.originalPath,
				thumbnailPath: result.data.thumbnailPath,
				previewPath: result.data.previewPath || null,
				projection: result.data.projection,
				width: result.data.width,
				height: result.data.height,
				processingStatus: result.data.processingStatus
			});

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: undefined
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				const errors: Record<string, string> = { form: cause.message };
				return fail(cause.status, {
					errors,
					values: rawToFormValues(raw)
				});
			}

			throw cause;
		}
	},

	delete: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const assetId = raw.assetId;

		if (!assetId) {
			const errors: Record<string, string> = { form: 'Aset panorama tidak ditemukan.' };
			return fail(400, {
				errors,
				values: undefined
			});
		}

		try {
			await deletePanoramaAsset(assetId);
			return {
				success: true,
				errors: {} as Record<string, string>,
				values: undefined
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				const errors: Record<string, string> = { form: cause.message };
				return fail(cause.status, {
					errors,
					values: undefined
				});
			}

			throw cause;
		}
	}
};
