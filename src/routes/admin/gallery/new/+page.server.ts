import { fail, redirect } from '@sveltejs/kit';
import {
	emptyGalleryItemFormValues,
	galleryItemFormSchema,
	galleryItemFormValuesFromRaw
} from '#lib/schemas/gallery.ts';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import { createGalleryItem } from '#lib/server/services/gallery.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function stringFields(formData: FormData): Record<string, string> {
	const values: Record<string, string> = {};

	for (const [key, value] of formData) {
		if (typeof value === 'string') values[key] = value;
	}

	return values;
}

export const load: PageServerLoad = async () => {
	return { values: emptyGalleryItemFormValues };
};

export const actions: Actions = {
	save: async ({ request }) => {
		const formData = await request.formData();
		const raw = stringFields(formData);
		const result = galleryItemFormSchema.safeParse(raw);

		if (!result.success) {
			return fail(400, {
				errors: collectFieldErrors(result.error),
				values: galleryItemFormValuesFromRaw(raw)
			});
		}

		const image = formData.get('image');
		let created: Awaited<ReturnType<typeof createGalleryItem>>;

		try {
			created = await createGalleryItem(result.data, image instanceof File ? image : null);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: galleryItemFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}

		redirect(303, `/admin/gallery/${created.id}?created=1`);
	}
};
