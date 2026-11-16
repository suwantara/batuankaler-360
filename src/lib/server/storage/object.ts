import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AwsClient } from 'aws4fetch';
import { StorageError } from '#lib/server/errors.ts';

export interface PutObjectInput {
	key: string;
	body: Buffer;
	contentType: string;
	cacheControl?: string;
}

export interface StoredObject {
	publicPath: string;
	size: number;
	absolutePath?: string;
}

interface S3Config {
	endpoint: string;
	region: string;
	bucket: string;
	accessKeyId: string;
	secretAccessKey: string;
	sessionToken?: string;
	publicUrl: string;
	forcePathStyle: boolean;
}

const UPLOAD_ROOT = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');
const LOCAL_PREFIX = '/uploads';
const SAFE_KEY = /^[a-zA-Z0-9][a-zA-Z0-9/_-]*\.[a-zA-Z0-9]+$/;
const MIME_BY_EXTENSION: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	gif: 'image/gif',
	avif: 'image/avif',
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	ogg: 'audio/ogg',
	m4a: 'audio/mp4',
	mp4: 'video/mp4',
	webm: 'video/webm',
	pdf: 'application/pdf'
};

function env(name: string): string | undefined {
	const value = process.env[name]?.trim();
	return value ? value : undefined;
}

function storageDriver(): 'local' | 's3' {
	const driver = env('STORAGE_DRIVER')?.toLowerCase() ?? 'local';

	if (driver !== 'local' && driver !== 's3') {
		throw new StorageError('STORAGE_DRIVER harus bernilai "local" atau "s3".');
	}

	return driver;
}

function requireEnv(name: string): string {
	const value = env(name);

	if (!value) {
		throw new StorageError(`Konfigurasi object storage belum lengkap: ${name} wajib diisi.`);
	}

	return value;
}

function s3Config(): S3Config {
	return {
		endpoint: requireEnv('S3_ENDPOINT').replace(/\/+$/, ''),
		region: env('S3_REGION') ?? 'auto',
		bucket: requireEnv('S3_BUCKET'),
		accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
		secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
		sessionToken: env('S3_SESSION_TOKEN'),
		publicUrl: requireEnv('S3_PUBLIC_URL').replace(/\/+$/, ''),
		forcePathStyle: (env('S3_FORCE_PATH_STYLE') ?? 'true') !== 'false'
	};
}

function assertSafeKey(key: string): void {
	if (!SAFE_KEY.test(key) || key.includes('..') || key.startsWith('/')) {
		throw new StorageError('Nama file penyimpanan tidak valid.');
	}
}

function encodeKey(key: string): string {
	return key.split('/').map(encodeURIComponent).join('/');
}

function s3ObjectUrl(config: S3Config, key: string): URL {
	const endpoint = new URL(config.endpoint);
	const encodedKey = encodeKey(key);
	const basePath = endpoint.pathname.replace(/\/+$/, '');

	if (config.forcePathStyle) {
		return new URL(
			`${endpoint.protocol}//${endpoint.host}${basePath}/${encodeURIComponent(config.bucket)}/${encodedKey}`
		);
	}

	return new URL(
		`${endpoint.protocol}//${encodeURIComponent(config.bucket)}.${endpoint.host}${basePath}/${encodedKey}`
	);
}

function publicUrl(config: S3Config, key: string): string {
	return `${config.publicUrl}/${encodeKey(key)}`;
}

function s3KeyFromPublicPath(publicPath: string): string | null {
	if (storageDriver() !== 's3') return null;

	const config = s3Config();
	const prefix = `${config.publicUrl}/`;

	if (!publicPath.startsWith(prefix)) return null;

	const key = publicPath.slice(prefix.length);

	return key && SAFE_KEY.test(key) && !key.includes('..') ? key : null;
}

function isLocalPublicPath(publicPath: string): boolean {
	return publicPath.startsWith(`${LOCAL_PREFIX}/`);
}

function localKeyFromPublicPath(publicPath: string): string | null {
	if (!isLocalPublicPath(publicPath)) return null;

	const key = publicPath.slice(`${LOCAL_PREFIX}/`.length);

	return key && SAFE_KEY.test(key) && !key.includes('..') ? key : null;
}

function resolveLocalPath(key: string): string {
	assertSafeKey(key);

	const absolutePath = path.resolve(UPLOAD_ROOT, key);
	const root = path.resolve(UPLOAD_ROOT);

	if (!absolutePath.startsWith(`${root}${path.sep}`)) {
		throw new StorageError('Path penyimpanan tidak valid.');
	}

	return absolutePath;
}

