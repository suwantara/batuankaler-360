import { z } from 'zod';
import { dictionary, type SiteDictionary } from '#lib/i18n/dictionary.ts';
import type { Locale } from '#lib/i18n/locales.ts';
import type { SitePageDataAdmin } from '#lib/types/site-page.ts';

export type HomeContent = SiteDictionary['home'];

export interface HomeMedia {
	heroAssetId: string;
	previewAssetId: string;
}

export interface HomeSeo {
	title: string;
	description: string;
}

export type HomeSeoValues = Record<Locale, HomeSeo>;

const text = (max: number) =>
	z.string().trim().max(max, `Maksimal ${max} karakter.`).optional().default('');

const metaItemSchema = z.object({
	label: text(100),
	value: text(300)
});

const pointSchema = z.object({
	title: text(200),
	body: text(1500)
});

const areaItemSchema = z.object({
	name: text(200),
	description: text(1500)
});

const galleryItemSchema = z.object({
	title: text(200),
	caption: text(1000)
});

const guideItemSchema = z.object({
	title: text(200),
	body: text(1500)
});

const assetIdSchema = z.preprocess(
	(value) => (typeof value === 'string' ? value.trim() : value),
	z
		.union([z.literal(''), z.uuid()])
		.optional()
		.default('')
);

export const homeMediaSchema = z.object({
	heroAssetId: assetIdSchema,
	previewAssetId: assetIdSchema
});

export const homeSeoLocaleSchema = z.object({
	title: text(300),
	description: text(500)
});

export const homeSeoFormSchema = z.object({
	id: homeSeoLocaleSchema,
	en: homeSeoLocaleSchema
});

export const homeLocaleSchema = z.object({
	hero: z.object({
		eyebrow: text(200),
		title: text(300),
		titleLead: text(300),
		titleAccent: text(300),
		description: text(2000),
		note: text(500),
		viewLabel: text(200),
		meta: z.array(metaItemSchema).length(3)
	}),
	intro: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		points: z.array(pointSchema).length(3)
	}),
	tour: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		previewLabel: text(200)
	}),
	history: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		noteLabel: text(200),
		status: text(300)
	}),
	areas: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		items: z.array(areaItemSchema).length(3)
	}),
	gallery: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		pending: text(200),
		items: z.array(galleryItemSchema).length(3)
	}),
	guide: z.object({
		eyebrow: text(200),
		title: text(300),
		body: text(3000),
		items: z.array(guideItemSchema).length(3)
	})
});

function parseJsonContent(value: unknown): unknown {
	if (typeof value !== 'string') return value;

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

export const homeContentFormSchema = z
	.object({
		status: z.enum(['draft', 'published']),
		content: z.preprocess(
			parseJsonContent,
			z.object({
				id: homeLocaleSchema,
				en: homeLocaleSchema
			})
		),
		seo: z.preprocess(parseJsonContent, homeSeoFormSchema),
		media: z.preprocess(parseJsonContent, homeMediaSchema)
	})
	.superRefine((value, context) => {
		if (value.status !== 'published') return;

		if (value.content.id.hero.titleLead.trim() === '') {
			context.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'Judul utama beranda wajib diisi sebelum ditayangkan.'
			});
		}

		if (value.content.id.hero.description.trim() === '') {
			context.addIssue({
				code: 'custom',
				path: ['content'],
				message: 'Deskripsi hero wajib diisi sebelum ditayangkan.'
			});
		}
	});

export type HomeContentFormValues = z.infer<typeof homeContentFormSchema>;

export function parseHomeContent(value: unknown): HomeContent | null {
	const result = homeLocaleSchema.safeParse(value);
	return result.success ? (result.data as HomeContent) : null;
}

export function parseHomeMedia(value: unknown): HomeMedia {
	const result = homeMediaSchema.safeParse(value);

	return result.success ? result.data : { heroAssetId: '', previewAssetId: '' };
}

export function parseHomeShared(value: unknown): HomeMedia {
	if (typeof value !== 'object' || value === null) {
		return { heroAssetId: '', previewAssetId: '' };
	}

	return parseHomeMedia((value as { media?: unknown }).media);
}

export function parseHomeSeo(value: unknown): HomeSeoValues {
	const result = homeSeoFormSchema.safeParse(value);
	return result.success
		? result.data
		: {
				id: { title: '', description: '' },
				en: { title: '', description: '' }
			};
}

export function homeContentFormValuesFromData(page: SitePageDataAdmin): HomeContentFormValues {
	return {
		status: page.status,
		content: {
			id: parseHomeContent(page.data.id) ?? dictionary.id.home,
			en: parseHomeContent(page.data.en) ?? dictionary.en.home
		},
		seo: {
			id: { ...page.meta.id },
			en: { ...page.meta.en }
		},
		media: parseHomeShared(page.shared)
	};
}

export function homeContentFormValuesFromRaw(raw: Record<string, string>): HomeContentFormValues {
	const parsed = parseJsonContent(raw.content);
	const content =
		typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};

	return {
		status: raw.status === 'published' ? 'published' : 'draft',
		content: {
			id: parseHomeContent(content.id) ?? dictionary.id.home,
			en: parseHomeContent(content.en) ?? dictionary.en.home
		},
		seo: parseHomeSeo(parseJsonContent(raw.seo)),
		media: parseHomeMedia(parseJsonContent(raw.media))
	};
}

export function homeContentForLocale(content: Record<Locale, HomeContent>, locale: Locale) {
	return content[locale];
}
