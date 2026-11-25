import { fail } from '@sveltejs/kit';
import { sceneBulkPublishSchema } from '#lib/schemas/scene.ts';
import { listScenesForAdmin, publishScenes } from '#lib/server/services/scene.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { scenes: await listScenesForAdmin() };
};

export const actions: Actions = {
	bulkPublish: async ({ request }) => {
		const formData = await request.formData();
		const parsed = sceneBulkPublishSchema.safeParse({
			sceneIds: formData.getAll('sceneIds')
		});

		if (!parsed.success) {
			return fail(400, {
				bulkMessage: parsed.error.issues[0]?.message ?? 'Pilihan scene tidak valid.'
			});
		}

		return { bulkResult: await publishScenes(parsed.data.sceneIds) };
	}
};
