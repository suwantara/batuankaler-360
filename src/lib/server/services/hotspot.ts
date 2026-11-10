import { asc, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { hotspot, hotspotTranslation, scene } from '#lib/server/db/schema.ts';
import { NotFoundError, ValidationError } from '#lib/server/errors.ts';
import { locales, type Locale } from '#lib/i18n/locales.ts';

export interface HotspotTranslationInput {
	label: string;
	title: string;
	description: string;
	externalUrl: string | null;
}

export interface HotspotInput {
	sceneId: string;
	type: 'navigation' | 'information' | 'external';
	targetSceneId: string | null;
	yaw: number;
	pitch: number;
	sortOrder: number;
	isActive: boolean;
	translations: Record<Locale, HotspotTranslationInput>;
}

async function assertScene(id: string): Promise<void> {
	const existing = await db.query.scene.findFirst({
		where: eq(scene.id, id)
	});

	if (!existing) {
		throw new ValidationError('Scene tidak ditemukan.');
	}
}

async function assertTarget(input: HotspotInput): Promise<void> {
	if (input.type === 'navigation' && !input.targetSceneId) {
		throw new ValidationError('Hotspot navigasi wajib memiliki scene tujuan.');
	}

	if (!input.targetSceneId) return;

	if (input.targetSceneId === input.sceneId) {
		throw new ValidationError('Hotspot navigasi tidak boleh menunjuk ke scene yang sama.');
	}

	const target = await db.query.scene.findFirst({
		where: eq(scene.id, input.targetSceneId)
	});

	if (!target) {
		throw new ValidationError('Scene tujuan tidak ditemukan.');
	}
}

export async function listHotspotsForScene(sceneId: string) {
	return db.query.hotspot.findMany({
		where: eq(hotspot.sceneId, sceneId),
		with: {
			translations: true,
			targetScene: {
				with: { translations: true }
			}
		},
		orderBy: [asc(hotspot.sortOrder)]
	});
}

export async function getHotspotForAdmin(id: string) {
	return db.query.hotspot.findFirst({
		where: eq(hotspot.id, id),
		with: {
			translations: true,
			targetScene: {
				with: { translations: true }
			}
		}
	});
}

export async function createHotspot(input: HotspotInput) {
	await assertScene(input.sceneId);
	await assertTarget(input);

	return db.transaction(async (tx) => {
		const [created] = await tx
			.insert(hotspot)
			.values({
				sceneId: input.sceneId,
				targetSceneId: input.targetSceneId,
				type: input.type,
				yaw: input.yaw,
				pitch: input.pitch,
				sortOrder: input.sortOrder,
				isActive: input.isActive
			})
			.returning();

		if (!created) {
			throw new Error('Gagal membuat hotspot.');
		}

		await tx.insert(hotspotTranslation).values(
			locales.map((locale) => ({
				hotspotId: created.id,
				locale,
				label: input.translations[locale].label,
				title: input.translations[locale].title,
				description: input.translations[locale].description,
				externalUrl: input.translations[locale].externalUrl
			}))
		);

		return created;
	});
}

export async function updateHotspot(id: string, input: HotspotInput) {
	const existing = await getHotspotForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Hotspot tidak ditemukan.');
	}

	await assertScene(input.sceneId);
	await assertTarget(input);

	return db.transaction(async (tx) => {
		const [updated] = await tx
			.update(hotspot)
			.set({
				sceneId: input.sceneId,
				targetSceneId: input.targetSceneId,
				type: input.type,
				yaw: input.yaw,
				pitch: input.pitch,
				sortOrder: input.sortOrder,
				isActive: input.isActive,
				updatedAt: new Date()
			})
			.where(eq(hotspot.id, id))
			.returning();

		if (!updated) {
			throw new NotFoundError('Hotspot tidak ditemukan.');
		}

		for (const locale of locales) {
			await tx
				.insert(hotspotTranslation)
				.values({
					hotspotId: id,
					locale,
					label: input.translations[locale].label,
					title: input.translations[locale].title,
					description: input.translations[locale].description,
					externalUrl: input.translations[locale].externalUrl
				})
				.onConflictDoUpdate({
					target: [hotspotTranslation.hotspotId, hotspotTranslation.locale],
					set: {
						label: input.translations[locale].label,
						title: input.translations[locale].title,
						description: input.translations[locale].description,
						externalUrl: input.translations[locale].externalUrl
					}
				});
		}

		return updated;
	});
}

export async function deleteHotspot(id: string) {
	const existing = await getHotspotForAdmin(id);

	if (!existing) {
		throw new NotFoundError('Hotspot tidak ditemukan.');
	}

	await db.delete(hotspot).where(eq(hotspot.id, id));
}
