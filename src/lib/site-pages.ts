export type SitePageKind = 'home' | 'article' | 'index' | 'gallery';

export const sitePageRegistry = [
	{
		slug: 'beranda',
		label: 'Beranda',
		path: '/',
		description:
			'Konten utama beranda: hero, pengenalan, tour, sejarah, area, galeri, dan panduan.',
		sortOrder: -1,
		kind: 'home'
	},
	{
		slug: 'sejarah',
		label: 'Sejarah',
		path: '/sejarah',
		description: 'Sejarah, konteks, dan catatan penting kawasan pura.',
		sortOrder: 0,
		kind: 'article'
	},
	{
		slug: 'panduan',
		label: 'Panduan',
		path: '/panduan',
		description: 'Panduan kunjungan, etika, pakaian, dan akses.',
		sortOrder: 1,
		kind: 'article'
	},
	{
		slug: 'area',
		label: 'Area',
		path: '/area',
		description: 'Daftar area dan karakter kawasan pura.',
		sortOrder: 2,
		kind: 'index'
	},
	{
		slug: 'galeri',
		label: 'Galeri',
		path: '/galeri',
		description: 'Dokumentasi visual kawasan pura.',
		sortOrder: 3,
		kind: 'gallery'
	}
] as const satisfies ReadonlyArray<{
	slug: string;
	label: string;
	path: string;
	description: string;
	sortOrder: number;
	kind: SitePageKind;
}>;

export type SitePageSlug = (typeof sitePageRegistry)[number]['slug'];

export function getSitePageDefinition(slug: string) {
	return sitePageRegistry.find((page) => page.slug === slug) ?? null;
}
