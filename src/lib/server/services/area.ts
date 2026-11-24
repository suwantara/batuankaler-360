import { and, asc, eq, ne } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { area, areaTranslation, scene } from '../db/app.schema.ts';
import { locales, type Locale } from '#lib/i18n/index.ts';
import { ConflictError, NotFoundError, ValidationError } from '../errors.ts';
import type { AreaFormInput } from '#lib/schemas/area.ts';
import type {
	AreaAdmin,
	AreaDetailView,
	AreaListItem,
	AreaTranslationMap
} from '#lib/types/area.ts';

async function findArea(id: string) {
	return db.query.area.findFirst({
		where: eq(area.id, id),
		with: {
			translations: true,
			scenes: { columns: { id: true } }
		}
	});
}

type AreaRow = NonNullable<Awaited<ReturnType<typeof findArea>>>;

function emptyTranslations(): AreaTranslationMap {
	return {
		id: { title: '', description: '' },
		en: { title: '', description: '' }
	};
}

function translationMap(row: Pick<AreaRow, 'translations'>): AreaTranslationMap {
	const result = emptyTranslations();

	for (const translation of row.translations) {
		result[translation.locale] = {
			title: translation.title,
			description: translation.description
		};
	}

	return result;
}

function toAdminView(row: AreaRow): AreaAdmin {
	return {
		id: row.id,
		slug: row.slug,
		status: row.status,
		sortOrder: row.sortOrder,
		updatedAt: row.updatedAt.toISOString(),
		translations: translationMap(row),
		sceneCount: row.scenes.length
	};
}

function inputTranslations(input: AreaFormInput): AreaTranslationMap {
	return {
		id: { title: input.titleId, description: input.descriptionId },
		en: { title: input.titleEn, description: input.descriptionEn }
	};
}

function mergeAreaTranslation(
	locale: Locale,
	translations: AreaTranslationMap
): { title: string; description: string; fallbackUsed: boolean } {
	const id = translations.id;
	const en = translations.en;

	if (locale === 'id') {
		return { title: id.title.trim(), description: id.description.trim(), fallbackUsed: false };
	}

	const title = en.title.trim() || id.title.trim();
	const description = en.description.trim() || id.description.trim();
	const fallbackUsed =
		(id.title.trim() !== '' || id.description.trim() !== '') &&
		(!en.title.trim() || !en.description.trim());

	return { title, description, fallbackUsed };
}

async function assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
	const where = excludeId ? and(eq(area.slug, slug), ne(area.id, excludeId)) : eq(area.slug, slug);
	const existing = await db.query.area.findFirst({ where });

	if (existing) {
		throw new ConflictError('Slug area sudah digunakan.');
	}
}

function assertPublishable(input: AreaFormInput): void {
	if (input.status !== 'published') return;

	if (!input.titleId.trim() || !input.descriptionId.trim()) {
		throw new ValidationError(
			'Judul dan deskripsi Indonesia wajib diisi sebelum area ditayangkan.'
		);
	}
}

export async function listAreasForAdmin(): Promise<AreaAdmin[]> {
	const rows = await db.query.area.findMany({
		with: {
			translations: true,
			scenes: { columns: { id: true } }
		},
		orderBy: [asc(area.sortOrder), asc(area.slug)]
	});

	return rows.map(toAdminView);
}

export async function getAreaForAdmin(id: string): Promise<AreaAdmin | null> {
	const row = await findArea(id);

	return row ? toAdminView(row) : null;
}

export async function createArea(input: AreaFormInput): Promise<AreaAdmin> {
	assertPublishable(input);
	await assertSlugAvailable(input.slug);

	const created = await db.transaction(async (tx) => {
		const [row] = await tx
			.insert(area)
			.values({
				slug: input.slug,
				status: input.status,
				sortOrder: input.sortOrder
			})
			.returning();

		if (!row) {
			throw new Error('Gagal membuat area.');
		}

		const translations = inputTranslations(input);

		await tx.insert(areaTranslation).values(
			locales.map((locale) => ({
				areaId: row.id,
				locale,
				...translations[locale]
			}))
		);

		return row;
	});

	const result = await getAreaForAdmin(created.id);

	if (!result) {
		throw new Error('Area yang baru dibuat tidak ditemukan.');
	}

	return result;
}

