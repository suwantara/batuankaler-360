import { listAreasForAdmin } from '#lib/server/services/area.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { areas: await listAreasForAdmin() };
};
