import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db, closeDb } from './script-db.ts';

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
