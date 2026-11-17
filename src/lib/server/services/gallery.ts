import { randomUUID } from 'node:crypto';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { galleryItem, galleryItemTranslation } from '../db/app.schema.ts';
import { locales, type Locale } from '#lib/i18n/index.ts';
import { NotFoundError, ValidationError } from '../errors.ts';
import { deletePanoramaFile, saveGalleryImage } from '../storage/index.ts';
import type { GalleryItemFormInput } from '#lib/schemas/gallery.ts';
import type {
	GalleryItemAdmin,
	GalleryItemView,
	GalleryTranslationMap
} from '#lib/types/gallery.ts';

async function findGalleryItem(id: string) {
	return db.query.galleryItem.findFirst({
		where: eq(galleryItem.id, id),
		with: { translations: true }
	});
}

type GalleryRow = NonNullable<Awaited<ReturnType<typeof findGalleryItem>>>;

function emptyTranslations(): GalleryTranslationMap {
	return {
		id: { title: '', caption: '' },
		en: { title: '', caption: '' }
	};
}

function translationMap(row: Pick<GalleryRow, 'translations'>): GalleryTranslationMap {
	const result = emptyTranslations();

	for (const translation of row.translations) {
		result[translation.locale] = {
			title: translation.title,
			caption: translation.caption
		};
	}

	return result;
}

function toAdminView(row: GalleryRow): GalleryItemAdmin {
	return {
		id: row.id,
		imagePath: row.imagePath,
		width: row.width,
		height: row.height,
		status: row.status,
		sortOrder: row.sortOrder,
		updatedAt: row.updatedAt.toISOString(),
		translations: translationMap(row)
	};
}

function inputTranslations(input: GalleryItemFormInput): GalleryTranslationMap {
	return {
		id: { title: input.titleId, caption: input.captionId },
		en: { title: input.titleEn, caption: input.captionEn }
	};
}

function assertPublishable(input: GalleryItemFormInput): void {
	if (input.status !== 'published') return;

	if (!input.titleId.trim()) {
		throw new ValidationError('Judul Indonesia wajib diisi sebelum foto ditayangkan.');
	}
}

function mergeTranslation(
	locale: Locale,
	translations: GalleryTranslationMap
): { title: string; caption: string; fallbackUsed: boolean } {
	const id = translations.id;
	const en = translations.en;

	if (locale === 'id') {
		return { title: id.title.trim(), caption: id.caption.trim(), fallbackUsed: false };
	}

	const title = en.title.trim() || id.title.trim();
	const caption = en.caption.trim() || id.caption.trim();
	const fallbackUsed =
		(id.title.trim() !== '' || id.caption.trim() !== '') &&
		(!en.title.trim() || !en.caption.trim());

	return { title, caption, fallbackUsed };
}

export async function listGalleryItemsForAdmin(): Promise<GalleryItemAdmin[]> {
	const rows = await db.query.galleryItem.findMany({
		with: { translations: true },
		orderBy: [asc(galleryItem.sortOrder), asc(galleryItem.createdAt)]
	});

	return rows.map(toAdminView);
}

export async function getGalleryItemForAdmin(id: string): Promise<GalleryItemAdmin | null> {
	const row = await findGalleryItem(id);

	return row ? toAdminView(row) : null;
}

export async function createGalleryItem(
	input: GalleryItemFormInput,
	image: File | null
): Promise<GalleryItemAdmin> {
	assertPublishable(input);

	if (!image || image.size === 0) {
		throw new ValidationError('Pilih file foto untuk galeri.');
	}

	const saved = await saveGalleryImage(image, randomUUID());

	try {
		const created = await db.transaction(async (tx) => {
			const [row] = await tx
				.insert(galleryItem)
				.values({
					imagePath: saved.publicPath,
					width: saved.width,
					height: saved.height,
					status: input.status,
					sortOrder: input.sortOrder
				})
				.returning();

			if (!row) {
				throw new Error('Gagal membuat foto galeri.');
			}

			const translations = inputTranslations(input);

			await tx.insert(galleryItemTranslation).values(
				locales.map((locale) => ({
					itemId: row.id,
					locale,
					...translations[locale]
				}))
			);

			return row;
		});

		const result = await getGalleryItemForAdmin(created.id);

		if (!result) {
			throw new Error('Foto galeri yang baru dibuat tidak ditemukan.');
		}

		return result;
	} catch (cause) {
		try {
			await deletePanoramaFile(saved.publicPath);
		} catch (cleanupCause) {
			console.error('Failed to clean up gallery image after create error', cleanupCause);
		}

		throw cause;
	}
}

export async function updateGalleryItem(
	id: string,
	input: GalleryItemFormInput,
	image: File | null
): Promise<GalleryItemAdmin> {
	const existing = await findGalleryItem(id);

	if (!existing) {
		throw new NotFoundError('Foto galeri tidak ditemukan.');
	}

	assertPublishable(input);

	const replacement = image && image.size > 0 ? await saveGalleryImage(image, randomUUID()) : null;

	try {
		await db.transaction(async (tx) => {
			const [updated] = await tx
				.update(galleryItem)
				.set({
					imagePath: replacement?.publicPath ?? existing.imagePath,
					width: replacement?.width ?? existing.width,
					height: replacement?.height ?? existing.height,
					status: input.status,
					sortOrder: input.sortOrder,
					updatedAt: new Date()
				})
				.where(eq(galleryItem.id, id))
				.returning();

			if (!updated) {
				throw new NotFoundError('Foto galeri tidak ditemukan.');
			}

			const translations = inputTranslations(input);

			for (const locale of locales) {
				await tx
					.insert(galleryItemTranslation)
					.values({
						itemId: id,
						locale,
						...translations[locale]
					})
					.onConflictDoUpdate({
						target: [galleryItemTranslation.itemId, galleryItemTranslation.locale],
						set: translations[locale]
					});
			}
		});
	} catch (cause) {
		if (replacement) {
			try {
				await deletePanoramaFile(replacement.publicPath);
			} catch (cleanupCause) {
				console.error('Failed to clean up replacement gallery image', cleanupCause);
			}
		}

		throw cause;
	}

	if (replacement) {
		try {
			await deletePanoramaFile(existing.imagePath);
		} catch (cause) {
			console.error('Failed to delete previous gallery image', cause);
		}
	}

	const result = await getGalleryItemForAdmin(id);

	if (!result) {
		throw new NotFoundError('Foto galeri tidak ditemukan.');
	}

	return result;
}

export async function deleteGalleryItem(id: string): Promise<void> {
	const existing = await findGalleryItem(id);

	if (!existing) {
		throw new NotFoundError('Foto galeri tidak ditemukan.');
	}

	await db.delete(galleryItem).where(eq(galleryItem.id, id));

	try {
		await deletePanoramaFile(existing.imagePath);
	} catch (cause) {
		console.error('Failed to delete gallery image file', cause);
	}
}

export async function getPublishedGalleryItems(locale: Locale): Promise<GalleryItemView[]> {
	const rows = await db.query.galleryItem.findMany({
		where: eq(galleryItem.status, 'published'),
		with: { translations: true },
		orderBy: [asc(galleryItem.sortOrder), asc(galleryItem.createdAt)]
	});

	return rows
		.map((row) => {
			const merged = mergeTranslation(locale, translationMap(row));

			return {
				id: row.id,
				imagePath: row.imagePath,
				width: row.width,
				height: row.height,
				...merged
			};
		})
		.filter((item) => item.title !== '');
}
