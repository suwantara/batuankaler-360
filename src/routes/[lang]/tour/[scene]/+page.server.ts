import { error } from '@sveltejs/kit';
import { getPublishedTourScenes } from '#lib/server/services/tour.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const scenes = await getPublishedTourScenes();
	const scene = scenes.find((item) => item.slug === params.scene);

	if (!scene) {
		error(404, 'Scene tidak ditemukan.');
	}

	return { scenes, sceneId: scene.id };
};
