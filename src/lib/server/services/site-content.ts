import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { siteContent, siteContentTranslation } from '../db/app.schema.ts';
import { locales, type Locale } from '#lib/i18n/index.ts';
import { hasVisitInformation, mergeVisitInformationFields } from '#lib/site-content.ts';
import type {
	VisitInformationAdmin,
	VisitInformationFields,
	VisitInformationTranslationMap,
	VisitInformationView
} from '#lib/types/site-content.ts';
import type { VisitInformationFormInput } from '#lib/schemas/site-content.ts';
import { localizedVisitFieldsFromForm } from '#lib/schemas/site-content.ts';
import { ValidationError } from '../errors.ts';

const VISIT_INFORMATION_SLUG = 'visit-info';

async function findVisitInformation() {
	return db.query.siteContent.findFirst({
		where: eq(siteContent.slug, VISIT_INFORMATION_SLUG),
		with: { translations: true }
	});
}

type VisitContentRow = NonNullable<Awaited<ReturnType<typeof findVisitInformation>>>;

function emptyFields(): VisitInformationFields {
	return {
		heritageLabel: '',
		location: '',
		visitingHours: '',
		access: '',
		dressCode: '',
		photoPolicy: '',
		etiquette: '',
		contact: '',
		verificationNote: ''
	};
}

function fieldsFromTranslation(
	translation: VisitContentRow['translations'][number] | undefined
): VisitInformationFields {
	if (!translation) return emptyFields();

	return {
		heritageLabel: translation.heritageLabel,
		location: translation.location,
		visitingHours: translation.visitingHours,
		access: translation.access,
		dressCode: translation.dressCode,
		photoPolicy: translation.photoPolicy,
		etiquette: translation.etiquette,
		contact: translation.contact,
		verificationNote: translation.verificationNote
	};
}

function translationMap(row: VisitContentRow): VisitInformationTranslationMap {
	return {
		id: fieldsFromTranslation(row.translations.find((item) => item.locale === 'id')),
		en: fieldsFromTranslation(row.translations.find((item) => item.locale === 'en'))
	};
}

function toAdminView(row: VisitContentRow): VisitInformationAdmin {
	return {
		id: row.id,
		status: row.status,
		managerName: row.managerName,
		managerUrl: row.managerUrl,
		mapUrl: row.mapUrl,
		updatedAt: row.updatedAt.toISOString(),
		translations: translationMap(row)
	};
}

async function requireVisitInformation(): Promise<VisitContentRow> {
	const content = await findVisitInformation();

	if (!content) {
		throw new Error('Konten informasi kunjungan tidak ditemukan.');
	}

	return content;
}

export async function getOrCreateVisitInformation(): Promise<VisitInformationAdmin> {
	let content = await findVisitInformation();

	if (!content) {
		await db
			.insert(siteContent)
			.values({ slug: VISIT_INFORMATION_SLUG, status: 'draft' })
			.onConflictDoNothing({ target: siteContent.slug });
		content = await requireVisitInformation();
	}

	const existingLocales = new Set(content.translations.map((item) => item.locale));
	const missingLocales = locales.filter((locale) => !existingLocales.has(locale));

	if (missingLocales.length > 0) {
		const contentId = content.id;
		await db
			.insert(siteContentTranslation)
			.values(missingLocales.map((locale) => ({ contentId, locale })))
			.onConflictDoNothing();
		content = await requireVisitInformation();
	}

	return toAdminView(content);
}

export async function updateVisitInformation(
	input: VisitInformationFormInput
): Promise<VisitInformationAdmin> {
	const current = await getOrCreateVisitInformation();
	const idFields = localizedVisitFieldsFromForm(input, 'id');

	if (input.status === 'published' && !hasVisitInformation(idFields)) {
		throw new ValidationError(
			'Isi minimal satu informasi berbahasa Indonesia sebelum menayangkan konten.'
		);
	}

	await db.transaction(async (tx) => {
		await tx
			.update(siteContent)
			.set({
				status: input.status,
				managerName: input.managerName,
				managerUrl: input.managerUrl,
				mapUrl: input.mapUrl,
				updatedAt: new Date()
			})
			.where(eq(siteContent.id, current.id));

		for (const locale of locales) {
			const fields = localizedVisitFieldsFromForm(input, locale);

			await tx
				.insert(siteContentTranslation)
				.values({
					contentId: current.id,
					locale,
					...fields
				})
				.onConflictDoUpdate({
					target: [siteContentTranslation.contentId, siteContentTranslation.locale],
					set: fields
				});
		}
	});

	return toAdminView(await requireVisitInformation());
}

export async function getPublishedVisitInformation(
	locale: Locale
): Promise<VisitInformationView | null> {
	const content = await db.query.siteContent.findFirst({
		where: and(eq(siteContent.slug, VISIT_INFORMATION_SLUG), eq(siteContent.status, 'published')),
		with: { translations: true }
	});

	if (!content) return null;

	const { fields, fallbackUsed } = mergeVisitInformationFields(locale, translationMap(content));

	if (!hasVisitInformation(fields) && content.managerName.trim() === '') {
		return null;
	}

	return {
		...fields,
		managerName: content.managerName,
		managerUrl: content.managerUrl,
		mapUrl: content.mapUrl,
		updatedAt: content.updatedAt.toISOString(),
		fallbackUsed
	};
}
