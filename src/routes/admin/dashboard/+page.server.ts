import { getDashboardCounts, listScenesForAdmin } from '#lib/server/services/scene.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [counts, scenes] = await Promise.all([getDashboardCounts(), listScenesForAdmin()]);

	return { counts, scenes };
};
