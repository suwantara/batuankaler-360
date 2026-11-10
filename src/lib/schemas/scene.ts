import { z } from 'zod';

const optionalUuid = z
	.preprocess(
		(value) => (typeof value === 'string' && value.trim() === '' ? null : value),
		z.uuid().nullable().optional()
	)
	.transform((value) => value ?? null);

const translationTitle = z.string().trim().min(1, 'Judul wajib diisi.').max(200);
const translationDescription = z.string().trim().min(1, 'Deskripsi wajib diisi.').max(5000);

export const sceneFormSchema = z.object({
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
	areaId: optionalUuid,
	panoramaAssetId: optionalUuid,
	initialYaw: z.coerce.number().min(-180).max(180),
	initialPitch: z.coerce.number().min(-90).max(90),
	initialFov: z.coerce.number().min(30).max(100),
	sortOrder: z.coerce.number().int().min(0).max(10000),
	titleId: translationTitle,
	descriptionId: translationDescription,
	titleEn: translationTitle,
	descriptionEn: translationDescription
});

export type SceneFormInput = z.infer<typeof sceneFormSchema>;

export interface SceneFormValues {
	slug: string;
	status: 'draft' | 'published';
	areaId: string;
	panoramaAssetId: string;
	initialYaw: string;
	initialPitch: string;
	initialFov: string;
	sortOrder: string;
	titleId: string;
	descriptionId: string;
	titleEn: string;
	descriptionEn: string;
}

export const emptySceneFormValues: SceneFormValues = {
	slug: '',
	status: 'draft',
	areaId: '',
	panoramaAssetId: '',
	initialYaw: '0',
	initialPitch: '0',
	initialFov: '90',
	sortOrder: '0',
	titleId: '',
	descriptionId: '',
	titleEn: '',
	descriptionEn: ''
};

export const sceneStatusSchema = z.enum(['draft', 'published']);

export const hotspotFormSchema = z
	.object({
		sceneId: z.uuid(),
		type: z.enum(['navigation', 'information', 'external']),
		targetSceneId: optionalUuid,
		yaw: z.coerce.number().min(-180).max(180),
		pitch: z.coerce.number().min(-90).max(90),
		sortOrder: z.coerce.number().int().min(0).max(10000),
		isActive: z.preprocess(
			(value) => value === 'on' || value === 'true' || value === true,
			z.boolean()
		),
		labelId: z.string().trim().min(1, 'Label wajib diisi.').max(200),
		titleId: translationTitle,
		bodyId: translationDescription,
		labelEn: z.string().trim().min(1, 'Label wajib diisi.').max(200),
		titleEn: translationTitle,
		bodyEn: translationDescription,
		externalUrl: z.string().trim().max(2000).optional().default('')
	})
	.superRefine((value, context) => {
		if (value.type === 'navigation' && !value.targetSceneId) {
			context.addIssue({
				code: 'custom',
				path: ['targetSceneId'],
				message: 'Hotspot navigasi wajib memiliki scene tujuan.'
			});
		}
	});

export type HotspotFormInput = z.infer<typeof hotspotFormSchema>;

export interface HotspotFormValues {
	type: 'navigation' | 'information' | 'external';
	targetSceneId: string;
	yaw: string;
	pitch: string;
	sortOrder: string;
	isActive: boolean;
	labelId: string;
	titleId: string;
	bodyId: string;
	labelEn: string;
	titleEn: string;
	bodyEn: string;
	externalUrl: string;
}

export const emptyHotspotFormValues: HotspotFormValues = {
	type: 'information',
	targetSceneId: '',
	yaw: '0',
	pitch: '0',
	sortOrder: '0',
	isActive: true,
	labelId: '',
	titleId: '',
	bodyId: '',
	labelEn: '',
	titleEn: '',
	bodyEn: '',
	externalUrl: ''
};

export const panoramaAssetFormSchema = z.object({
	originalPath: z.string().trim().min(1, 'Path panorama wajib diisi.').max(2000),
	thumbnailPath: z.string().trim().min(1, 'Path thumbnail wajib diisi.').max(2000),
	previewPath: z.string().trim().max(2000).optional().default(''),
	projection: z.string().trim().min(1).max(32).default('equirectangular'),
	width: z.coerce.number().int().min(1).max(20000),
	height: z.preprocess(
		(value) => (value === '' || value == null ? null : value),
		z.coerce.number().int().min(1).max(20000).nullable()
	),
	processingStatus: z.enum(['uploaded', 'processed', 'failed'])
});

export type PanoramaAssetFormInput = z.infer<typeof panoramaAssetFormSchema>;

export interface PanoramaAssetFormValues {
	originalPath: string;
	thumbnailPath: string;
	previewPath: string;
	projection: string;
	width: string;
	height: string;
	processingStatus: 'uploaded' | 'processed' | 'failed';
}

export const emptyPanoramaAssetFormValues: PanoramaAssetFormValues = {
	originalPath: '',
	thumbnailPath: '',
	previewPath: '',
	projection: 'equirectangular',
	width: '4096',
	height: '2048',
	processingStatus: 'processed'
};

export function collectFieldErrors(error: z.ZodError): Record<string, string> {
	const errors: Record<string, string> = {};

	for (const issue of error.issues) {
		const key = issue.path.join('.') || 'form';
		if (!errors[key]) errors[key] = issue.message;
	}

	return errors;
}
