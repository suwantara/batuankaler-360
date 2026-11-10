import { getPublishedTourScenes } from '#lib/server/services/tour.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { scenes: await getPublishedTourScenes() };
};
