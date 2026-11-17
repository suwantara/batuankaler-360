import type { Locale } from '#lib/i18n/locales.ts';

export interface GalleryTranslationFields {
	title: string;
	caption: string;
}

export type GalleryTranslationMap = Record<Locale, GalleryTranslationFields>;

export interface GalleryItemAdmin {
	id: string;
	imagePath: string;
	width: number;
	height: number;
	status: 'draft' | 'published';
	sortOrder: number;
	updatedAt: string;
	translations: GalleryTranslationMap;
}

export interface GalleryItemView {
	id: string;
	imagePath: string;
	width: number;
	height: number;
	title: string;
	caption: string;
	fallbackUsed: boolean;
}
