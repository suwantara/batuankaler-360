import { describe, expect, it } from 'vitest';
import { hasVisitInformation, mergeVisitInformationFields } from './site-content.ts';
import {
	emptyVisitInformationFormValues,
	visitInformationFormSchema
} from './schemas/site-content.ts';
import type { VisitInformationFields } from './types/site-content.ts';

const emptyFields: VisitInformationFields = {
	heritageLabel: '',
	location: '',
	visitingHours: '',
	access: '',
	dressCode: '',
	photoPolicy: '',
	etiquette: '',
	contact: '',
	verificationNote: ''
};

function fields(overrides: Partial<VisitInformationFields> = {}): VisitInformationFields {
	return { ...emptyFields, ...overrides };
}

describe('visit information content', () => {
	it('falls back from EN to ID when English fields are empty', () => {
		const result = mergeVisitInformationFields('en', {
			id: fields({ location: 'Batuan', visitingHours: '07.00–17.00 WITA' }),
			en: fields({ location: 'Batuan' })
		});

		expect(result.fields.location).toBe('Batuan');
		expect(result.fields.visitingHours).toBe('07.00–17.00 WITA');
		expect(result.fallbackUsed).toBe(true);
	});

	it('does not mark fallback when English content is complete', () => {
		const result = mergeVisitInformationFields('en', {
			id: fields({ location: 'Batuan' }),
			en: fields({ location: 'Batuan Village' })
		});

		expect(result.fields.location).toBe('Batuan Village');
		expect(result.fallbackUsed).toBe(false);
	});

	it('does not fall back from ID to EN', () => {
		const result = mergeVisitInformationFields('id', {
			id: fields(),
			en: fields({ location: 'Batuan Village' })
		});

		expect(result.fields.location).toBe('');
		expect(result.fallbackUsed).toBe(false);
	});

	it('detects whether any visit information is present', () => {
		expect(hasVisitInformation(fields())).toBe(false);
		expect(hasVisitInformation(fields({ contact: 'pengelola@example.com' }))).toBe(true);
	});

	it('rejects a published visit information block without Indonesian fields', () => {
		const result = visitInformationFormSchema.safeParse({
			...emptyVisitInformationFormValues,
			status: 'published',
			locationEn: 'Batuan Village'
		});

		expect(result.success).toBe(false);
	});

	it('allows an empty draft', () => {
		const result = visitInformationFormSchema.safeParse({
			...emptyVisitInformationFormValues,
			status: 'draft'
		});

		expect(result.success).toBe(true);
	});

	it('rejects an invalid management URL', () => {
		const result = visitInformationFormSchema.safeParse({
			...emptyVisitInformationFormValues,
			status: 'draft',
			managerUrl: 'bukan-url'
		});

		expect(result.success).toBe(false);
	});
});
