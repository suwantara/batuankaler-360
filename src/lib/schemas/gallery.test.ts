import { describe, expect, it } from 'vitest';
import { galleryItemFormSchema } from './gallery.ts';

describe('gallery item form schema', () => {
	it('allows a draft gallery item without a title', () => {
		const result = galleryItemFormSchema.safeParse({
			status: 'draft',
			sortOrder: '0',
			titleId: '',
			captionId: '',
			titleEn: '',
			captionEn: ''
		});

		expect(result.success).toBe(true);
	});

	it('requires an Indonesian title before publishing', () => {
		const result = galleryItemFormSchema.safeParse({
			status: 'published',
			sortOrder: '0',
			titleId: '',
			captionId: '',
			titleEn: 'Canggi Gate',
			captionEn: 'English caption'
		});

		expect(result.success).toBe(false);
		if (result.success) return;

		expect(result.error.issues.map((issue) => issue.path.join('.'))).toContain('titleId');
	});

	it('accepts a published gallery item with an Indonesian title', () => {
		const result = galleryItemFormSchema.safeParse({
			status: 'published',
			sortOrder: '1',
			titleId: 'Gapura Canggi',
			captionId: 'Gapura utama kawasan pura.',
			titleEn: '',
			captionEn: ''
		});

		expect(result.success).toBe(true);
	});
});
