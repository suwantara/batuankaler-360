import { error, fail, redirect } from '@sveltejs/kit';
import {
	galleryItemFormSchema,
	galleryItemFormValuesFromAdmin,
	galleryItemFormValuesFromRaw
} from '#lib/schemas/gallery.ts';
import { collectFieldErrors } from '#lib/schemas/scene.ts';
import {
	deleteGalleryItem,
	getGalleryItemForAdmin,
	updateGalleryItem
} from '#lib/server/services/gallery.ts';
import { AppError } from '#lib/server/errors.ts';
import type { Actions, PageServerLoad } from './$types';

function stringFields(formData: FormData): Record<string, string> {
	const values: Record<string, string> = {};

	for (const [key, value] of formData) {
		if (typeof value === 'string') values[key] = value;
	}

	return values;
}

export const load: PageServerLoad = async ({ params }) => {
	const item = await getGalleryItemForAdmin(params.id);

	if (!item) {
		error(404, 'Foto galeri tidak ditemukan.');
	}

	return {
		item,
		values: galleryItemFormValuesFromAdmin(item)
	};
};

export const actions: Actions = {
	save: async ({ params, request }) => {
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

		try {
			const updated = await updateGalleryItem(
				params.id,
				result.data,
				image instanceof File ? image : null
			);

			return {
				success: true,
				errors: {} as Record<string, string>,
				values: galleryItemFormValuesFromAdmin(updated),
				updatedAt: updated.updatedAt
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					errors: { form: cause.message },
					values: galleryItemFormValuesFromRaw(raw)
				});
			}

			throw cause;
		}
	},

	delete: async ({ params }) => {
		try {
			await deleteGalleryItem(params.id);
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, { deleteError: cause.message });
			}

			throw cause;
		}

		redirect(303, '/admin/gallery');
	}
};
