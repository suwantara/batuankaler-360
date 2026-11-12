import { z } from 'zod';
import type { Locale } from '#lib/i18n/locales.ts';
import type { VisitInformationAdmin, VisitInformationFields } from '#lib/types/site-content.ts';

const text = (max: number) =>
	z.string().trim().max(max, `Maksimal ${max} karakter.`).optional().default('');

const optionalUrl = z.preprocess(
	(value) =>
		value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
			? ''
			: value,
	z
		.string()
		.trim()
		.max(2000, 'URL terlalu panjang.')
		.refine(
			(value) => value === '' || /^https?:\/\/\S+$/i.test(value),
			'URL harus diawali http:// atau https://.'
		)
);

export const visitInformationFormSchema = z
	.object({
		status: z.enum(['draft', 'published']),
		managerName: text(200),
		managerUrl: optionalUrl,
		mapUrl: optionalUrl,

		heritageLabelId: text(120),
		locationId: text(500),
		visitingHoursId: text(500),
		accessId: text(1000),
		dressCodeId: text(1000),
		photoPolicyId: text(1000),
		etiquetteId: text(1000),
		contactId: text(500),
		verificationNoteId: text(300),

		heritageLabelEn: text(120),
		locationEn: text(500),
		visitingHoursEn: text(500),
		accessEn: text(1000),
		dressCodeEn: text(1000),
		photoPolicyEn: text(1000),
		etiquetteEn: text(1000),
		contactEn: text(500),
		verificationNoteEn: text(300)
	})
	.superRefine((value, context) => {
		if (value.status !== 'published') return;

		const idFields = [
			value.heritageLabelId,
			value.locationId,
			value.visitingHoursId,
			value.accessId,
			value.dressCodeId,
			value.photoPolicyId,
			value.etiquetteId,
			value.contactId,
			value.verificationNoteId
		];

		if (idFields.every((field) => field.trim() === '')) {
			context.addIssue({
				code: 'custom',
				path: ['form'],
				message: 'Isi minimal satu informasi berbahasa Indonesia sebelum menayangkan konten.'
			});
		}
	});

export type VisitInformationFormInput = z.infer<typeof visitInformationFormSchema>;

export interface VisitInformationFormValues {
	status: 'draft' | 'published';
	managerName: string;
	managerUrl: string;
	mapUrl: string;
	heritageLabelId: string;
	locationId: string;
	visitingHoursId: string;
	accessId: string;
	dressCodeId: string;
	photoPolicyId: string;
	etiquetteId: string;
	contactId: string;
	verificationNoteId: string;
	heritageLabelEn: string;
	locationEn: string;
	visitingHoursEn: string;
	accessEn: string;
	dressCodeEn: string;
	photoPolicyEn: string;
	etiquetteEn: string;
	contactEn: string;
	verificationNoteEn: string;
}

export const emptyVisitInformationFormValues: VisitInformationFormValues = {
	status: 'draft',
	managerName: '',
	managerUrl: '',
	mapUrl: '',
	heritageLabelId: '',
	locationId: '',
	visitingHoursId: '',
	accessId: '',
	dressCodeId: '',
	photoPolicyId: '',
	etiquetteId: '',
	contactId: '',
	verificationNoteId: '',
	heritageLabelEn: '',
	locationEn: '',
	visitingHoursEn: '',
	accessEn: '',
	dressCodeEn: '',
	photoPolicyEn: '',
	etiquetteEn: '',
	contactEn: '',
	verificationNoteEn: ''
};

export function visitInformationFormValuesFromAdmin(
	content: VisitInformationAdmin
): VisitInformationFormValues {
	const id = content.translations.id;
	const en = content.translations.en;

	return {
		status: content.status,
		managerName: content.managerName,
		managerUrl: content.managerUrl,
		mapUrl: content.mapUrl,
		heritageLabelId: id.heritageLabel,
		locationId: id.location,
		visitingHoursId: id.visitingHours,
		accessId: id.access,
		dressCodeId: id.dressCode,
		photoPolicyId: id.photoPolicy,
		etiquetteId: id.etiquette,
		contactId: id.contact,
		verificationNoteId: id.verificationNote,
		heritageLabelEn: en.heritageLabel,
		locationEn: en.location,
		visitingHoursEn: en.visitingHours,
		accessEn: en.access,
		dressCodeEn: en.dressCode,
		photoPolicyEn: en.photoPolicy,
		etiquetteEn: en.etiquette,
		contactEn: en.contact,
		verificationNoteEn: en.verificationNote
	};
}

export function visitInformationFormValuesFromRaw(
	raw: Record<string, string>
): VisitInformationFormValues {
	return {
		status: raw.status === 'published' ? 'published' : 'draft',
		managerName: raw.managerName ?? '',
		managerUrl: raw.managerUrl ?? '',
		mapUrl: raw.mapUrl ?? '',
		heritageLabelId: raw.heritageLabelId ?? '',
		locationId: raw.locationId ?? '',
		visitingHoursId: raw.visitingHoursId ?? '',
		accessId: raw.accessId ?? '',
		dressCodeId: raw.dressCodeId ?? '',
		photoPolicyId: raw.photoPolicyId ?? '',
		etiquetteId: raw.etiquetteId ?? '',
		contactId: raw.contactId ?? '',
		verificationNoteId: raw.verificationNoteId ?? '',
		heritageLabelEn: raw.heritageLabelEn ?? '',
		locationEn: raw.locationEn ?? '',
		visitingHoursEn: raw.visitingHoursEn ?? '',
		accessEn: raw.accessEn ?? '',
		dressCodeEn: raw.dressCodeEn ?? '',
		photoPolicyEn: raw.photoPolicyEn ?? '',
		etiquetteEn: raw.etiquetteEn ?? '',
		contactEn: raw.contactEn ?? '',
		verificationNoteEn: raw.verificationNoteEn ?? ''
	};
}

export function localizedVisitFieldsFromForm(
	values: VisitInformationFormValues,
	locale: Locale
): VisitInformationFields {
	if (locale === 'id') {
		return {
			heritageLabel: values.heritageLabelId,
			location: values.locationId,
			visitingHours: values.visitingHoursId,
			access: values.accessId,
			dressCode: values.dressCodeId,
			photoPolicy: values.photoPolicyId,
			etiquette: values.etiquetteId,
			contact: values.contactId,
			verificationNote: values.verificationNoteId
		};
	}

	return {
		heritageLabel: values.heritageLabelEn,
		location: values.locationEn,
		visitingHours: values.visitingHoursEn,
		access: values.accessEn,
		dressCode: values.dressCodeEn,
		photoPolicy: values.photoPolicyEn,
		etiquette: values.etiquetteEn,
		contact: values.contactEn,
		verificationNote: values.verificationNoteEn
	};
}
