import type { Locale } from '#lib/i18n/locales.ts';
import type { SitePageBlockTranslation, SitePageTranslation } from '#lib/types/site-page.ts';

export function mergeSitePageTranslation(
	locale: Locale,
	translations: Record<Locale, SitePageTranslation>
): { fields: SitePageTranslation; fallbackUsed: boolean } {
	const primary = translations[locale];

	if (locale === 'id') {
		return { fields: { ...primary }, fallbackUsed: false };
	}

	const fallback = translations.id;
	let fallbackUsed = false;

	const fields: SitePageTranslation = {
		eyebrow: primary.eyebrow,
		title: primary.title,
		description: primary.description,
		verificationNote: primary.verificationNote
	};

	for (const key of ['eyebrow', 'title', 'description', 'verificationNote'] as const) {
		if (fields[key].trim() === '' && fallback[key].trim() !== '') {
			fields[key] = fallback[key];
			fallbackUsed = true;
		}
	}

	return { fields, fallbackUsed };
}

export function mergeSitePageBlockTranslation(
	locale: Locale,
	translations: Record<Locale, SitePageBlockTranslation>
): { fields: SitePageBlockTranslation; fallbackUsed: boolean } {
	const primary = translations[locale];

	if (locale === 'id') {
		return { fields: { ...primary }, fallbackUsed: false };
	}

	const fallback = translations.id;
	let fallbackUsed = false;

	const fields: SitePageBlockTranslation = {
		heading: primary.heading,
		body: primary.body
	};

	for (const key of ['heading', 'body'] as const) {
		if (fields[key].trim() === '' && fallback[key].trim() !== '') {
			fields[key] = fallback[key];
			fallbackUsed = true;
		}
	}

	return { fields, fallbackUsed };
}