async function putLocalObject(input: PutObjectInput): Promise<StoredObject> {
	const absolutePath = resolveLocalPath(input.key);

	await mkdir(path.dirname(absolutePath), { recursive: true });

	try {
		await writeFile(absolutePath, input.body, { flag: 'wx' });
	} catch {
		throw new StorageError('Gagal menyimpan file ke penyimpanan lokal.');
	}

	return {
		publicPath: `${LOCAL_PREFIX}/${input.key}`,
		size: input.body.length,
		absolutePath
	};
}

function s3Client(config: S3Config): AwsClient {
	return new AwsClient({
		accessKeyId: config.accessKeyId,
		secretAccessKey: config.secretAccessKey,
		sessionToken: config.sessionToken,
		service: 's3',
		region: config.region,
		retries: 2
	});
}

async function putS3Object(input: PutObjectInput): Promise<StoredObject> {
	const config = s3Config();
	const response = await s3Client(config).fetch(s3ObjectUrl(config, input.key), {
		method: 'PUT',
		body: new Uint8Array(input.body),
		headers: {
			'Content-Type': input.contentType,
			'Cache-Control': input.cacheControl ?? 'public, max-age=31536000, immutable'
		}
	});

	if (!response.ok) {
		throw new StorageError(`Gagal menyimpan file ke object storage (${response.status}).`);
	}

	return {
		publicPath: publicUrl(config, input.key),
		size: input.body.length
	};
}

export interface StorageStatus {
	driver: string;
	ready: boolean;
	missing: string[];
	bucket?: string;
	publicUrl?: string;
	error?: string;
}

export function getStorageStatus(): StorageStatus {
	const driver = env('STORAGE_DRIVER')?.toLowerCase() ?? 'local';

	if (driver === 'local') {
		return { driver, ready: true, missing: [] };
	}

	if (driver !== 's3') {
		return {
			driver,
			ready: false,
			missing: [],
			error: 'STORAGE_DRIVER harus bernilai "local" atau "s3".'
		};
	}

	const required = [
		'S3_ENDPOINT',
		'S3_BUCKET',
		'S3_ACCESS_KEY_ID',
		'S3_SECRET_ACCESS_KEY',
		'S3_PUBLIC_URL'
	];
	const missing = required.filter((name) => !env(name));

	if (missing.length > 0) {
		return { driver, ready: false, missing };
	}

	const config = s3Config();

	return {
		driver,
		ready: true,
		missing: [],
		bucket: config.bucket,
		publicUrl: config.publicUrl
	};
}

export async function putObject(input: PutObjectInput): Promise<StoredObject> {
	assertSafeKey(input.key);

	return storageDriver() === 's3' ? putS3Object(input) : putLocalObject(input);
}

export async function deleteObject(publicPath: string): Promise<void> {
	const localKey = localKeyFromPublicPath(publicPath);

	if (localKey) {
		try {
			await unlink(resolveLocalPath(localKey));
		} catch (cause) {
			const code = (cause as NodeJS.ErrnoException).code;

			if (code !== 'ENOENT') {
				console.error('Failed to delete local file', cause);
			}
		}

		return;
	}

	const s3Key = s3KeyFromPublicPath(publicPath);

	if (!s3Key) return;

	const config = s3Config();
	const response = await s3Client(config).fetch(s3ObjectUrl(config, s3Key), {
		method: 'DELETE'
	});

	if (!response.ok && response.status !== 404) {
		throw new StorageError(`Gagal menghapus file dari object storage (${response.status}).`);
	}
}

export async function objectExists(publicPath: string): Promise<boolean> {
	const localKey = localKeyFromPublicPath(publicPath);

	if (localKey) {
		try {
			const info = await stat(resolveLocalPath(localKey));
			return info.isFile();
		} catch {
			return false;
		}
	}

	const s3Key = s3KeyFromPublicPath(publicPath);

	if (!s3Key) return true;

	const config = s3Config();
	const response = await s3Client(config).fetch(s3ObjectUrl(config, s3Key), {
		method: 'HEAD'
	});

	if (response.ok) return true;
	if (response.status === 404) return false;

	throw new StorageError(`Gagal memeriksa file di object storage (${response.status}).`);
}

export function resolveUploadedFile(relativePath: string): string | null {
	if (!SAFE_KEY.test(relativePath) || relativePath.includes('..')) {
		return null;
	}

	const extension = relativePath.split('.').pop()?.toLowerCase();

	if (!extension || !MIME_BY_EXTENSION[extension]) {
		return null;
	}

	try {
		return resolveLocalPath(relativePath);
	} catch {
		return null;
	}
}

export function contentTypeForFile(filename: string): string {
	const extension = filename.split('.').pop()?.toLowerCase();
	return (extension && MIME_BY_EXTENSION[extension]) || 'application/octet-stream';
}
