import { describe, expect, it } from 'vitest';
import { mergeSitePageBlockTranslation, mergeSitePageTranslation } from './site-page-merge.ts';
import { sitePageFormSchema } from './schemas/site-page.ts';
import type { SitePageBlockTranslation, SitePageTranslation } from './types/site-page.ts';

function pageTranslation(overrides: Partial<SitePageTranslation> = {}): SitePageTranslation {
	return {
		eyebrow: '',
		title: '',
		description: '',
		verificationNote: '',
		...overrides
	};
}

function blockTranslation(
	overrides: Partial<SitePageBlockTranslation> = {}
): SitePageBlockTranslation {
	return {
		heading: '',
		body: '',
		...overrides
	};
}

describe('site page content', () => {
	it('falls back from EN to ID for page metadata', () => {
		const result = mergeSitePageTranslation('en', {
			id: pageTranslation({ eyebrow: 'Sejarah', title: 'Sejarah kawasan' }),
			en: pageTranslation({ eyebrow: 'History' })
		});

		expect(result.fields.eyebrow).toBe('History');
		expect(result.fields.title).toBe('Sejarah kawasan');
		expect(result.fallbackUsed).toBe(true);
	});

	it('falls back from EN to ID for article blocks', () => {
		const result = mergeSitePageBlockTranslation('en', {
			id: blockTranslation({ heading: 'Awal kawasan', body: 'Isi Indonesia' }),
			en: blockTranslation({ heading: 'The beginning' })
		});

		expect(result.fields.heading).toBe('The beginning');
		expect(result.fields.body).toBe('Isi Indonesia');
		expect(result.fallbackUsed).toBe(true);
	});

	it('does not fall back from ID to EN', () => {
		const result = mergeSitePageTranslation('id', {
			id: pageTranslation(),
			en: pageTranslation({ title: 'English title' })
		});

		expect(result.fields.title).toBe('');
		expect(result.fallbackUsed).toBe(false);
	});

	it('requires a title and description for published pages', () => {
		const result = sitePageFormSchema.safeParse({
			status: 'published',
			titleId: '',
			descriptionId: 'Ringkasan',
			blocks: '[]'
		});

		expect(result.success).toBe(false);
	});

	it('accepts a valid article block', () => {
		const result = sitePageFormSchema.safeParse({
			status: 'draft',
			blocks: JSON.stringify([
				{
					id: null,
					type: 'section',
					headingId: 'Awal kawasan',
					bodyId: 'Isi bagian.',
					headingEn: 'The beginning',
					bodyEn: 'Section body.'
				}
			])
		});

		expect(result.success).toBe(true);
	});

	it('rejects malformed block JSON', () => {
		const result = sitePageFormSchema.safeParse({
			status: 'draft',
			blocks: 'bukan-json'
		});

		expect(result.success).toBe(false);
	});
});
