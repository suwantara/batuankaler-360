import { and, asc, count, eq, ne } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { area, hotspot, panoramaAsset, scene, sceneTranslation } from '#lib/server/db/schema.ts';
import { ConflictError, NotFoundError, ValidationError } from '#lib/server/errors.ts';
import { uploadedFileExists } from '#lib/server/storage/local.ts';
import { locales, type Locale } from '#lib/i18n/locales.ts';

export interface SceneTranslationInput {
	title: string;
	description: string;
}

export interface SceneInput {
	slug: string;
	status: 'draft' | 'published';
	areaId: string | null;
	panoramaAssetId: string | null;
	initialYaw: number;
	initialPitch: number;
	initialFov: number;
	sortOrder: number;
	translations: Record<Locale, SceneTranslationInput>;
}

export function degreesToRadians(value: number): number {
	return (value * Math.PI) / 180;
}

export function radiansToDegrees(value: number): number {
	return (value * 180) / Math.PI;
}

async function assertSlugAvailable(slug: string, excludeId?: string): Promise<void> {
	const where = excludeId
		? and(eq(scene.slug, slug), ne(scene.id, excludeId))
		: eq(scene.slug, slug);
	const existing = await db.query.scene.findFirst({ where });

	if (existing) {
		throw new ConflictError('Slug scene sudah digunakan.');
	}
}

async function assertReferences(input: SceneInput): Promise<void> {
	if (input.status === 'published' && !input.panoramaAssetId) {
		throw new ValidationError('Scene yang dipublikasikan wajib memiliki aset panorama.');
	}

	if (input.panoramaAssetId) {
		const asset = await db.query.panoramaAsset.findFirst({
			where: eq(panoramaAsset.id, input.panoramaAssetId)
		});

		if (!asset) {
			throw new ValidationError('Aset panorama tidak ditemukan.');
		}

		if (input.status === 'published' && asset.processingStatus !== 'processed') {
			throw new ValidationError(
				'Aset panorama harus berstatus processed sebelum scene dipublikasikan.'
			);
		}
	}

	if (input.areaId) {
		const relatedArea = await db.query.area.findFirst({
			where: eq(area.id, input.areaId)
		});

		if (!relatedArea) {
			throw new ValidationError('Area tidak ditemukan.');
		}
	}
}

export async function listScenesForAdmin() {
	return db.query.scene.findMany({
		with: {
			translations: true,
			panoramaAsset: true,
			hotspots: true,
			area: {
				with: { translations: true }
			}
		},
		orderBy: [asc(scene.sortOrder), asc(scene.slug)]
	});
}

export async function getSceneForAdmin(id: string) {
	return db.query.scene.findFirst({
		where: eq(scene.id, id),
		with: {
			translations: true,
			panoramaAsset: true,
			area: {
				with: { translations: true }
			},
			hotspots: {
				with: {
					translations: true,
					targetScene: {
						with: { translations: true }
					}
				},
				orderBy: [asc(hotspot.sortOrder)]
			}
		}
	});
}

export async function listAreas() {
	return db.query.area.findMany({
		with: { translations: true },
		orderBy: [asc(area.sortOrder), asc(area.slug)]
	});
}

export async function createScene(input: SceneInput) {
	await assertSlugAvailable(input.slug);
	await assertReferences(input);

	return db.transaction(async (tx) => {
		const [created] = await tx
			.insert(scene)
			.values({
				slug: input.slug,
				status: input.status,
				areaId: input.areaId,
				panoramaAssetId: input.panoramaAssetId,
				initialYaw: input.initialYaw,
				initialPitch: input.initialPitch,
				initialFov: input.initialFov,
				sortOrder: input.sortOrder
			})
			.returning();

		if (!created) {
			throw new Error('Gagal membuat scene.');
		}

		await tx.insert(sceneTranslation).values(
			locales.map((locale) => ({
				sceneId: created.id,
				locale,
				title: input.translations[locale].title,
				description: input.translations[locale].description
			}))
		);

		return created;
	});
}

