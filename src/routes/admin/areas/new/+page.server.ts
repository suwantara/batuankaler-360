import { fail, redirect } from '@sveltejs/kit';
import { areaFormSchema, areaFormValuesFromRaw, emptyAreaFormValues } from '#lib/schemas/area.ts';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import { createArea } from '#lib/server/services/area.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { values: emptyAreaFormValues };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = areaFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: areaFormValuesFromRaw(raw)
			});
		}

		try {
			const created = await createArea(result.data);

			redirect(303, `/admin/areas/${created.id}?created=1`);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: areaFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	}
};
