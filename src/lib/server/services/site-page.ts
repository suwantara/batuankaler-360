import { and, asc, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import {
	sitePage,
	sitePageBlock,
	sitePageBlockTranslation,
	sitePageTranslation
} from '../db/app.schema.ts';
import { locales, type Locale } from '#lib/i18n/index.ts';
import { getSitePageDefinition, sitePageRegistry } from '#lib/site-pages.ts';
import {
	isSitePageBlockType,
	localizedSitePageFields,
	type SitePageFormValues
} from '#lib/schemas/site-page.ts';
import { mergeSitePageBlockTranslation, mergeSitePageTranslation } from '#lib/site-page-merge.ts';
import type {
	SitePageAdmin,
	SitePageBlockAdmin,
	SitePageBlockTranslation,
	SitePageBlockView,
	SitePageTranslation,
	SitePageView
} from '#lib/types/site-page.ts';
import { NotFoundError, ValidationError } from '../errors.ts';

const emptyPageTranslation: SitePageTranslation = {
	eyebrow: '',
	title: '',
	description: '',
	verificationNote: ''
};

const emptyBlockTranslation: SitePageBlockTranslation = {
	heading: '',
	body: ''
};

async function findSitePage(slug: string) {
	return db.query.sitePage.findFirst({
		where: eq(sitePage.slug, slug),
		with: {
			translations: true,
			blocks: {
				with: { translations: true },
				orderBy: [asc(sitePageBlock.sortOrder), asc(sitePageBlock.createdAt)]
			}
		}
	});
}

type SitePageRow = NonNullable<Awaited<ReturnType<typeof findSitePage>>>;

function translationFor(row: SitePageRow, locale: Locale): SitePageTranslation {
	const translation = row.translations.find((item) => item.locale === locale);
	if (!translation) return { ...emptyPageTranslation };

	return {
		eyebrow: translation.eyebrow,
		title: translation.title,
		description: translation.description,
		verificationNote: translation.verificationNote
	};
}

function blockTranslationFor(
	block: SitePageRow['blocks'][number],
	locale: Locale
): SitePageBlockTranslation {
	const translation = block.translations.find((item) => item.locale === locale);
	if (!translation) return { ...emptyBlockTranslation };

	return {
		heading: translation.heading,
		body: translation.body
	};
}

function toAdminView(row: SitePageRow): SitePageAdmin {
	const blocks: SitePageBlockAdmin[] = row.blocks.map((block) => ({
		id: block.id,
		type: isSitePageBlockType(block.type) ? block.type : 'section',
		sortOrder: block.sortOrder,
		translations: {
			id: blockTranslationFor(block, 'id'),
			en: blockTranslationFor(block, 'en')
		}
	}));

	return {
		id: row.id,
		slug: row.slug,
		status: row.status,
		updatedAt: row.updatedAt.toISOString(),
		translations: {
			id: translationFor(row, 'id'),
			en: translationFor(row, 'en')
		},
		blocks
	};
}

async function requireSitePage(slug: string): Promise<SitePageRow> {
	const page = await findSitePage(slug);

	if (!page) {
		throw new Error(`Halaman ${slug} tidak ditemukan.`);
	}

	return page;
}

async function ensureSitePage(slug: string): Promise<SitePageRow> {
	const definition = getSitePageDefinition(slug);

	if (!definition) {
		throw new NotFoundError('Halaman tidak ditemukan.');
	}

	let page = await findSitePage(slug);

	if (!page) {
		await db
			.insert(sitePage)
			.values({
				slug: definition.slug,
				status: 'draft',
				sortOrder: definition.sortOrder
			})
			.onConflictDoNothing({ target: sitePage.slug });
		page = await requireSitePage(slug);
	}

	const existingLocales = new Set(page.translations.map((item) => item.locale));
	const missingLocales = locales.filter((locale) => !existingLocales.has(locale));

	if (missingLocales.length > 0) {
		const pageId = page.id;
		await db
			.insert(sitePageTranslation)
			.values(missingLocales.map((locale) => ({ pageId, locale })))
			.onConflictDoNothing();
		page = await requireSitePage(slug);
	}

	return page;
}

export async function listSitePagesForAdmin(): Promise<SitePageAdmin[]> {
	for (const definition of sitePageRegistry) {
		await ensureSitePage(definition.slug);
	}

	const pages = await db.query.sitePage.findMany({
		with: {
			translations: true,
			blocks: {
				with: { translations: true },
				orderBy: [asc(sitePageBlock.sortOrder), asc(sitePageBlock.createdAt)]
			}
		},
		orderBy: [asc(sitePage.sortOrder), asc(sitePage.slug)]
	});

	return pages.map(toAdminView);
}

export async function getOrCreateSitePage(slug: string): Promise<SitePageAdmin> {
	return toAdminView(await ensureSitePage(slug));
}

export async function saveSitePage(
	slug: string,
	input: SitePageFormValues
): Promise<SitePageAdmin> {
	const current = await ensureSitePage(slug);

	if (
		input.status === 'published' &&
		(input.titleId.trim() === '' || input.descriptionId.trim() === '')
	) {
		throw new ValidationError('Judul dan deskripsi wajib diisi sebelum halaman ditayangkan.');
	}

	const existingBlockIds = new Set(current.blocks.map((block) => block.id));
	const keptBlockIds = new Set<string>();

	await db.transaction(async (tx) => {
		await tx
			.update(sitePage)
			.set({ status: input.status, updatedAt: new Date() })
			.where(eq(sitePage.id, current.id));

		for (const locale of locales) {
			const fields = localizedSitePageFields(input, locale);

			await tx
				.insert(sitePageTranslation)
				.values({
					pageId: current.id,
					locale,
					...fields
				})
				.onConflictDoUpdate({
					target: [sitePageTranslation.pageId, sitePageTranslation.locale],
					set: fields
				});
		}

		for (const [index, block] of input.blocks.entries()) {
			let blockId = block.id;

			if (blockId) {
				if (!existingBlockIds.has(blockId)) {
					throw new ValidationError('Bagian artikel tidak valid.');
				}

				await tx
					.update(sitePageBlock)
					.set({ type: block.type, sortOrder: index, updatedAt: new Date() })
					.where(and(eq(sitePageBlock.id, blockId), eq(sitePageBlock.pageId, current.id)));
			} else {
				const [created] = await tx
					.insert(sitePageBlock)
					.values({
						pageId: current.id,
						type: block.type,
						sortOrder: index
					})
					.returning({ id: sitePageBlock.id });

				if (!created) {
					throw new Error('Gagal membuat bagian artikel.');
				}

				blockId = created.id;
			}

			keptBlockIds.add(blockId);

			const translations: Record<Locale, SitePageBlockTranslation> = {
				id: { heading: block.headingId, body: block.bodyId },
				en: { heading: block.headingEn, body: block.bodyEn }
			};

			for (const locale of locales) {
				const fields = translations[locale];

				await tx
					.insert(sitePageBlockTranslation)
					.values({
						blockId,
						locale,
						...fields
					})
					.onConflictDoUpdate({
						target: [sitePageBlockTranslation.blockId, sitePageBlockTranslation.locale],
						set: fields
					});
			}
		}

		for (const existingId of existingBlockIds) {
			if (!keptBlockIds.has(existingId)) {
				await tx.delete(sitePageBlock).where(eq(sitePageBlock.id, existingId));
			}
		}
	});

	return toAdminView(await requireSitePage(slug));
}

export async function getPublishedSitePage(
	slug: string,
	locale: Locale
): Promise<SitePageView | null> {
	const page = await db.query.sitePage.findFirst({
		where: and(eq(sitePage.slug, slug), eq(sitePage.status, 'published')),
		with: {
			translations: true,
			blocks: {
				with: { translations: true },
				orderBy: [asc(sitePageBlock.sortOrder), asc(sitePageBlock.createdAt)]
			}
		}
	});

	if (!page) return null;

	const pageTranslations: Record<Locale, SitePageTranslation> = {
		id: translationFor(page, 'id'),
		en: translationFor(page, 'en')
	};
	const mergedPage = mergeSitePageTranslation(locale, pageTranslations);

	const blocks: SitePageBlockView[] = [];
	let fallbackUsed = mergedPage.fallbackUsed;

	for (const block of page.blocks) {
		const blockTranslations: Record<Locale, SitePageBlockTranslation> = {
			id: blockTranslationFor(block, 'id'),
			en: blockTranslationFor(block, 'en')
		};
		const mergedBlock = mergeSitePageBlockTranslation(locale, blockTranslations);

		if (mergedBlock.fallbackUsed) fallbackUsed = true;

		if (mergedBlock.fields.heading.trim() === '' && mergedBlock.fields.body.trim() === '') {
			continue;
		}

		blocks.push({
			id: block.id,
			type: isSitePageBlockType(block.type) ? block.type : 'section',
			heading: mergedBlock.fields.heading,
			body: mergedBlock.fields.body
		});
	}

	if (
		mergedPage.fields.title.trim() === '' &&
		mergedPage.fields.description.trim() === '' &&
		blocks.length === 0
	) {
		return null;
	}

	return {
		slug: page.slug,
		eyebrow: mergedPage.fields.eyebrow,
		title: mergedPage.fields.title,
		description: mergedPage.fields.description,
		verificationNote: mergedPage.fields.verificationNote,
		updatedAt: page.updatedAt.toISOString(),
		fallbackUsed,
		blocks
	};
}
