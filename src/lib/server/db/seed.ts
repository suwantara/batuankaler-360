import {
	area,
	areaTranslation,
	hotspot,
	hotspotTranslation,
	panoramaAsset,
	scene,
	sceneTranslation
} from './schema.ts';
import { db, closeDb } from './script-db.ts';
import { scenes } from '#lib/tour/scenes.ts';
import { locales } from '#lib/i18n/locales.ts';

const AREA_IDS = [
	'a0000000-0000-4000-8000-000000000001',
	'a0000000-0000-4000-8000-000000000002',
	'a0000000-0000-4000-8000-000000000003'
];

const ASSET_IDS = [
	'b0000000-0000-4000-8000-000000000001',
	'b0000000-0000-4000-8000-000000000002',
	'b0000000-0000-4000-8000-000000000003'
];

const SCENE_IDS = [
	'c0000000-0000-4000-8000-000000000001',
	'c0000000-0000-4000-8000-000000000002',
	'c0000000-0000-4000-8000-000000000003'
];

const HOTSPOT_IDS = [
	'd0000000-0000-4000-8000-000000000001',
	'd0000000-0000-4000-8000-000000000002',
	'd0000000-0000-4000-8000-000000000003',
	'd0000000-0000-4000-8000-000000000004',
	'd0000000-0000-4000-8000-000000000005',
	'd0000000-0000-4000-8000-000000000006',
	'd0000000-0000-4000-8000-000000000007',
	'd0000000-0000-4000-8000-000000000008'
];

async function seed(): Promise<void> {
	const sceneIdByStaticId = new Map(scenes.map((item, index) => [item.id, SCENE_IDS[index]]));
	let hotspotIndex = 0;

	await db.transaction(async (tx) => {
		for (const [index, item] of scenes.entries()) {
			const areaId = AREA_IDS[index];
			const assetId = ASSET_IDS[index];
			const sceneId = SCENE_IDS[index];

			await tx
				.insert(area)
				.values({
					id: areaId,
					slug: item.slug,
					status: 'published',
					sortOrder: index
				})
				.onConflictDoUpdate({
					target: area.id,
					set: {
						slug: item.slug,
						status: 'published',
						sortOrder: index,
						updatedAt: new Date()
					}
				});

			for (const locale of locales) {
				await tx
					.insert(areaTranslation)
					.values({
						areaId,
						locale,
						title: item.translations[locale].title,
						description: item.translations[locale].description
					})
					.onConflictDoUpdate({
						target: [areaTranslation.areaId, areaTranslation.locale],
						set: {
							title: item.translations[locale].title,
							description: item.translations[locale].description
						}
					});
			}

			await tx
				.insert(panoramaAsset)
				.values({
					id: assetId,
					originalPath: item.panorama.src,
					thumbnailPath: item.panorama.thumbnail,
					previewPath: null,
					projection: 'equirectangular',
					width: item.panorama.width,
					height: 2048,
					config: {
						levels: [{ width: item.panorama.width }],
						format: 'jpg'
					},
					processingStatus: 'processed'
				})
				.onConflictDoUpdate({
					target: panoramaAsset.id,
					set: {
						originalPath: item.panorama.src,
						thumbnailPath: item.panorama.thumbnail,
						width: item.panorama.width,
						height: 2048,
						processingStatus: 'processed',
						updatedAt: new Date()
					}
				});

			await tx
				.insert(scene)
				.values({
					id: sceneId,
					slug: item.slug,
					panoramaAssetId: assetId,
					areaId,
					initialYaw: item.initialView.yaw,
					initialPitch: item.initialView.pitch,
					initialFov: item.initialView.fov,
					sortOrder: index,
					status: 'published'
				})
				.onConflictDoUpdate({
					target: scene.id,
					set: {
						slug: item.slug,
						panoramaAssetId: assetId,
						areaId,
						initialYaw: item.initialView.yaw,
						initialPitch: item.initialView.pitch,
						initialFov: item.initialView.fov,
						sortOrder: index,
						status: 'published',
						updatedAt: new Date()
					}
				});

			for (const locale of locales) {
				await tx
					.insert(sceneTranslation)
					.values({
						sceneId,
						locale,
						title: item.translations[locale].title,
						description: item.translations[locale].description
					})
					.onConflictDoUpdate({
						target: [sceneTranslation.sceneId, sceneTranslation.locale],
						set: {
							title: item.translations[locale].title,
							description: item.translations[locale].description
						}
					});
			}
		}

		for (const [index, item] of scenes.entries()) {
			const sceneId = SCENE_IDS[index];

			for (const [itemIndex, itemHotspot] of item.hotspots.entries()) {
				const hotspotId = HOTSPOT_IDS[hotspotIndex];
				if (!hotspotId) {
					throw new Error('Jumlah hotspot melebihi daftar ID seed.');
				}

				const targetSceneId =
					itemHotspot.type === 'navigation'
						? (sceneIdByStaticId.get(itemHotspot.targetSceneId) ?? null)
						: null;

				await tx
					.insert(hotspot)
					.values({
						id: hotspotId,
						sceneId,
						targetSceneId,
						type: itemHotspot.type,
						yaw: itemHotspot.yaw,
						pitch: itemHotspot.pitch,
						sortOrder: itemIndex,
						isActive: true
					})
					.onConflictDoUpdate({
						target: hotspot.id,
						set: {
							sceneId,
							targetSceneId,
							type: itemHotspot.type,
							yaw: itemHotspot.yaw,
							pitch: itemHotspot.pitch,
							sortOrder: itemIndex,
							isActive: true,
							updatedAt: new Date()
						}
					});

				for (const locale of locales) {
					const text = itemHotspot.translations[locale];

					await tx
						.insert(hotspotTranslation)
						.values({
							hotspotId,
							locale,
							label: text.label,
							title: text.title,
							description: text.body,
							externalUrl: null
						})
						.onConflictDoUpdate({
							target: [hotspotTranslation.hotspotId, hotspotTranslation.locale],
							set: {
								label: text.label,
								title: text.title,
								description: text.body,
								externalUrl: null
							}
						});
				}

				hotspotIndex += 1;
			}
		}
	});

	console.log(`Seed selesai: ${scenes.length} scene dan ${hotspotIndex} hotspot.`);
}

seed()
	.catch((error) => {
		console.error('Seed gagal:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await closeDb();
	});
