import { error, fail } from '@sveltejs/kit';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import {
	sitePageFormSchema,
	sitePageFormValuesFromAdmin,
	sitePageFormValuesFromRaw
} from '#lib/schemas/site-page.ts';
import { getOrCreateSitePage, saveSitePage } from '#lib/server/services/site-page.ts';
import { getSitePageDefinition } from '#lib/site-pages.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function requireDefinition(slug: string) {
	const definition = getSitePageDefinition(slug);

	if (!definition) {
		error(404, 'Halaman tidak ditemukan.');
	}

	return definition;
}

export const load: PageServerLoad = async ({ params }) => {
	const definition = requireDefinition(params.slug);
	const page = await getOrCreateSitePage(params.slug);

	return {
		page,
		definition,
		values: sitePageFormValuesFromAdmin(page)
	};
};

export const actions: Actions = {
	save: async ({ params, request }) => {
		requireDefinition(params.slug);

		const raw = Object.fromEntries(await request.formData()) as Record<string, string>;
		const result = sitePageFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: sitePageFormValuesFromRaw(raw)
			});
		}

		try {
			const updated = await saveSitePage(params.slug, result.data);

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: sitePageFormValuesFromAdmin(updated),
				updatedAt: updated.updatedAt
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				const errors: Record<string, string> = { form: cause.message };
				return fail(cause.status, {
					errors,
					values: sitePageFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	}
};
