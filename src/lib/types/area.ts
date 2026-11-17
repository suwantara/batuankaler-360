import type { Locale } from '#lib/i18n/locales.ts';

export interface AreaTranslationFields {
	title: string;
	description: string;
}

export type AreaTranslationMap = Record<Locale, AreaTranslationFields>;

export interface AreaAdmin {
	id: string;
	slug: string;
	status: 'draft' | 'published';
	sortOrder: number;
	updatedAt: string;
	translations: AreaTranslationMap;
	sceneCount: number;
}

export interface AreaListItem {
	id: string;
	slug: string;
	title: string;
	description: string;
	fallbackUsed: boolean;
}

export interface AreaSceneItem {
	id: string;
	slug: string;
	title: string;
	description: string;
	thumbnail: string;
}

export interface AreaDetailView extends AreaListItem {
	updatedAt: string;
	scenes: AreaSceneItem[];
}
