import { z } from 'zod';
import type { AreaAdmin } from '#lib/types/area.ts';

const optionalText = (max: number, message: string) =>
	z.string().trim().max(max, message).optional().default('');

export const areaFormSchema = z
	.object({
		slug: z
			.string()
			.trim()
			.min(1, 'Slug wajib diisi.')
			.max(120)
			.regex(
				/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
				'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.'
			),
		status: z.enum(['draft', 'published']),
		sortOrder: z.coerce.number().int().min(0).max(10000),
		titleId: optionalText(200, 'Judul maksimal 200 karakter.'),
		descriptionId: optionalText(5000, 'Deskripsi maksimal 5000 karakter.'),
		titleEn: optionalText(200, 'Judul maksimal 200 karakter.'),
		descriptionEn: optionalText(5000, 'Deskripsi maksimal 5000 karakter.')
	})
	.superRefine((value, context) => {
		if (value.status !== 'published') return;

		if (!value.titleId.trim()) {
			context.addIssue({
				code: 'custom',
				path: ['titleId'],
				message: 'Judul Indonesia wajib diisi sebelum area ditayangkan.'
			});
		}

		if (!value.descriptionId.trim()) {
			context.addIssue({
				code: 'custom',
				path: ['descriptionId'],
				message: 'Deskripsi Indonesia wajib diisi sebelum area ditayangkan.'
			});
		}
	});

export type AreaFormInput = z.infer<typeof areaFormSchema>;

export interface AreaFormValues {
	slug: string;
	status: 'draft' | 'published';
	sortOrder: string;
	titleId: string;
	descriptionId: string;
	titleEn: string;
	descriptionEn: string;
}

export const emptyAreaFormValues: AreaFormValues = {
	slug: '',
	status: 'draft',
	sortOrder: '0',
	titleId: '',
	descriptionId: '',
	titleEn: '',
	descriptionEn: ''
};

export function areaFormValuesFromAdmin(area: AreaAdmin): AreaFormValues {
	return {
		slug: area.slug,
		status: area.status,
		sortOrder: String(area.sortOrder),
		titleId: area.translations.id.title,
		descriptionId: area.translations.id.description,
		titleEn: area.translations.en.title,
		descriptionEn: area.translations.en.description
	};
}

export function areaFormValuesFromRaw(raw: Record<string, string>): AreaFormValues {
	return {
		slug: raw.slug ?? '',
		status: raw.status === 'published' ? 'published' : 'draft',
		sortOrder: raw.sortOrder ?? '0',
		titleId: raw.titleId ?? '',
		descriptionId: raw.descriptionId ?? '',
		titleEn: raw.titleEn ?? '',
		descriptionEn: raw.descriptionEn ?? ''
	};
}
