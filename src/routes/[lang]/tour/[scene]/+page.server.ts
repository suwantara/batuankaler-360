import { error } from '@sveltejs/kit';
import { getSceneBySlug } from '#lib/tour/scenes.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const scene = getSceneBySlug(params.scene);

	if (!scene) {
		error(404, 'Scene tidak ditemukan');
	}

	return { sceneId: scene.id };
};
