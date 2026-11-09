import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';

export const locales = ['id', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'id';

export function isLocale(value: string): value is Locale {
	return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
	return locale === 'id' ? 'en' : 'id';
}

export function localeHref(locale: Locale, path = ''): ResolvedPathname {
	return resolve(`${locale}${path}`);
}

export function localizePath(pathname: string, locale: Locale): ResolvedPathname {
	const segments = pathname.split('/');
	const first = segments[1];

	if (first && isLocale(first)) {
		segments[1] = locale;
		return resolve(segments.join('/').replace(/^\//, ''));
	}

	return localeHref(locale, pathname === '/' ? '' : pathname);
}
