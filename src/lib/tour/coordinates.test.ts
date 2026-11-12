import { describe, expect, it } from 'vitest';
import {
	degreesToRadians,
	formatDegrees,
	parseCoordinate,
	radiansToDegrees
} from './coordinates.ts';

describe('pano coordinates', () => {
	it('converts degrees to radians and back', () => {
		for (const degrees of [-180, -90, 0, 45, 90, 180]) {
			expect(radiansToDegrees(degreesToRadians(degrees))).toBeCloseTo(degrees, 10);
		}
	});

	it('parses numeric input and falls back for invalid values', () => {
		expect(parseCoordinate('12.5')).toBe(12.5);
		expect(parseCoordinate('')).toBe(0);
		expect(parseCoordinate('bukan-angka')).toBe(0);
		expect(parseCoordinate('', 90)).toBe(90);
	});

	it('formats degrees with one decimal place', () => {
		expect(formatDegrees(12.345)).toBe('12.3');
		expect(formatDegrees(-0.04)).toBe('-0.0');
	});
});