export async function updateScene(id: string, input: SceneInput) {
	const existing = await getSceneForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Scene tidak ditemukan.');
	}

	await assertSlugAvailable(input.slug, id);
	await assertReferences(input);

	return db.transaction(async (tx) => {
		const [updated] = await tx
			.update(scene)
			.set({
				slug: input.slug,
				status: input.status,
				areaId: input.areaId,
				panoramaAssetId: input.panoramaAssetId,
				initialYaw: input.initialYaw,
				initialPitch: input.initialPitch,
				initialFov: input.initialFov,
				sortOrder: input.sortOrder,
				updatedAt: new Date()
			})
			.where(eq(scene.id, id))
			.returning();

		if (!updated) {
			throw new NotFoundError('Scene tidak ditemukan.');
		}

		for (const locale of locales) {
			await tx
				.insert(sceneTranslation)
				.values({
					sceneId: id,
					locale,
					title: input.translations[locale].title,
					description: input.translations[locale].description
				})
				.onConflictDoUpdate({
					target: [sceneTranslation.sceneId, sceneTranslation.locale],
					set: {
						title: input.translations[locale].title,
						description: input.translations[locale].description
					}
				});
		}

		return updated;
	});
}

export async function validateSceneForPublish(id: string): Promise<string[]> {
	const existing = await getSceneForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Scene tidak ditemukan.');
	}

	const errors: string[] = [];

	if (!existing.panoramaAsset) {
		errors.push('Scene wajib memiliki aset panorama.');
	} else if (existing.panoramaAsset.processingStatus !== 'processed') {
		errors.push('Aset panorama harus berstatus processed sebelum scene dipublikasikan.');
	} else {
		const [originalExists, thumbnailExists] = await Promise.all([
			uploadedFileExists(existing.panoramaAsset.originalPath),
			uploadedFileExists(existing.panoramaAsset.thumbnailPath)
		]);

		if (!originalExists) {
			errors.push('File panorama asli tidak ditemukan di storage.');
		}

		if (!thumbnailExists) {
			errors.push('File thumbnail panorama tidak ditemukan di storage.');
		}
	}

	for (const locale of locales) {
		const translation = existing.translations.find((item) => item.locale === locale);
		if (!translation?.title.trim() || !translation.description.trim()) {
			errors.push(`Terjemahan ${locale} wajib memiliki judul dan deskripsi.`);
		}
	}

	for (const item of existing.hotspots) {
		if (item.type === 'navigation') {
			if (!item.targetSceneId) {
				errors.push(`Hotspot ${item.id} bertipe navigasi tanpa scene tujuan.`);
			} else if (!item.targetScene) {
				errors.push(`Scene tujuan hotspot ${item.id} tidak ditemukan.`);
			} else if (item.targetSceneId === existing.id) {
				errors.push(`Hotspot ${item.id} tidak boleh menunjuk ke scene yang sama.`);
			}
		}

		for (const locale of locales) {
			const text = item.translations.find((translation) => translation.locale === locale);
			if (!text?.label.trim() || !text.title.trim() || !text.description.trim()) {
				errors.push(`Hotspot ${item.id} belum lengkap untuk locale ${locale}.`);
			}
		}
	}

	return errors;
}

export async function setSceneStatus(id: string, status: 'draft' | 'published') {
	const existing = await getSceneForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Scene tidak ditemukan.');
	}

	if (status === 'published') {
		const validationErrors = await validateSceneForPublish(id);

		if (validationErrors.length > 0) {
			throw new ValidationError(validationErrors.join(' '));
		}
	}

	const [updated] = await db
		.update(scene)
		.set({ status, updatedAt: new Date() })
		.where(eq(scene.id, id))
		.returning();

	if (!updated) {
		throw new NotFoundError('Scene tidak ditemukan.');
	}

	return updated;
}

export async function deleteScene(id: string) {
	const existing = await getSceneForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Scene tidak ditemukan.');
	}

	const targets = await db
		.select({ id: hotspot.id })
		.from(hotspot)
		.where(eq(hotspot.targetSceneId, id));

	if (targets.length > 0) {
		throw new ConflictError(
			`Scene tidak dapat dihapus karena masih menjadi tujuan ${targets.length} hotspot.`
		);
	}

	await db.delete(scene).where(eq(scene.id, id));
}

export async function getDashboardCounts() {
	const [sceneCount] = await db.select({ value: count() }).from(scene);
	const [publishedCount] = await db
		.select({ value: count() })
		.from(scene)
		.where(eq(scene.status, 'published'));
	const [hotspotCount] = await db.select({ value: count() }).from(hotspot);
	const [assetCount] = await db.select({ value: count() }).from(panoramaAsset);

	return {
		scenes: Number(sceneCount?.value ?? 0),
		published: Number(publishedCount?.value ?? 0),
		hotspots: Number(hotspotCount?.value ?? 0),
		assets: Number(assetCount?.value ?? 0)
	};
}
