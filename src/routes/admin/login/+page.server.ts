import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';
import { auth } from '#lib/server/auth.ts';
import type { Actions, PageServerLoad } from './$types';

function safeRedirectTarget(value: string | null): string {
	if (!value) return '/admin/dashboard';
	if (!value.startsWith('/admin')) return '/admin/dashboard';
	if (value.startsWith('//')) return '/admin/dashboard';
	return value;
}

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) {
		return redirect(303, '/admin/dashboard');
	}

	return { redirectTo: url.searchParams.get('redirectTo') ?? '' };
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(400, { message: 'Email dan password wajib diisi.', email });
		}

		try {
			await auth.api.signInEmail({
				body: { email, password }
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message, email });
			}

			console.error('Admin sign-in failed', error);
			return fail(500, { message: 'Terjadi kesalahan saat masuk.', email });
		}

		return redirect(303, safeRedirectTarget(url.searchParams.get('redirectTo')));
	}
};
