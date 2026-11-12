import { describe, expect, it } from 'vitest';
import { dictionary } from './i18n/dictionary.ts';
import {
	homeContentFormSchema,
	homeContentFormValuesFromData,
	parseHomeContent
} from './schemas/home-content.ts';

describe('home content', () => {
	it('uses dictionary defaults when stored content is empty', () => {
		const values = homeContentFormValuesFromData({
			slug: 'beranda',
			status: 'draft',
			updatedAt: new Date().toISOString(),
			data: { id: {}, en: {} }
		});

		expect(values.content.id.hero.titleLead).toBe(dictionary.id.home.hero.titleLead);
		expect(values.content.en.hero.titleLead).toBe(dictionary.en.home.hero.titleLead);
	});

	it('rejects empty stored content', () => {
		expect(parseHomeContent({})).toBeNull();
	});

	it('accepts the dictionary home content', () => {
		expect(parseHomeContent(dictionary.id.home)).not.toBeNull();
	});

	it('requires a hero title and description before publishing', () => {
		const content = {
			id: { ...dictionary.id.home, hero: { ...dictionary.id.home.hero, titleLead: '' } },
			en: dictionary.en.home
		};

		const result = homeContentFormSchema.safeParse({
			status: 'published',
			content: JSON.stringify(content)
		});

		expect(result.success).toBe(false);
	});

	it('accepts a valid home content form payload', () => {
		const result = homeContentFormSchema.safeParse({
			status: 'draft',
			content: JSON.stringify({
				id: dictionary.id.home,
				en: dictionary.en.home
			})
		});

		expect(result.success).toBe(true);
	});
});
