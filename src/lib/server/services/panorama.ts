import { randomUUID } from 'node:crypto';
import { asc, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { panoramaAsset, scene, sitePage } from '#lib/server/db/schema.ts';
import { ConflictError, NotFoundError } from '#lib/server/errors.ts';
import { deletePanoramaFile, savePanoramaImage } from '#lib/server/storage/index.ts';
import { parseHomeShared } from '#lib/schemas/home-content.ts';
import type { PanoramaConfig } from '#lib/types/panorama.ts';

export interface PanoramaAssetInput {
	originalPath: string;
	thumbnailPath: string;
	previewPath: string | null;
	projection: string;
	width: number;
	height: number | null;
	processingStatus: 'uploaded' | 'processed' | 'failed';
	config?: PanoramaConfig | null;
}

export async function listPanoramaAssets() {
	return db.query.panoramaAsset.findMany({
		orderBy: [asc(panoramaAsset.createdAt)]
	});
}

export async function getPanoramaAsset(id: string) {
	return db.query.panoramaAsset.findFirst({
		where: eq(panoramaAsset.id, id)
	});
}

export async function createPanoramaAsset(input: PanoramaAssetInput) {
	const [created] = await db
		.insert(panoramaAsset)
		.values({
			originalPath: input.originalPath,
			thumbnailPath: input.thumbnailPath,
			previewPath: input.previewPath,
			projection: input.projection,
			width: input.width,
			height: input.height,
			processingStatus: input.processingStatus,
			config: input.config ?? null
		})
		.returning();

	if (!created) {
		throw new Error('Gagal membuat aset panorama.');
	}

	return created;
}

export async function requirePanoramaAsset(id: string) {
	const asset = await getPanoramaAsset(id);

	if (!asset) {
		throw new NotFoundError('Aset panorama tidak ditemukan.');
	}

	return asset;
}

type PanoramaAsset = typeof panoramaAsset.$inferSelect;

export async function updatePanoramaThumbnail(id: string, file: File): Promise<PanoramaAsset> {
	const asset = await requirePanoramaAsset(id);
	const saved = await savePanoramaImage(file, 'thumbnail', randomUUID());

	try {
		const [updated] = await db
			.update(panoramaAsset)
			.set({ thumbnailPath: saved.publicPath, updatedAt: new Date() })
			.where(eq(panoramaAsset.id, id))
			.returning();

		if (!updated) {
			throw new NotFoundError('Aset panorama tidak ditemukan.');
		}

		if (asset.thumbnailPath !== saved.publicPath) {
			try {
				await deletePanoramaFile(asset.thumbnailPath);
			} catch (cause) {
				console.error('Failed to delete previous panorama thumbnail', cause);
			}
		}

		return updated;
	} catch (cause) {
		try {
			await deletePanoramaFile(saved.publicPath);
		} catch (cleanupCause) {
			console.error('Failed to clean up replacement panorama thumbnail', cleanupCause);
		}

		throw cause;
	}
}

export async function deletePanoramaAsset(id: string) {
	const asset = await getPanoramaAsset(id);

	if (!asset) {
		throw new NotFoundError('Aset panorama tidak ditemukan.');
	}

	const referencing = await db
		.select({ id: scene.id })
		.from(scene)
		.where(eq(scene.panoramaAssetId, id))
		.limit(1);

	if (referencing.length > 0) {
		throw new ConflictError('Aset panorama masih digunakan oleh scene.');
	}

	const pages = await db.select({ data: sitePage.data }).from(sitePage);
	const usedByHome = pages.some((page) => {
		const media = parseHomeShared(page.data);

		return media.heroAssetId === id || media.previewAssetId === id;
	});

	if (usedByHome) {
		throw new ConflictError('Aset panorama masih digunakan oleh halaman beranda.');
	}

	await db.delete(panoramaAsset).where(eq(panoramaAsset.id, id));

	await Promise.all([
		deletePanoramaFile(asset.originalPath),
		deletePanoramaFile(asset.thumbnailPath),
		asset.previewPath ? deletePanoramaFile(asset.previewPath) : Promise.resolve()
	]);
}
