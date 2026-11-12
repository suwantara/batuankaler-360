export const sitePageRegistry = [
	{
		slug: 'sejarah',
		label: 'Sejarah',
		path: '/sejarah',
		description: 'Sejarah, konteks, dan catatan penting kawasan pura.',
		sortOrder: 0
	}
] as const;

export type SitePageSlug = (typeof sitePageRegistry)[number]['slug'];

export function getSitePageDefinition(slug: string) {
	return sitePageRegistry.find((page) => page.slug === slug) ?? null;
}
