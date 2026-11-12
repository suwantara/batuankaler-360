import { z } from 'zod';
import { dictionary, type SiteDictionary } from '#lib/i18n/dictionary.ts';
import type { Locale } from '#lib/i18n/locales.ts';
import type { SitePageDataAdmin } from '#lib/types/site-page.ts';

export type HomeContent = SiteDictionary['home'];

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

export const homeContentFormSchema = z
	.object({
		status: z.enum(['draft', 'published']),
		content: z.preprocess(
			(value) => {
				if (typeof value !== 'string') return value;

				try {
					return JSON.parse(value);
				} catch {
					return null;
				}
			},
			z.object({
				id: homeLocaleSchema,
				en: homeLocaleSchema
			})
		)
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

export function homeContentFormValuesFromData(page: SitePageDataAdmin): HomeContentFormValues {
	return {
		status: page.status,
		content: {
			id: parseHomeContent(page.data.id) ?? dictionary.id.home,
			en: parseHomeContent(page.data.en) ?? dictionary.en.home
		}
	};
}

function parseJsonContent(value: string | undefined): unknown {
	if (!value) return null;

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
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
		}
	};
}

export function homeContentForLocale(content: Record<Locale, HomeContent>, locale: Locale) {
	return content[locale];
}
