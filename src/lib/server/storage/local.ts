import { randomUUID } from 'node:crypto';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { imageSize } from 'image-size';
import { StorageError, ValidationError } from '#lib/server/errors.ts';
import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';

export type UploadKind = 'original' | 'thumbnail' | 'preview';

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');
const PANORAMA_SUBDIR = 'panoramas';
const PUBLIC_PREFIX = '/uploads/panoramas';
const ALLOWED_TYPES = new Set(['jpg', 'png', 'webp']);
const MIME_BY_TYPE: Record<string, string> = {
	jpg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp'
};

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

function publicPathFor(filename: string): string {
	return `${PUBLIC_PREFIX}/${filename}`;
}

function safeBaseName(value: string): string {
	const sanitized = value.replace(/[^a-zA-Z0-9-]/g, '');
	return sanitized || randomUUID();
}

async function ensurePanoramaDir(): Promise<void> {
	await mkdir(path.join(UPLOAD_ROOT, PANORAMA_SUBDIR), { recursive: true });
}

export interface SavedImage {
	publicPath: string;
	absolutePath: string;
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

	await ensurePanoramaDir();

	const filename = `${safeBaseName(baseName)}-${kind}.${detectedType}`;
	const absolutePath = path.join(UPLOAD_ROOT, PANORAMA_SUBDIR, filename);

	try {
		await writeFile(absolutePath, buffer, { flag: 'wx' });
	} catch {
		throw new StorageError(`Gagal menyimpan file ${kind}.`);
	}

	return {
		publicPath: publicPathFor(filename),
		absolutePath,
		width: info.width,
		height: info.height,
		mimeType: MIME_BY_TYPE[detectedType] ?? 'application/octet-stream',
		size: buffer.length
	};
}

export async function deletePanoramaFile(publicFilePath: string): Promise<void> {
	if (!publicFilePath.startsWith(`${PUBLIC_PREFIX}/`)) return;

	const filename = publicFilePath.slice(PUBLIC_PREFIX.length + 1);
	if (!filename || filename.includes('/') || filename.includes('..')) return;

	try {
		await unlink(path.join(UPLOAD_ROOT, PANORAMA_SUBDIR, filename));
	} catch (cause) {
		const code = (cause as NodeJS.ErrnoException).code;
		if (code !== 'ENOENT') {
			console.error('Failed to delete panorama file', cause);
		}
	}
}

export async function uploadedFileExists(publicFilePath: string): Promise<boolean> {
	if (!publicFilePath.startsWith(`${PUBLIC_PREFIX}/`)) {
		return true;
	}

	const filename = publicFilePath.slice(PUBLIC_PREFIX.length + 1);
	if (!filename || filename.includes('/') || filename.includes('..')) {
		return false;
	}

	try {
		const info = await stat(path.join(UPLOAD_ROOT, PANORAMA_SUBDIR, filename));
		return info.isFile();
	} catch {
		return false;
	}
}

export function resolveUploadedFile(relativePath: string): string | null {
	if (!/^panoramas\/[a-zA-Z0-9._-]+$/.test(relativePath)) {
		return null;
	}

	const absolutePath = path.resolve(UPLOAD_ROOT, relativePath);
	const root = path.resolve(UPLOAD_ROOT);

	if (!absolutePath.startsWith(`${root}${path.sep}`)) {
		return null;
	}

	const extension = relativePath.split('.').pop()?.toLowerCase();
	if (!extension || !normalizeType(extension === 'jpeg' ? 'jpg' : extension)) {
		return null;
	}

	return absolutePath;
}

export function contentTypeForFile(filename: string): string {
	const extension = filename.split('.').pop()?.toLowerCase();
	if (!extension) return 'application/octet-stream';
	return (
		MIME_BY_TYPE[normalizeType(extension === 'jpeg' ? 'jpg' : extension) ?? ''] ??
		'application/octet-stream'
	);
}
