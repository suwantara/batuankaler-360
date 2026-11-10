import { asc, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { panoramaAsset, scene } from '#lib/server/db/schema.ts';
import { ConflictError, NotFoundError } from '#lib/server/errors.ts';
import { deletePanoramaFile } from '#lib/server/storage/local.ts';
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

	await db.delete(panoramaAsset).where(eq(panoramaAsset.id, id));

	await Promise.all([
		deletePanoramaFile(asset.originalPath),
		deletePanoramaFile(asset.thumbnailPath),
		asset.previewPath ? deletePanoramaFile(asset.previewPath) : Promise.resolve()
	]);
}
