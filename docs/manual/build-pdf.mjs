import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(here, 'manual.html');
const output = path.join(here, '..', 'Dokumentasi-Sistem-Pura-Batuan-Kaler-360.pdf');

const footerTemplate = `
<div style="width:100%;padding:0 16mm;font-family:Segoe UI,Arial,sans-serif;font-size:7px;color:#6b6f7b;display:flex;justify-content:space-between;align-items:center;">
	<span>Pura Batuan Kaler 360 · Dokumentasi Sistem &amp; Panduan Pengguna</span>
	<span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(pathToFileURL(input).href, { waitUntil: 'load' });
await page.emulateMedia({ media: 'print' });
await page.evaluate(async () => {
	await Promise.all(
		Array.from(document.images).map((image) =>
			image.complete
				? Promise.resolve()
				: new Promise((resolve) => {
						image.onload = resolve;
						image.onerror = resolve;
					})
		)
	);
});
await page.waitForTimeout(500);

await page.pdf({
	path: output,
	format: 'A4',
	printBackground: true,
	preferCSSPageSize: true,
	displayHeaderFooter: true,
	headerTemplate: '<div></div>',
	footerTemplate
});

await browser.close();

const info = await stat(output);
console.log(`PDF dibuat: ${path.relative(process.cwd(), output)} (${Math.round(info.size / 1024)} KB)`);
