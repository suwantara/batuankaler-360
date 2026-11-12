import { error, fail, redirect } from '@sveltejs/kit';
import {
	collectFieldErrors,
	hotspotFormSchema,
	type HotspotFormInput,
	type HotspotFormValues
} from '#lib/schemas/scene.ts';
import {
	createHotspot,
	deleteHotspot,
	updateHotspot,
	type HotspotInput
} from '#lib/server/services/hotspot.ts';
import {
	degreesToRadians,
	getSceneForAdmin,
	listScenesForAdmin
} from '#lib/server/services/scene.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function rawToFormValues(raw: Record<string, string>): HotspotFormValues {
	const type = raw.type === 'navigation' || raw.type === 'external' ? raw.type : 'information';

	return {
		type,
		targetSceneId: raw.targetSceneId ?? '',
		yaw: raw.yaw ?? '0',
		pitch: raw.pitch ?? '0',
		sortOrder: raw.sortOrder ?? '0',
		isActive: raw.isActive === 'on' || raw.isActive === 'true',
		labelId: raw.labelId ?? '',
		titleId: raw.titleId ?? '',
		bodyId: raw.bodyId ?? '',
		labelEn: raw.labelEn ?? '',
		titleEn: raw.titleEn ?? '',
		bodyEn: raw.bodyEn ?? '',
		externalUrl: raw.externalUrl ?? ''
	};
}

function toHotspotInput(data: HotspotFormInput, sceneId: string): HotspotInput {
	return {
		sceneId,
		type: data.type,
		targetSceneId: data.targetSceneId,
		yaw: degreesToRadians(data.yaw),
		pitch: degreesToRadians(data.pitch),
		sortOrder: data.sortOrder,
		isActive: data.isActive,
		translations: {
			id: {
				label: data.labelId,
				title: data.titleId,
				description: data.bodyId,
				externalUrl: data.externalUrl || null
			},
			en: {
				label: data.labelEn,
				title: data.titleEn,
				description: data.bodyEn,
				externalUrl: data.externalUrl || null
			}
		}
	};
}

export const load: PageServerLoad = async ({ params, url }) => {
	const scene = await getSceneForAdmin(params.id);

	if (!scene) {
		error(404, 'Scene tidak ditemukan.');
	}

	const allScenes = await listScenesForAdmin();

	return {
		scene,
		scenes: allScenes.filter((item) => item.id !== scene.id),
		selectedHotspotId: url.searchParams.get('hotspot')
	};
};

export const actions: Actions = {
	create: async ({ params, request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = hotspotFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				hotspotId: null,
				errors: collectFieldErrors(result.error),
				values: rawToFormValues(raw)
			});
		}

		try {
			await createHotspot(toHotspotInput(result.data, params.id));
			return redirect(303, `/admin/scenes/${params.id}/hotspots`);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					hotspotId: null,
					errors: { form: cause.message },
					values: rawToFormValues(raw)
				});
			}

			throw cause;
		}
	},

	update: async ({ params, request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const hotspotId = raw.hotspotId;

		if (!hotspotId) {
			return fail(400, {
				hotspotId: null,
				errors: { form: 'Hotspot tidak ditemukan.' },
				values: rawToFormValues(raw)
			});
		}

		const result = hotspotFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				hotspotId,
				errors: collectFieldErrors(result.error),
				values: rawToFormValues(raw)
			});
		}

		try {
			await updateHotspot(hotspotId, toHotspotInput(result.data, params.id));
			return redirect(303, `/admin/scenes/${params.id}/hotspots`);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					hotspotId,
					errors: { form: cause.message },
					values: rawToFormValues(raw)
				});
			}

			throw cause;
		}
	},

	delete: async ({ params, request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const hotspotId = raw.hotspotId;

		if (!hotspotId) {
			return fail(400, {
				hotspotId: null,
				errors: { form: 'Hotspot tidak ditemukan.' },
				values: rawToFormValues(raw)
			});
		}

		try {
			await deleteHotspot(hotspotId);
			return redirect(303, `/admin/scenes/${params.id}/hotspots`);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					hotspotId,
					errors: { form: cause.message },
					values: rawToFormValues(raw)
				});
			}

			throw cause;
		}
	}
};
