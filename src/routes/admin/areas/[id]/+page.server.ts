import { error, fail, redirect } from '@sveltejs/kit';
import {
	areaFormSchema,
	areaFormValuesFromAdmin,
	areaFormValuesFromRaw
} from '#lib/schemas/area.ts';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import { deleteArea, getAreaForAdmin, updateArea } from '#lib/server/services/area.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const area = await getAreaForAdmin(params.id);

	if (!area) {
		error(404, 'Area tidak ditemukan.');
	}

	return {
		area,
		values: areaFormValuesFromAdmin(area)
	};
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = areaFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: areaFormValuesFromRaw(raw)
			});
		}

		try {
			const updated = await updateArea(params.id, result.data);

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: areaFormValuesFromAdmin(updated),
				updatedAt: updated.updatedAt
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: areaFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	},

	delete: async ({ params }) => {
		try {
			await deleteArea(params.id);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, { deleteError: cause.message });
			}

			throw cause;
		}

		redirect(303, '/admin/areas');
	}
};
