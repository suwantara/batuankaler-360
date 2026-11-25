import { z } from 'zod';
import type { GalleryItemAdmin } from '#lib/types/gallery.ts';

const optionalText = (max: number, message: string) =>
	z.string().trim().max(max, message).optional().default('');

export const galleryItemFormSchema = z
	.object({
		status: z.enum(['draft', 'published']),
		sortOrder: z.coerce.number().int().min(0).max(10000),
		titleId: optionalText(200, 'Judul maksimal 200 karakter.'),
		captionId: optionalText(1000, 'Keterangan maksimal 1000 karakter.'),
		titleEn: optionalText(200, 'Judul maksimal 200 karakter.'),
		captionEn: optionalText(1000, 'Keterangan maksimal 1000 karakter.')
	})
	.superRefine((value, context) => {
		if (value.status !== 'published') return;

		if (!value.titleId.trim()) {
			context.addIssue({
				code: 'custom',
				path: ['titleId'],
				message: 'Judul Indonesia wajib diisi sebelum foto ditayangkan.'
			});
		}
	});

export type GalleryItemFormInput = z.infer<typeof galleryItemFormSchema>;

export interface GalleryItemFormValues {
	status: 'draft' | 'published';
	sortOrder: string;
	titleId: string;
	captionId: string;
	titleEn: string;
	captionEn: string;
}

export const emptyGalleryItemFormValues: GalleryItemFormValues = {
	status: 'draft',
	sortOrder: '0',
	titleId: '',
	captionId: '',
	titleEn: '',
	captionEn: ''
};

export function galleryItemFormValuesFromAdmin(item: GalleryItemAdmin): GalleryItemFormValues {
	return {
		status: item.status,
		sortOrder: String(item.sortOrder),
		titleId: item.translations.id.title,
		captionId: item.translations.id.caption,
		titleEn: item.translations.en.title,
		captionEn: item.translations.en.caption
	};
}

export function galleryItemFormValuesFromRaw(raw: Record<string, string>): GalleryItemFormValues {
	return {
		status: raw.status === 'published' ? 'published' : 'draft',
		sortOrder: raw.sortOrder ?? '0',
		titleId: raw.titleId ?? '',
		captionId: raw.captionId ?? '',
		titleEn: raw.titleEn ?? '',
		captionEn: raw.captionEn ?? ''
	};
}

export const galleryBulkPublishSchema = z.object({
	itemIds: z.array(z.uuid()).min(1, 'Pilih minimal satu foto.')
});

export type GalleryBulkPublishInput = z.infer<typeof galleryBulkPublishSchema>;
