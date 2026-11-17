import { listGalleryItemsForAdmin } from '#lib/server/services/gallery.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { items: await listGalleryItemsForAdmin() };
};
