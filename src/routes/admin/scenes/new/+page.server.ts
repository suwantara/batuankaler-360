import { fail, redirect } from '@sveltejs/kit';
import {
	collectFieldErrors,
	sceneFormSchema,
	type SceneFormInput,
	type SceneFormValues
} from '#lib/schemas/scene.ts';
import { listPanoramaAssets } from '#lib/server/services/panorama.ts';
import {
	createScene,
	degreesToRadians,
	listAreas,
	type SceneInput
} from '#lib/server/services/scene.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function toFormValues(raw: Record<string, string>): SceneFormValues {
	return {
		slug: raw.slug ?? '',
		status: raw.status === 'published' ? 'published' : 'draft',
		areaId: raw.areaId ?? '',
		panoramaAssetId: raw.panoramaAssetId ?? '',
		initialYaw: raw.initialYaw ?? '0',
		initialPitch: raw.initialPitch ?? '0',
		initialFov: raw.initialFov ?? '90',
		sortOrder: raw.sortOrder ?? '0',
		titleId: raw.titleId ?? '',
		descriptionId: raw.descriptionId ?? '',
		titleEn: raw.titleEn ?? '',
		descriptionEn: raw.descriptionEn ?? ''
	};
}

function toSceneInput(data: SceneFormInput): SceneInput {
	return {
		slug: data.slug,
		status: data.status,
		areaId: data.areaId,
		panoramaAssetId: data.panoramaAssetId,
		initialYaw: degreesToRadians(data.initialYaw),
		initialPitch: degreesToRadians(data.initialPitch),
		initialFov: degreesToRadians(data.initialFov),
		sortOrder: data.sortOrder,
		translations: {
			id: { title: data.titleId, description: data.descriptionId },
			en: { title: data.titleEn, description: data.descriptionEn }
		}
	};
}

export const load: PageServerLoad = async () => {
	const [areas, assets] = await Promise.all([listAreas(), listPanoramaAssets()]);

	return { areas, assets };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = sceneFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: toFormValues(raw)
			});
		}

		try {
			const created = await createScene(toSceneInput(result.data));
			return redirect(303, `/admin/scenes/${created.id}`);
		} catch (error) {
			if (error instanceof AppError) {
				return fail(error.status, {
					errors: { form: error.message },
					values: toFormValues(raw)
				});
			}

			throw error;
		}
	}
};
