import { asc, eq } from 'drizzle-orm';
import { db } from '#lib/server/db/index.ts';
import { hotspot, scene } from '#lib/server/db/schema.ts';
import type { Locale } from '#lib/i18n/locales.ts';
import type {
	HotspotText,
	InformationHotspot,
	NavigationHotspot,
	SceneTranslation,
	TourHotspot,
	TourScene
} from '#lib/tour/scenes.ts';

function mapSceneTranslations(
	rows: readonly { locale: Locale; title: string; description: string }[]
): Record<Locale, SceneTranslation> | null {
	const id = rows.find((row) => row.locale === 'id');
	const en = rows.find((row) => row.locale === 'en');

	if (!id || !en) return null;

	return {
		id: { title: id.title, description: id.description },
		en: { title: en.title, description: en.description }
	};
}

function mapHotspotTexts(
	rows: readonly { locale: Locale; label: string; title: string; description: string }[]
): Record<Locale, HotspotText> | null {
	const id = rows.find((row) => row.locale === 'id');
	const en = rows.find((row) => row.locale === 'en');

	if (!id || !en) return null;

	return {
		id: { label: id.label, title: id.title, body: id.description },
		en: { label: en.label, title: en.title, body: en.description }
	};
}

export async function getPublishedTourScenes(): Promise<TourScene[]> {
	const rows = await db.query.scene.findMany({
		where: eq(scene.status, 'published'),
		with: {
			translations: true,
			panoramaAsset: true,
			hotspots: {
				where: eq(hotspot.isActive, true),
				with: {
					translations: true,
					targetScene: {
						with: { translations: true }
					}
				},
				orderBy: [asc(hotspot.sortOrder)]
			}
		},
		orderBy: [asc(scene.sortOrder), asc(scene.slug)]
	});

	const result: TourScene[] = [];

	for (const row of rows) {
		if (!row.panoramaAsset) continue;

		const translations = mapSceneTranslations(row.translations);
		if (!translations) continue;

		const hotspots: TourHotspot[] = [];

		for (const item of row.hotspots) {
			if (item.type === 'external') continue;

			const texts = mapHotspotTexts(item.translations);
			if (!texts) continue;

			if (item.type === 'navigation') {
				if (!item.targetSceneId || item.targetScene?.status !== 'published') continue;

				const navigationHotspot: NavigationHotspot = {
					id: item.id,
					type: 'navigation',
					yaw: item.yaw,
					pitch: item.pitch,
					targetSceneId: item.targetSceneId,
					translations: texts
				};

				hotspots.push(navigationHotspot);
			} else {
				const informationHotspot: InformationHotspot = {
					id: item.id,
					type: 'information',
					yaw: item.yaw,
					pitch: item.pitch,
					translations: texts
				};

				hotspots.push(informationHotspot);
			}
		}

		result.push({
			id: row.id,
			slug: row.slug,
			panorama: {
				src: row.panoramaAsset.originalPath,
				thumbnail: row.panoramaAsset.thumbnailPath,
				width: row.panoramaAsset.width
			},
			initialView: {
				yaw: row.initialYaw,
				pitch: row.initialPitch,
				fov: row.initialFov
			},
			translations,
			hotspots
		});
	}

	return result;
}

export async function getPublishedSceneBySlug(slug: string): Promise<TourScene | undefined> {
	const scenes = await getPublishedTourScenes();
	return scenes.find((item) => item.slug === slug);
}
