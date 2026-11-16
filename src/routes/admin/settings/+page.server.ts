import { randomUUID } from 'node:crypto';
import { fail } from '@sveltejs/kit';
import { AppError } from '#lib/server/errors.ts';
import {
	deleteObject,
	getStorageStatus,
	objectExists,
	putObject
} from '#lib/server/storage/index.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { storage: getStorageStatus() };
};

export const actions: Actions = {
	testStorage: async () => {
		let publicPath: string | undefined;

		try {
			const key = `storage-check/${randomUUID()}.txt`;
			const stored = await putObject({
				key,
				body: Buffer.from('Pura Batuan Kaler 360 storage check'),
				contentType: 'text/plain'
			});
			publicPath = stored.publicPath;

			const exists = await objectExists(publicPath);

			return {
				storageTest: {
					ok: exists,
					message: exists
						? 'Koneksi penyimpanan berhasil: objek uji dapat ditulis, dibaca, dan akan dihapus.'
						: 'Objek uji berhasil ditulis tetapi tidak dapat dibaca kembali.'
				}
			};
		} catch (cause) {
			if (cause instanceof AppError) {
				return fail(cause.status, {
					storageTest: { ok: false, message: cause.message }
				});
			}

			console.error('Storage check failed', cause);
			return fail(500, {
				storageTest: { ok: false, message: 'Uji koneksi penyimpanan gagal.' }
			});
		} finally {
			if (publicPath) {
				try {
					await deleteObject(publicPath);
				} catch (cause) {
					console.error('Storage check cleanup failed', cause);
				}
			}
		}
	}
};
