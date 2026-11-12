import { describe, expect, it } from 'vitest';
import { dictionary } from './i18n/dictionary.ts';
import {
	homeContentFormSchema,
	homeContentFormValuesFromData,
	parseHomeContent,
	parseHomeShared
} from './schemas/home-content.ts';

const assetId = '11111111-1111-4111-8111-111111111111';

const emptySeo = {
	id: { title: '', description: '' },
	en: { title: '', description: '' }
};

const emptyMedia = {
	heroAssetId: '',
	previewAssetId: ''
};

function formPayload(overrides: Record<string, string> = {}) {
	return {
		status: 'draft',
		content: JSON.stringify({
			id: dictionary.id.home,
			en: dictionary.en.home
		}),
		seo: JSON.stringify(emptySeo),
		media: JSON.stringify(emptyMedia),
		...overrides
	};
}

describe('home content', () => {
	it('uses dictionary defaults when stored content is empty', () => {
		const values = homeContentFormValuesFromData({
			slug: 'beranda',
			status: 'draft',
			updatedAt: new Date().toISOString(),
			data: { id: {}, en: {} },
			meta: emptySeo,
			shared: {}
		});

		expect(values.content.id.hero.titleLead).toBe(dictionary.id.home.hero.titleLead);
		expect(values.content.en.hero.titleLead).toBe(dictionary.en.home.hero.titleLead);
		expect(values.media).toEqual(emptyMedia);
	});

	it('reads SEO metadata and shared images from stored page data', () => {
		const values = homeContentFormValuesFromData({
			slug: 'beranda',
			status: 'draft',
			updatedAt: new Date().toISOString(),
			data: { id: {}, en: {} },
			meta: {
				id: { title: 'Judul SEO', description: 'Deskripsi SEO' },
				en: { title: 'SEO title', description: 'SEO description' }
			},
			shared: { media: { heroAssetId: assetId, previewAssetId: '' } }
		});

		expect(values.seo.id.title).toBe('Judul SEO');
		expect(values.seo.en.description).toBe('SEO description');
		expect(values.media.heroAssetId).toBe(assetId);
	});

	it('rejects empty stored content', () => {
		expect(parseHomeContent({})).toBeNull();
	});

	it('accepts the dictionary home content', () => {
		expect(parseHomeContent(dictionary.id.home)).not.toBeNull();
	});

	it('defaults shared media when no image is selected', () => {
		expect(parseHomeShared({})).toEqual(emptyMedia);
		expect(parseHomeShared(null)).toEqual(emptyMedia);
	});

	it('requires a hero title and description before publishing', () => {
		const content = {
			id: { ...dictionary.id.home, hero: { ...dictionary.id.home.hero, titleLead: '' } },
			en: dictionary.en.home
		};

		const result = homeContentFormSchema.safeParse(
			formPayload({
				status: 'published',
				content: JSON.stringify(content)
			})
		);

		expect(result.success).toBe(false);
	});

	it('accepts a valid home content form payload with SEO and images', () => {
		const result = homeContentFormSchema.safeParse(
			formPayload({
				seo: JSON.stringify({
					id: { title: 'Beranda', description: 'Deskripsi beranda.' },
					en: { title: 'Home', description: 'Home description.' }
				}),
				media: JSON.stringify({ heroAssetId: assetId, previewAssetId: assetId })
			})
		);

		expect(result.success).toBe(true);
	});

	it('rejects an invalid image asset id', () => {
		const result = homeContentFormSchema.safeParse(
			formPayload({
				media: JSON.stringify({ heroAssetId: 'bukan-uuid', previewAssetId: '' })
			})
		);

		expect(result.success).toBe(false);
	});
});
