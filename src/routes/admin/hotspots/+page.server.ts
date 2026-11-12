import { listAllHotspotsForAdmin } from '#lib/server/services/hotspot.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { hotspots: await listAllHotspotsForAdmin() };
};
