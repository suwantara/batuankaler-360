import { randomUUID } from 'node:crypto';
import { imageSize } from 'image-size';
import { StorageError, ValidationError } from '#lib/server/errors.ts';
import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';
import {
	contentTypeForFile,
	deleteObject,
	objectExists,
	putObject,
	resolveUploadedFile
} from './object.ts';

export { contentTypeForFile, resolveUploadedFile };

export type UploadKind = 'original' | 'thumbnail' | 'preview';

const PANORAMA_SUBDIR = 'panoramas';
const ALLOWED_TYPES = new Set(['jpg', 'png', 'webp']);

function maxBytesFor(kind: UploadKind): number {
	switch (kind) {
		case 'original':
			return UPLOAD_LIMITS.original;
		case 'thumbnail':
			return UPLOAD_LIMITS.thumbnail;
		case 'preview':
			return UPLOAD_LIMITS.preview;
	}
}

function sizeLabel(kind: UploadKind): string {
	const bytes = maxBytesFor(kind);
	return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function normalizeType(type: string | undefined): string | null {
	if (!type) return null;
	const normalized = type.toLowerCase() === 'jpeg' ? 'jpg' : type.toLowerCase();
	return ALLOWED_TYPES.has(normalized) ? normalized : null;
}

function extensionFromName(name: string): string | null {
	const extension = name.split('.').pop()?.toLowerCase();
	if (!extension) return null;
	return normalizeType(extension === 'jpeg' ? 'jpg' : extension);
}

function safeBaseName(value: string): string {
	const sanitized = value.replace(/[^a-zA-Z0-9-]/g, '');
	return sanitized || randomUUID();
}

export interface SavedImage {
	publicPath: string;
	absolutePath?: string;
	width: number;
	height: number;
	mimeType: string;
	size: number;
}

export async function savePanoramaImage(
	file: File,
	kind: UploadKind,
	baseName: string
): Promise<SavedImage> {
	if (file.size <= 0) {
		throw new ValidationError('File gambar kosong.');
	}

	if (file.size > maxBytesFor(kind)) {
		throw new ValidationError(`Ukuran file ${kind} melebihi batas ${sizeLabel(kind)}.`);
	}

	const extension = extensionFromName(file.name);
	if (!extension) {
		throw new ValidationError(`Format file ${kind} harus ${ALLOWED_IMAGE_LABEL}.`);
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	let info: ReturnType<typeof imageSize>;

	try {
		info = imageSize(buffer);
	} catch {
		throw new ValidationError(`File ${kind} bukan gambar yang valid.`);
	}

	const detectedType = normalizeType(info.type);
	if (!detectedType) {
		throw new ValidationError(`Format gambar ${kind} tidak didukung.`);
	}

	if (!info.width || !info.height) {
		throw new ValidationError(`Dimensi gambar ${kind} tidak dapat dibaca.`);
	}

	if (kind === 'original') {
		if (info.width < 2000) {
			throw new ValidationError('Panorama asli minimal memiliki lebar 2000 piksel.');
		}

		const ratio = info.width / info.height;
		if (Math.abs(ratio - 2) > 0.08) {
			throw new ValidationError(
				'Panorama asli harus menggunakan proyeksi equirectangular dengan rasio 2:1.'
			);
		}
	}

	const filename = `${safeBaseName(baseName)}-${kind}.${detectedType}`;
	const key = `${PANORAMA_SUBDIR}/${filename}`;

	try {
		const stored = await putObject({
			key,
			body: buffer,
			contentType: contentTypeForFile(filename)
		});

		return {
			publicPath: stored.publicPath,
			absolutePath: stored.absolutePath,
			width: info.width,
			height: info.height,
			mimeType: contentTypeForFile(filename),
			size: stored.size
		};
	} catch (cause) {
		if (cause instanceof StorageError) throw cause;

		throw new StorageError(`Gagal menyimpan file ${kind}.`);
	}
}

export async function deletePanoramaFile(publicFilePath: string): Promise<void> {
	await deleteObject(publicFilePath);
}

export async function uploadedFileExists(publicFilePath: string): Promise<boolean> {
	return objectExists(publicFilePath);
}