export async function updateArea(id: string, input: AreaFormInput): Promise<AreaAdmin> {
	const existing = await findArea(id);

	if (!existing) {
		throw new NotFoundError('Area tidak ditemukan.');
	}

	assertPublishable(input);
	await assertSlugAvailable(input.slug, id);

	await db.transaction(async (tx) => {
		const [updated] = await tx
			.update(area)
			.set({
				slug: input.slug,
				status: input.status,
				sortOrder: input.sortOrder,
				updatedAt: new Date()
			})
			.where(eq(area.id, id))
			.returning();

		if (!updated) {
			throw new NotFoundError('Area tidak ditemukan.');
		}

		const translations = inputTranslations(input);

		for (const locale of locales) {
			await tx
				.insert(areaTranslation)
				.values({
					areaId: id,
					locale,
					...translations[locale]
				})
				.onConflictDoUpdate({
					target: [areaTranslation.areaId, areaTranslation.locale],
					set: translations[locale]
				});
		}
	});

	const result = await getAreaForAdmin(id);

	if (!result) {
		throw new NotFoundError('Area tidak ditemukan.');
	}

	return result;
}

export async function deleteArea(id: string): Promise<void> {
	const existing = await findArea(id);

	if (!existing) {
		throw new NotFoundError('Area tidak ditemukan.');
	}

	const referencingScenes = await db
		.select({ id: scene.id })
		.from(scene)
		.where(eq(scene.areaId, id))
		.limit(1);

	if (referencingScenes.length > 0) {
		throw new ConflictError(
			'Area tidak dapat dihapus karena masih digunakan oleh scene. Pindahkan scene ke area lain terlebih dahulu.'
		);
	}

	await db.delete(area).where(eq(area.id, id));
}

export async function getPublishedAreas(locale: Locale): Promise<AreaListItem[]> {
	const rows = await db.query.area.findMany({
		where: eq(area.status, 'published'),
		with: { translations: true },
		orderBy: [asc(area.sortOrder), asc(area.slug)]
	});

	return rows
		.map((row) => {
			const merged = mergeAreaTranslation(locale, translationMap(row));

			return {
				id: row.id,
				slug: row.slug,
				...merged
			};
		})
		.filter((item) => item.title !== '');
}

export async function listPublishedAreaSitemapEntries(): Promise<
	Array<{ slug: string; updatedAt: Date }>
> {
	return db
		.select({ slug: area.slug, updatedAt: area.updatedAt })
		.from(area)
		.where(eq(area.status, 'published'))
		.orderBy(asc(area.sortOrder), asc(area.slug));
}

function sceneTranslationFor(
	locale: Locale,
	translations: Array<{ locale: Locale; title: string; description: string }>
): { title: string; description: string } | null {
	const id = translations.find((item) => item.locale === 'id');
	const en = translations.find((item) => item.locale === 'en');

	if (locale === 'id') {
		return id ? { title: id.title, description: id.description } : null;
	}

	const title = en?.title.trim() || id?.title || '';
	const description = en?.description.trim() || id?.description || '';

	return title ? { title, description } : null;
}

export async function getPublishedAreaBySlug(
	slug: string,
	locale: Locale
): Promise<AreaDetailView | null> {
	const row = await db.query.area.findFirst({
		where: and(eq(area.slug, slug), eq(area.status, 'published')),
		with: {
			translations: true,
			scenes: {
				where: eq(scene.status, 'published'),
				with: {
					translations: true,
					panoramaAsset: true
				},
				orderBy: [asc(scene.sortOrder), asc(scene.slug)]
			}
		}
	});

	if (!row) return null;

	const merged = mergeAreaTranslation(locale, translationMap(row));

	if (!merged.title) return null;

	const scenes = row.scenes.flatMap((item) => {
		if (!item.panoramaAsset) return [];

		const translation = sceneTranslationFor(locale, item.translations);

		if (!translation) return [];

		return [
			{
				id: item.id,
				slug: item.slug,
				title: translation.title,
				description: translation.description,
				thumbnail: item.panoramaAsset.thumbnailPath
			}
		];
	});

	return {
		id: row.id,
		slug: row.slug,
		title: merged.title,
		description: merged.description,
		fallbackUsed: merged.fallbackUsed,
		updatedAt: row.updatedAt.toISOString(),
		scenes
	};
}
