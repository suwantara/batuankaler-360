import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { error } from '@sveltejs/kit';
import { DATABASE_URL } from '$app/env/private';
import type { RequestHandler } from './$types';

const execFileAsync = promisify(execFile);

function backupFileName(): string {
	const stamp = new Date().toISOString().replace(/[:.]/g, '-');
	return `batuankaler-database-${stamp}.dump`;
}

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, 'Sesi admin tidak ditemukan.');
	}

	const directory = await mkdtemp(path.join(tmpdir(), 'batuankaler-backup-'));
	const file = path.join(directory, 'database.dump');

	try {
		await execFileAsync(
			'pg_dump',
			[DATABASE_URL, '--format=custom', '--no-owner', '--no-privileges', `--file=${file}`],
			{ timeout: 120_000, maxBuffer: 1024 * 1024 }
		);

		const buffer = await readFile(file);

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${backupFileName()}"`,
				'Content-Length': String(buffer.length),
				'Cache-Control': 'no-store'
			}
		});
	} catch (cause) {
		console.error('Database backup failed', cause);
		error(500, 'Gagal membuat backup database.');
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
};
