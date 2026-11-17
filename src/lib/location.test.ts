import { describe, expect, it } from 'vitest';
import {
	TEMPLE_LOCATION,
	googleMapsDirectionsUrl,
	googleMapsEmbedUrl,
	googleMapsPlaceUrl
} from './location.ts';

describe('temple location map', () => {
	it('builds an embed URL for the configured location', () => {
		const url = googleMapsEmbedUrl('id');

		expect(url).toContain('https://www.google.com/maps?');
		expect(url).toContain(`${TEMPLE_LOCATION.latitude},${TEMPLE_LOCATION.longitude}`);
		expect(url).toContain(`z=${TEMPLE_LOCATION.zoom}`);
		expect(url).toContain('hl=id');
		expect(url).toContain('output=embed');
	});

	it('builds place and directions URLs', () => {
		const query = `${TEMPLE_LOCATION.latitude},${TEMPLE_LOCATION.longitude}`;

		expect(googleMapsPlaceUrl()).toBe(`https://www.google.com/maps/search/?api=1&query=${query}`);
		expect(googleMapsDirectionsUrl()).toBe(
			`https://www.google.com/maps/dir/?api=1&destination=${query}`
		);
	});
});
