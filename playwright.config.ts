import { loadEnvFile } from 'node:process';
import { defineConfig } from '@playwright/test';

loadEnvFile('.env');
process.env.ORIGIN = 'http://127.0.0.1:4173';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1',
		port: 4173
	},
	use: { baseURL: 'http://127.0.0.1:4173' },
	testMatch: '**/*.e2e.{ts,js}'
});
