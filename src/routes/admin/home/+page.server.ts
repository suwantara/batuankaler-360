import { error, fail } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import {
	homeContentFormSchema,
	homeContentFormValuesFromData,
	homeContentFormValuesFromRaw
} from '#lib/schemas/home-content.ts';
import { saveHomeContent } from '#lib/server/services/home.ts';
import { listPanoramaAssets } from '#lib/server/services/panorama.ts';
import { getOrCreateSitePageData } from '#lib/server/services/site-page.ts';
import { getSitePageDefinition } from '#lib/site-pages.ts';
import type { SiteMediaAsset } from '#lib/types/site-page.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const definition = getSitePageDefinition('beranda');

	if (!definition) {
		error(404, 'Halaman tidak ditemukan.');
	}

	const [page, assets] = await Promise.all([
		getOrCreateSitePageData('beranda'),
		listPanoramaAssets()
	]);
	const mediaAssets: SiteMediaAsset[] = assets.map((asset) => ({
		id: asset.id,
		originalPath: asset.originalPath,
		thumbnailPath: asset.thumbnailPath,
		previewPath: asset.previewPath,
		width: asset.width,
		height: asset.height
	}));

	return {
		page,
		definition,
		values: homeContentFormValuesFromData(page),
		assets: mediaAssets
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = homeContentFormSchema.safeParse(raw);

		if (!result.success) {
			const errors: Record<string, string> = {};

			for (const issue of result.error.issues) {
				const key = issue.path.join('.') || 'form';
				if (!errors[key]) errors[key] = issue.message;
			}

			return fail(400, {
				errors,
				values: homeContentFormValuesFromRaw(raw)
			});
		}

		try {
			const page = await saveHomeContent(result.data);

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: homeContentFormValuesFromData(page),
				updatedAt: page.updatedAt
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: homeContentFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	}
};
