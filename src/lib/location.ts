import type { Locale } from '#lib/i18n/locales.ts';

export interface TempleLocation {
	latitude: number;
	longitude: number;
	zoom: number;
}

export const TEMPLE_LOCATION: TempleLocation = {
	latitude: -8.5684,
	longitude: 115.2794,
	zoom: 17
};

function coordinateQuery(location: TempleLocation): string {
	return `${location.latitude},${location.longitude}`;
}

export function googleMapsEmbedUrl(locale: Locale, location = TEMPLE_LOCATION): string {
	return `https://www.google.com/maps?q=${coordinateQuery(location)}&z=${location.zoom}&hl=${locale}&output=embed`;
}

export function googleMapsPlaceUrl(location = TEMPLE_LOCATION): string {
	return `https://www.google.com/maps/search/?api=1&query=${coordinateQuery(location)}`;
}

export function googleMapsDirectionsUrl(location = TEMPLE_LOCATION): string {
	return `https://www.google.com/maps/dir/?api=1&destination=${coordinateQuery(location)}`;
}
