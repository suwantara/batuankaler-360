import { describe, expect, it } from 'vitest';
import { scenes, validateScenes, type TourScene } from './scenes';

describe('tour scene data', () => {
	it('has valid scene translations, hotspots, and navigation targets', () => {
		expect(validateScenes(scenes)).toEqual([]);
	});

	it('rejects navigation hotspots with unknown targets', () => {
		const broken: TourScene = {
			...scenes[0],
			hotspots: [
				{
					id: 'broken-navigation',
					type: 'navigation',
					targetSceneId: 'missing-scene',
					yaw: 0,
					pitch: 0,
					translations: {
						id: { label: 'Broken', title: 'Broken', body: 'Broken' },
						en: { label: 'Broken', title: 'Broken', body: 'Broken' }
					}
				}
			]
		};

		expect(validateScenes([broken])).toContain(
			'Unknown target scene for hotspot: broken-navigation'
		);
	});

	it('rejects hotspots outside the valid pitch range', () => {
		const broken: TourScene = {
			...scenes[0],
			hotspots: [
				{
					id: 'broken-pitch',
					type: 'information',
					yaw: 0,
					pitch: 2,
					translations: {
						id: { label: 'Broken', title: 'Broken', body: 'Broken' },
						en: { label: 'Broken', title: 'Broken', body: 'Broken' }
					}
				}
			]
		};

		expect(validateScenes([broken])).toContain('Invalid pitch for hotspot: broken-pitch');
	});
});
