import { describe, expect, it } from 'vitest';
import { areaFormSchema } from './area.ts';

describe('area form schema', () => {
	it('allows a draft area without translations', () => {
		const result = areaFormSchema.safeParse({
			slug: 'area-baru',
			status: 'draft',
			sortOrder: '0',
			titleId: '',
			descriptionId: '',
			titleEn: '',
			descriptionEn: ''
		});

		expect(result.success).toBe(true);
	});

	it('requires Indonesian content before publishing', () => {
		const result = areaFormSchema.safeParse({
			slug: 'area-baru',
			status: 'published',
			sortOrder: '0',
			titleId: '',
			descriptionId: '',
			titleEn: 'New area',
			descriptionEn: 'English description'
		});

		expect(result.success).toBe(false);
		if (result.success) return;

		const fields = result.error.issues.map((issue) => issue.path.join('.'));
		expect(fields).toContain('titleId');
		expect(fields).toContain('descriptionId');
	});

	it('accepts a published area with Indonesian content', () => {
		const result = areaFormSchema.safeParse({
			slug: 'jaba-pura',
			status: 'published',
			sortOrder: '1',
			titleId: 'Jaba Pura',
			descriptionId: 'Area luar kawasan pura.',
			titleEn: '',
			descriptionEn: ''
		});

		expect(result.success).toBe(true);
	});
});
