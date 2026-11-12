import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/env';
import { auth } from '#lib/server/auth.ts';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const SESSION_COOKIES = ['better-auth.session_token', '__Secure-better-auth.session_token'];

function applySecurityHeaders(response: Response, url: URL): Response {
	const headers = response.headers;

	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	if (url.protocol === 'https:') {
		headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	return response;
}

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;
	const hasSessionCookie = SESSION_COOKIES.some((name) => event.cookies.get(name));

	if (hasSessionCookie) {
		const session = await auth.api.getSession({ headers: event.request.headers });

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	if (path === '/admin' || path.startsWith('/admin/')) {
		if (!event.locals.user && path !== '/admin/login') {
			const redirectTo = `${path}${event.url.search}`;
			return redirect(303, `/admin/login?redirectTo=${encodeURIComponent(redirectTo)}`);
		}

		if (event.locals.user && path === '/admin/login') {
			return redirect(303, '/admin/dashboard');
		}
	}

	return applySecurityHeaders(
		await svelteKitHandler({ event, resolve, auth, building }),
		event.url
	);
};

export const handleError: HandleServerError = ({ kind, error }) => {
	if (kind === 'unknown' || ((kind === 'app' || kind === 'framework') && error.status >= 500)) {
		console.error(error);
	}

	if (kind === 'app' || kind === 'framework') {
		return { message: error.message };
	}

	return { message: 'Terjadi kesalahan pada server.' };
};
