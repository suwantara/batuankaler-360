import type { Locale } from '#lib/i18n/locales.ts';
import type {
	VisitInformationFields,
	VisitInformationTranslationMap
} from '#lib/types/site-content.ts';

export const visitInformationFieldKeys = [
	'heritageLabel',
	'location',
	'visitingHours',
	'access',
	'dressCode',
	'photoPolicy',
	'etiquette',
	'contact',
	'verificationNote'
] as const satisfies readonly (keyof VisitInformationFields)[];

export function hasVisitInformation(fields: VisitInformationFields): boolean {
	return visitInformationFieldKeys.some((key) => fields[key].trim().length > 0);
}

/**
 * Kebijakan fallback konten: `en → id`.
 * Field yang kosong pada locale Inggris diisi dari versi Indonesia.
 */
export function mergeVisitInformationFields(
	locale: Locale,
	translations: VisitInformationTranslationMap
): { fields: VisitInformationFields; fallbackUsed: boolean } {
	const primary = translations[locale];

	if (locale === 'id') {
		return { fields: { ...primary }, fallbackUsed: false };
	}

	const fallback = translations.id;
	const merged = { ...primary };
	let fallbackUsed = false;

	for (const key of visitInformationFieldKeys) {
		if (merged[key].trim() === '' && fallback[key].trim() !== '') {
			merged[key] = fallback[key];
			fallbackUsed = true;
		}
	}

	return { fields: merged, fallbackUsed };
}
