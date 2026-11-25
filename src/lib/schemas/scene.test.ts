import { describe, expect, it } from 'vitest';
import { sceneBulkPublishSchema } from './scene.ts';

const sceneId = 'c0000000-0000-4000-8000-000000000001';
const otherSceneId = 'c0000000-0000-4000-8000-000000000002';

describe('sceneBulkPublishSchema', () => {
	it('accepts one or more scene IDs', () => {
		expect(sceneBulkPublishSchema.safeParse({ sceneIds: [sceneId] }).success).toBe(true);
		expect(sceneBulkPublishSchema.safeParse({ sceneIds: [sceneId, otherSceneId] }).success).toBe(
			true
		);
	});

	it('rejects an empty selection', () => {
		const result = sceneBulkPublishSchema.safeParse({ sceneIds: [] });

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0]?.message).toBe('Pilih minimal satu scene.');
		}
	});

	it('rejects invalid scene IDs', () => {
		expect(sceneBulkPublishSchema.safeParse({ sceneIds: ['not-a-uuid'] }).success).toBe(false);
	});
});
