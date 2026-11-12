import { z } from 'zod';
import type { Locale } from '#lib/i18n/locales.ts';
import type {
	SitePageAdmin,
	SitePageBlockType,
	SitePageTranslation
} from '#lib/types/site-page.ts';

const text = (max: number) =>
	z.string().trim().max(max, `Maksimal ${max} karakter.`).optional().default('');

const blockTypeSchema = z.enum(['section', 'quote', 'source']);

export function isSitePageBlockType(value: string): value is SitePageBlockType {
	return value === 'section' || value === 'quote' || value === 'source';
}

export const sitePageBlockFormSchema = z
	.object({
		id: z.union([z.uuid(), z.null()]).optional().default(null),
		type: blockTypeSchema,
		headingId: text(300),
		bodyId: text(20000),
		headingEn: text(300),
		bodyEn: text(20000)
	})
	.superRefine((value, context) => {
		if (value.type === 'section') {
			if (value.headingId.trim() === '') {
				context.addIssue({
					code: 'custom',
					path: ['headingId'],
					message: 'Judul bagian wajib diisi.'
				});
			}

			if (value.bodyId.trim() === '') {
				context.addIssue({
					code: 'custom',
					path: ['bodyId'],
					message: 'Isi bagian wajib diisi.'
				});
			}
		}

		if ((value.type === 'quote' || value.type === 'source') && value.bodyId.trim() === '') {
			context.addIssue({
				code: 'custom',
				path: ['bodyId'],
				message: 'Isi wajib diisi.'
			});
		}
	});

export type SitePageBlockFormValues = z.infer<typeof sitePageBlockFormSchema>;

export const sitePageFormSchema = z
	.object({
		status: z.enum(['draft', 'published']),

		eyebrowId: text(200),
		titleId: text(300),
		descriptionId: text(5000),
		verificationNoteId: text(500),

		eyebrowEn: text(200),
		titleEn: text(300),
		descriptionEn: text(5000),
		verificationNoteEn: text(500),

		blocks: z.preprocess(
			(value) => {
				if (typeof value !== 'string') return value;

				try {
					return JSON.parse(value);
				} catch {
					return null;
				}
			},
			z.array(sitePageBlockFormSchema).max(100, 'Maksimal 100 bagian.')
		)
	})
	.superRefine((value, context) => {
		if (value.status !== 'published') return;

		if (value.titleId.trim() === '') {
			context.addIssue({
				code: 'custom',
				path: ['titleId'],
				message: 'Judul wajib diisi sebelum halaman ditayangkan.'
			});
		}

		if (value.descriptionId.trim() === '') {
			context.addIssue({
				code: 'custom',
				path: ['descriptionId'],
				message: 'Deskripsi wajib diisi sebelum halaman ditayangkan.'
			});
		}
	});

export type SitePageFormValues = z.infer<typeof sitePageFormSchema>;

export const emptySitePageFormValues: SitePageFormValues = {
	status: 'draft',
	eyebrowId: '',
	titleId: '',
	descriptionId: '',
	verificationNoteId: '',
	eyebrowEn: '',
	titleEn: '',
	descriptionEn: '',
	verificationNoteEn: '',
	blocks: []
};

export function sitePageFormValuesFromAdmin(page: SitePageAdmin): SitePageFormValues {
	const id = page.translations.id;
	const en = page.translations.en;

	return {
		status: page.status,
		eyebrowId: id.eyebrow,
		titleId: id.title,
		descriptionId: id.description,
		verificationNoteId: id.verificationNote,
		eyebrowEn: en.eyebrow,
		titleEn: en.title,
		descriptionEn: en.description,
		verificationNoteEn: en.verificationNote,
		blocks: page.blocks.map((block) => ({
			id: block.id,
			type: block.type,
			headingId: block.translations.id.heading,
			bodyId: block.translations.id.body,
			headingEn: block.translations.en.heading,
			bodyEn: block.translations.en.body
		}))
	};
}

function blockFromUnknown(value: unknown): SitePageBlockFormValues {
	const record =
		typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
	const stringValue = (input: unknown) => (typeof input === 'string' ? input : '');
	const type = stringValue(record.type);

	return {
		id: typeof record.id === 'string' ? record.id : null,
		type: isSitePageBlockType(type) ? type : 'section',
		headingId: stringValue(record.headingId),
		bodyId: stringValue(record.bodyId),
		headingEn: stringValue(record.headingEn),
		bodyEn: stringValue(record.bodyEn)
	};
}

function blocksFromRaw(value: string | undefined): SitePageBlockFormValues[] {
	if (!value) return [];

	try {
		const parsed: unknown = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.map(blockFromUnknown) : [];
	} catch {
		return [];
	}
}

export function sitePageFormValuesFromRaw(raw: Record<string, string>): SitePageFormValues {
	return {
		status: raw.status === 'published' ? 'published' : 'draft',
		eyebrowId: raw.eyebrowId ?? '',
		titleId: raw.titleId ?? '',
		descriptionId: raw.descriptionId ?? '',
		verificationNoteId: raw.verificationNoteId ?? '',
		eyebrowEn: raw.eyebrowEn ?? '',
		titleEn: raw.titleEn ?? '',
		descriptionEn: raw.descriptionEn ?? '',
		verificationNoteEn: raw.verificationNoteEn ?? '',
		blocks: blocksFromRaw(raw.blocks)
	};
}

export function localizedSitePageFields(
	values: SitePageFormValues,
	locale: Locale
): SitePageTranslation {
	if (locale === 'id') {
		return {
			eyebrow: values.eyebrowId,
			title: values.titleId,
			description: values.descriptionId,
			verificationNote: values.verificationNoteId
		};
	}

	return {
		eyebrow: values.eyebrowEn,
		title: values.titleEn,
		description: values.descriptionEn,
		verificationNote: values.verificationNoteEn
	};
}

export function sitePageBlocksFromForm(values: SitePageFormValues): SitePageBlockFormValues[] {
	return values.blocks;
}
