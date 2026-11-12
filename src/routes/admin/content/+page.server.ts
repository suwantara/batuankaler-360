import { fail } from '@sveltejs/kit';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import {
	visitInformationFormSchema,
	visitInformationFormValuesFromAdmin,
	visitInformationFormValuesFromRaw
} from '#lib/schemas/site-content.ts';
import {
	getOrCreateVisitInformation,
	updateVisitInformation
} from '#lib/server/services/site-content.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const content = await getOrCreateVisitInformation();

	return {
		content,
		values: visitInformationFormValuesFromAdmin(content)
	};
};

export const actions: Actions = {
	save: async ({ request }) => {
		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = visitInformationFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: visitInformationFormValuesFromRaw(raw)
			});
		}

		try {
			const updated = await updateVisitInformation(result.data);

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: visitInformationFormValuesFromAdmin(updated),
				updatedAt: updated.updatedAt
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				const errors: Record<string, string> = { form: cause.message };
				return fail(cause.status, {
					errors,
					values: visitInformationFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	}
};
