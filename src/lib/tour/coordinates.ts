export function degreesToRadians(value: number): number {
	return (value * Math.PI) / 180;
}

export function radiansToDegrees(value: number): number {
	return (value * 180) / Math.PI;
}

export function parseCoordinate(value: string, fallback = 0): number {
	if (value.trim() === '') return fallback;

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatDegrees(value: number, digits = 1): string {
	return value.toFixed(digits);
}
