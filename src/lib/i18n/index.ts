import { resolve } from '$app/paths';
import type { ResolvedPathname } from '$app/types';
import { isLocale, type Locale } from './locales';

export { defaultLocale, isLocale, locales, otherLocale, type Locale } from './locales';

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
