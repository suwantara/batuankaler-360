import { randomUUID } from 'node:crypto';
import { fail } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { auth } from '#lib/server/auth.ts';
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
	updateName: async ({ locals, request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';

		if (!locals.user) {
			return fail(401, { profile: { ok: false as const, error: 'Sesi admin tidak ditemukan.' } });
		}

		if (name.length < 2 || name.length > 100) {
			return fail(400, {
				profile: { ok: false as const, error: 'Nama harus terdiri dari 2–100 karakter.' }
			});
		}

		try {
			await auth.api.updateUser({
				body: { name },
				headers: request.headers
			});

			return {
				profile: {
					ok: true as const,
					message: 'Nama berhasil diperbarui.',
					name
				}
			};
		} catch (cause) {
			if (cause instanceof APIError) {
				return fail(400, { profile: { ok: false as const, error: cause.message } });
			}

			console.error('Admin name update failed', cause);
			return fail(500, { profile: { ok: false as const, error: 'Gagal memperbarui nama.' } });
		}
	},

	updatePassword: async ({ locals, request }) => {
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() ?? '';
		const newPassword = formData.get('newPassword')?.toString() ?? '';
		const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

		if (!locals.user) {
			return fail(401, { password: { ok: false as const, error: 'Sesi admin tidak ditemukan.' } });
		}

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, {
				password: { ok: false as const, error: 'Semua kolom password wajib diisi.' }
			});
		}

		if (newPassword.length < 12) {
			return fail(400, {
				password: { ok: false as const, error: 'Password baru minimal 12 karakter.' }
			});
		}

		if (newPassword !== confirmPassword) {
			return fail(400, {
				password: { ok: false as const, error: 'Konfirmasi password tidak cocok.' }
			});
		}

		if (newPassword === currentPassword) {
			return fail(400, {
				password: {
					ok: false as const,
					error: 'Password baru harus berbeda dari password saat ini.'
				}
			});
		}

		try {
			await auth.api.changePassword({
				body: {
					currentPassword,
					newPassword,
					revokeOtherSessions: true
				},
				headers: request.headers
			});

			return {
				password: {
					ok: true as const,
					message: 'Password berhasil diperbarui. Sesi lain telah dikeluarkan.'
				}
			};
		} catch (cause) {
			if (cause instanceof APIError) {
				return fail(400, {
					password: { ok: false as const, error: 'Password saat ini tidak sesuai.' }
				});
			}

			console.error('Admin password update failed', cause);
			return fail(500, {
				password: { ok: false as const, error: 'Gagal memperbarui password.' }
			});
		}
	},

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
