import type { Locale } from '#lib/i18n/locales.ts';

export type SitePageBlockType = 'section' | 'quote' | 'source';

export interface SitePageBlockTranslation {
	heading: string;
	body: string;
}

export interface SitePageBlockAdmin {
	id: string;
	type: SitePageBlockType;
	sortOrder: number;
	translations: Record<Locale, SitePageBlockTranslation>;
}

export interface SitePageTranslation {
	eyebrow: string;
	title: string;
	description: string;
	verificationNote: string;
}

export interface SitePageAdmin {
	id: string;
	slug: string;
	status: 'draft' | 'published';
	updatedAt: string;
	translations: Record<Locale, SitePageTranslation>;
	blocks: SitePageBlockAdmin[];
}

export interface SitePageDataAdmin {
	slug: string;
	status: 'draft' | 'published';
	updatedAt: string;
	data: Record<Locale, unknown>;
}

export interface SitePageBlockView {
	id: string;
	type: SitePageBlockType;
	heading: string;
	body: string;
}

export interface SitePageView {
	slug: string;
	eyebrow: string;
	title: string;
	description: string;
	verificationNote: string;
	updatedAt: string;
	fallbackUsed: boolean;
	blocks: SitePageBlockView[];
}
