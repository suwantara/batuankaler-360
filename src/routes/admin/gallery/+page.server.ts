import { fail, redirect } from '@sveltejs/kit';
import { galleryBulkPublishSchema } from '#lib/schemas/gallery.ts';
import { listGalleryItemsForAdmin, publishGalleryItems } from '#lib/server/services/gallery.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const published = Number(url.searchParams.get('published') ?? 0);

	return {
		items: await listGalleryItemsForAdmin(),
		publishedCount: Number.isInteger(published) && published > 0 ? published : 0
	};
};

export const actions: Actions = {
	bulkPublish: async ({ request }) => {
		const formData = await request.formData();
		const parsed = galleryBulkPublishSchema.safeParse({
			itemIds: formData.getAll('itemIds')
		});

		if (!parsed.success) {
			return fail(400, {
				bulkMessage: parsed.error.issues[0]?.message ?? 'Pilihan foto tidak valid.'
			});
		}

		const result = await publishGalleryItems(parsed.data.itemIds);

		if (result.failed.length === 0) {
			redirect(303, `/admin/gallery?published=${result.published}`);
		}

		return { bulkResult: result };
	}
};
