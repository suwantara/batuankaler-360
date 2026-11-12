import { listSitePagesForAdmin } from '#lib/server/services/site-page.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { pages: await listSitePagesForAdmin() };
};
