import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { error } from '@sveltejs/kit';
import { contentTypeForFile, resolveUploadedFile } from '#lib/server/storage/local.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const filePath = resolveUploadedFile(params.path);

	if (!filePath) {
		error(404, 'File tidak ditemukan.');
	}

	try {
		const info = await stat(filePath);

		if (!info.isFile()) {
			error(404, 'File tidak ditemukan.');
		}

		const stream = Readable.toWeb(createReadStream(filePath)) as unknown as ReadableStream;

		return new Response(stream, {
			headers: {
				'Content-Type': contentTypeForFile(filePath),
				'Content-Length': String(info.size),
				'Cache-Control': 'public, max-age=31536000, immutable',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch {
		error(404, 'File tidak ditemukan.');
	}
};
