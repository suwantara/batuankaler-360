import { locales, type Locale } from '#lib/i18n/index.ts';

export interface SceneTranslation {
	title: string;
	description: string;
}

export interface HotspotText {
	label: string;
	title: string;
	body: string;
}

interface HotspotBase {
	id: string;
	yaw: number;
	pitch: number;
	translations: Record<Locale, HotspotText>;
}

export interface NavigationHotspot extends HotspotBase {
	type: 'navigation';
	targetSceneId: string;
}

export interface InformationHotspot extends HotspotBase {
	type: 'information';
}

export type TourHotspot = NavigationHotspot | InformationHotspot;

export interface TourScene {
	id: string;
	slug: string;
	panorama: {
		src: string;
		thumbnail: string;
		width: number;
	};
	initialView: {
		yaw: number;
		pitch: number;
		fov: number;
	};
	translations: Record<Locale, SceneTranslation>;
	hotspots: TourHotspot[];
}

export const scenes: TourScene[] = [
	{
		id: 'jaba-pura',
		slug: 'jaba-pura',
		panorama: {
			src: '/images/panoramas/scene-jaba.jpg',
			thumbnail: '/images/panoramas/scene-jaba-thumb.jpg',
			width: 4096
		},
		initialView: { yaw: 0, pitch: 0, fov: Math.PI / 2 },
		translations: {
			id: {
				title: 'Jaba Pura',
				description:
					'Area luar kawasan pura yang menjadi titik awal orientasi pengunjung. Di sini pengunjung dapat melihat gapura dan memahami arah kunjungan sebelum memasuki area berikutnya.'
			},
			en: {
				title: 'Jaba Pura',
				description:
					'The outer area of the temple grounds and the starting point for visitor orientation. Here visitors can see the entrance gate and understand the route before entering the next area.'
			}
		},
		hotspots: [
			{
				id: 'jaba-info-gapura',
				type: 'information',
				yaw: -0.35,
				pitch: 0.02,
				translations: {
					id: {
						label: 'Informasi gapura',
						title: 'Gapura masuk',
						body: 'Gapura menjadi penanda peralihan dari ruang luar menuju kawasan pura. Pengunjung diarahkan untuk menjaga ketenangan dan mengikuti aturan pakaian sebelum melanjutkan kunjungan.'
					},
					en: {
						label: 'Gate information',
						title: 'Entrance gate',
						body: 'The gate marks the transition from the outer area into the temple grounds. Visitors are asked to keep a quiet demeanour and follow the dress rules before continuing.'
					}
				}
			},
			{
				id: 'jaba-nav-madya',
				type: 'navigation',
				targetSceneId: 'madya-mandala',
				yaw: 0.3,
				pitch: -0.02,
				translations: {
					id: {
						label: 'Menuju Madya Mandala',
						title: 'Madya Mandala',
						body: 'Berpindah ke area tengah kawasan pura.'
					},
					en: {
						label: 'To Madya Mandala',
						title: 'Madya Mandala',
						body: 'Move to the middle area of the temple grounds.'
					}
				}
			}
		]
	},
	{
		id: 'madya-mandala',
		slug: 'madya-mandala',
		panorama: {
			src: '/images/panoramas/scene-madya.jpg',
			thumbnail: '/images/panoramas/scene-madya-thumb.jpg',
			width: 4096
		},
		initialView: { yaw: 0, pitch: 0, fov: Math.PI / 2 },
		translations: {
			id: {
				title: 'Madya Mandala',
				description:
					'Bagian tengah kawasan yang menghubungkan area luar dengan ruang utama. Area ini menjadi ruang peralihan dan tempat berkumpulnya pengunjung sebelum melanjutkan perjalanan.'
			},
			en: {
				title: 'Madya Mandala',
				description:
					'The middle section connecting the outer area with the main sacred space. It serves as a transition zone and gathering point before visitors continue their journey.'
			}
		},
		hotspots: [
			{
				id: 'madya-nav-jaba',
				type: 'navigation',
				targetSceneId: 'jaba-pura',
				yaw: -0.42,
				pitch: -0.03,
				translations: {
					id: {
						label: 'Kembali ke Jaba Pura',
						title: 'Jaba Pura',
						body: 'Kembali ke area luar kawasan pura.'
					},
					en: {
						label: 'Back to Jaba Pura',
						title: 'Jaba Pura',
						body: 'Return to the outer area of the temple grounds.'
					}
				}
			},
			{
				id: 'madya-nav-utama',
				type: 'navigation',
				targetSceneId: 'utama-mandala',
				yaw: 0.4,
				pitch: -0.02,
				translations: {
					id: {
						label: 'Menuju Utama Mandala',
						title: 'Utama Mandala',
						body: 'Berpindah menuju ruang utama kawasan pura.'
					},
					en: {
						label: 'To Utama Mandala',
						title: 'Utama Mandala',
						body: 'Move towards the main sacred space.'
					}
				}
			},
			{
				id: 'madya-info-pendopo',
				type: 'information',
				yaw: 0.02,
				pitch: 0.08,
				translations: {
					id: {
						label: 'Informasi pendopo',
						title: 'Pendopo tengah',
						body: 'Pendopo merupakan ruang beratap yang digunakan sebagai tempat berkumpul dan beristirahat sejenak. Pengunjung diharapkan menjaga kebersihan dan ketenangan area ini.'
					},
					en: {
						label: 'Hall information',
						title: 'Central hall',
						body: 'The hall is a covered space used for gathering and resting briefly. Visitors are expected to keep the area clean and quiet.'
					}
				}
			}
		]
	},
	{
		id: 'utama-mandala',
		slug: 'utama-mandala',
		panorama: {
			src: '/images/panoramas/scene-utama.jpg',
			thumbnail: '/images/panoramas/scene-utama-thumb.jpg',
			width: 4096
		},
		initialView: { yaw: 0, pitch: 0.03, fov: 1.45 },
		translations: {
			id: {
				title: 'Utama Mandala',
				description:
					'Ruang utama kawasan pura yang memiliki aturan kunjungan lebih ketat. Pengunjung diharapkan menjaga ketenangan, mengikuti arahan pengelola, dan menghormati area yang dibatasi.'
			},
			en: {
				title: 'Utama Mandala',
				description:
					'The main sacred space, which has stricter visiting rules. Visitors are expected to keep a quiet demeanour, follow the management’s directions, and respect restricted areas.'
			}
		},
		hotspots: [
			{
				id: 'utama-nav-madya',
				type: 'navigation',
				targetSceneId: 'madya-mandala',
				yaw: 0,
				pitch: -0.06,
				translations: {
					id: {
						label: 'Kembali ke Madya Mandala',
						title: 'Madya Mandala',
						body: 'Kembali ke area tengah kawasan pura.'
					},
					en: {
						label: 'Back to Madya Mandala',
						title: 'Madya Mandala',
						body: 'Return to the middle area of the temple grounds.'
					}
				}
			},
			{
				id: 'utama-info-pelinggih',
				type: 'information',
				yaw: -0.3,
				pitch: 0.05,
				translations: {
					id: {
						label: 'Informasi pelinggih',
						title: 'Pelinggih utama',
						body: 'Area ini merupakan ruang sakral yang memerlukan perhatian khusus. Pengunjung tidak diperkenankan memasuki bagian dalam pelinggih dan diminta mengikuti arahan pemandu.'
					},
					en: {
						label: 'Shrine information',
						title: 'Main shrine',
						body: 'This is a sacred area that requires particular care. Visitors may not enter the inner shrine and are asked to follow the guide’s directions.'
					}
				}
			},
			{
				id: 'utama-info-arsitektur',
				type: 'information',
				yaw: 0.32,
				pitch: 0.02,
				translations: {
					id: {
						label: 'Informasi arsitektur',
						title: 'Detail arsitektur',
						body: 'Atap bertingkat dan material lokal merupakan bagian dari bahasa arsitektur kawasan. Detail dan makna simbolisnya akan dilengkapi setelah proses verifikasi pengelola.'
					},
					en: {
						label: 'Architecture information',
						title: 'Architectural detail',
						body: 'The tiered roofs and local materials are part of the architectural language of the grounds. Further details and symbolic meanings will be added after management verification.'
					}
				}
			}
		]
	}
];

