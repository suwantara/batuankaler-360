import { listScenesForAdmin } from '#lib/server/services/scene.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { scenes: await listScenesForAdmin() };
};
