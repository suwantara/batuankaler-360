import { and, eq } from 'drizzle-orm';
import { betterAuth } from 'better-auth/minimal';
import { hashPassword } from 'better-auth/crypto';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, closeDb } from './script-db.ts';
import { account, user } from './schema.ts';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? 'Administrator';

if (!email || !password) {
	throw new Error('ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi.');
}

if (password.length < 12) {
	throw new Error('ADMIN_PASSWORD minimal 12 karakter.');
}

const provisioningAuth = betterAuth({
	baseURL: process.env.ORIGIN ?? 'http://localhost:5173',
	secret: process.env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true }
});

async function createAdmin(): Promise<void> {
	const existing = await db
		.select({ id: user.id })
		.from(user)
		.where(eq(user.email, email!))
		.limit(1);

	if (existing.length > 0) {
		const userId = existing[0].id;
		const passwordHash = await hashPassword(password!);
		const credential = await db
			.select({ id: account.id })
			.from(account)
			.where(and(eq(account.userId, userId), eq(account.providerId, 'credential')))
			.limit(1);

		if (credential.length > 0) {
			await db
				.update(account)
				.set({ password: passwordHash, updatedAt: new Date() })
				.where(eq(account.id, credential[0].id));
		} else {
			await db.insert(account).values({
				id: crypto.randomUUID(),
				accountId: userId,
				providerId: 'credential',
				userId,
				password: passwordHash
			});
		}

		console.log(`Password admin diperbarui: ${email}`);
		return;
	}

	await provisioningAuth.api.signUpEmail({
		body: { email: email!, password: password!, name }
	});

	console.log(`Admin dibuat: ${email}`);
}

createAdmin()
	.catch((error) => {
		console.error('Gagal membuat admin:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await closeDb();
	});
