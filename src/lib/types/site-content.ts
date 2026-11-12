import type { Locale } from '#lib/i18n/locales.ts';

export interface VisitInformationFields {
	heritageLabel: string;
	location: string;
	visitingHours: string;
	access: string;
	dressCode: string;
	photoPolicy: string;
	etiquette: string;
	contact: string;
	verificationNote: string;
}

export type VisitInformationTranslationMap = Record<Locale, VisitInformationFields>;

export interface VisitInformationView extends VisitInformationFields {
	managerName: string;
	managerUrl: string;
	mapUrl: string;
	updatedAt: string;
	fallbackUsed: boolean;
}

export interface VisitInformationAdmin {
	id: string;
	status: 'draft' | 'published';
	managerName: string;
	managerUrl: string;
	mapUrl: string;
	updatedAt: string;
	translations: VisitInformationTranslationMap;
}
