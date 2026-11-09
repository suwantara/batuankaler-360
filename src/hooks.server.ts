import type { Handle } from '@sveltejs/kit/hooks';

// Better Auth, sesi admin, dan guard route /admin akan diaktifkan pada Fase 4
// setelah PostgreSQL dan schema autentikasi dikonfigurasi.
export const handle: Handle = ({ event, resolve }) => resolve(event);
