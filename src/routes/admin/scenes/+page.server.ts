import { fail, redirect } from '@sveltejs/kit';
import { sceneBulkPublishSchema } from '#lib/schemas/scene.ts';
import { listScenesForAdmin, publishScenes } from '#lib/server/services/scene.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const published = Number(url.searchParams.get('published') ?? 0);

	return {
		scenes: await listScenesForAdmin(),
		publishedCount: Number.isInteger(published) && published > 0 ? published : 0
	};
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

		const result = await publishScenes(parsed.data.sceneIds);

		if (result.failed.length === 0) {
			redirect(303, `/admin/scenes?published=${result.published}`);
		}

		return { bulkResult: result };
	}
};
