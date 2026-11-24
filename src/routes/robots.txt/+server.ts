import { ORIGIN } from '$app/env/private';
import { renderRobots } from '#lib/seo.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const origin = ORIGIN || url.origin;

	return new Response(renderRobots(origin), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