export function getSceneById(id: string): TourScene | undefined {
	return scenes.find((scene) => scene.id === id);
}

export function getSceneBySlug(slug: string): TourScene | undefined {
	return scenes.find((scene) => scene.slug === slug);
}

export function validateScenes(input: readonly TourScene[]): string[] {
	const errors: string[] = [];
	const ids = new Set<string>();
	const slugs = new Set<string>();

	for (const scene of input) {
		if (ids.has(scene.id)) {
			errors.push(`Duplicate scene id: ${scene.id}`);
		}
		ids.add(scene.id);

		if (slugs.has(scene.slug)) {
			errors.push(`Duplicate scene slug: ${scene.slug}`);
		}
		slugs.add(scene.slug);

		for (const locale of locales) {
			const translation = scene.translations[locale];
			if (!translation?.title || !translation.description) {
				errors.push(`Missing ${locale} translation for scene: ${scene.id}`);
			}
		}

		for (const hotspot of scene.hotspots) {
			if (hotspot.pitch < -Math.PI / 2 || hotspot.pitch > Math.PI / 2) {
				errors.push(`Invalid pitch for hotspot: ${hotspot.id}`);
			}

			if (
				hotspot.type === 'navigation' &&
				!input.some((item) => item.id === hotspot.targetSceneId)
			) {
				errors.push(`Unknown target scene for hotspot: ${hotspot.id}`);
			}

			for (const locale of locales) {
				const text = hotspot.translations[locale];
				if (!text?.label || !text.title || !text.body) {
					errors.push(`Missing ${locale} text for hotspot: ${hotspot.id}`);
				}
			}
		}
	}

	return errors;
}
