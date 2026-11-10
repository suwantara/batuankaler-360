import { error, fail, redirect } from '@sveltejs/kit';
import {
	collectFieldErrors,
	sceneFormSchema,
	type SceneFormInput,
	type SceneFormValues
} from '#lib/schemas/scene.ts';
import { listPanoramaAssets } from '#lib/server/services/panorama.ts';
import {
	deleteScene,
	degreesToRadians,
	getSceneForAdmin,
	listAreas,
	radiansToDegrees,
	setSceneStatus,
	updateScene,
	type SceneInput
} from '#lib/server/services/scene.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

type AdminScene = NonNullable<Awaited<ReturnType<typeof getSceneForAdmin>>>;

function toFormValues(scene: AdminScene): SceneFormValues {
	const id = scene.translations.find((item) => item.locale === 'id');
	const en = scene.translations.find((item) => item.locale === 'en');

	return {
		slug: scene.slug,
		status: scene.status,
		areaId: scene.areaId ?? '',
		panoramaAssetId: scene.panoramaAssetId ?? '',
		initialYaw: radiansToDegrees(scene.initialYaw).toFixed(2),
		initialPitch: radiansToDegrees(scene.initialPitch).toFixed(2),
		initialFov: radiansToDegrees(scene.initialFov).toFixed(2),
		sortOrder: String(scene.sortOrder),
		titleId: id?.title ?? '',
		descriptionId: id?.description ?? '',
		titleEn: en?.title ?? '',
		descriptionEn: en?.description ?? ''
	};
}

function rawToFormValues(raw: Record<string, string>): SceneFormValues {
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

export const load: PageServerLoad = async ({ params }) => {
	const [scene, areas, assets] = await Promise.all([
		getSceneForAdmin(params.id),
		listAreas(),
		listPanoramaAssets()
	]);

	if (!scene) {
		error(404, 'Scene tidak ditemukan.');
	}

	return { scene, areas, assets, values: toFormValues(scene) };
};

export const actions: Actions = {
	update: async ({ params, request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = sceneFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: rawToFormValues(raw)
			});
		}

		try {
			await updateScene(params.id, toSceneInput(result.data));
			return redirect(303, `/admin/scenes/${params.id}`);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: rawToFormValues(raw)
				});
			}

			throw cause;
		}
	},

	publish: async ({ params }) => {
		try {
			await setSceneStatus(params.id, 'published');
			return redirect(303, `/admin/scenes/${params.id}`);
		} catch (cause) {
			if (cause instanceof AppError) {
				const scene = await getSceneForAdmin(params.id);
				return fail(cause.status, {
					errors: { form: cause.message },
					values: scene ? toFormValues(scene) : undefined
				});
			}

			throw cause;
		}
	},

	unpublish: async ({ params }) => {
		try {
			await setSceneStatus(params.id, 'draft');
			return redirect(303, `/admin/scenes/${params.id}`);
		} catch (cause) {
			if (cause instanceof AppError) {
				const scene = await getSceneForAdmin(params.id);
				return fail(cause.status, {
					errors: { form: cause.message },
					values: scene ? toFormValues(scene) : undefined
				});
			}

			throw cause;
		}
	},

	delete: async ({ params }) => {
		try {
			await deleteScene(params.id);
			return redirect(303, '/admin/scenes');
		} catch (cause) {
			if (cause instanceof AppError) {
				const scene = await getSceneForAdmin(params.id);
				return fail(cause.status, {
					errors: { form: cause.message },
					values: scene ? toFormValues(scene) : undefined
				});
			}

			throw cause;
		}
	}
};
