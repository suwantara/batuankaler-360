import { expect, test, type BrowserContext, type Page } from '@playwright/test';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

let adminCookies: Awaited<ReturnType<BrowserContext['cookies']>> | undefined;

async function loginAsAdmin(page: Page): Promise<void> {
	if (adminCookies) {
		await page.context().addCookies(adminCookies);
		await page.goto('/admin/dashboard');
		await expect(page).toHaveURL(/\/admin\/dashboard/);
		return;
	}

	await page.goto('/admin/login');
	await page.getByLabel('Email').fill(adminEmail!);
	await page.getByLabel('Password').fill(adminPassword!);
	await page.getByRole('button', { name: 'Masuk' }).click();
	await expect(page).toHaveURL(/\/admin\/dashboard/);

	adminCookies = await page.context().cookies();
}

test.describe('public website', () => {
	test('redirects the root path to the Indonesian home page', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/id$/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Pura Batuan Kaler');
	});

	test('sets baseline security headers', async ({ request }) => {
		const response = await request.get('/id');
		const headers = response.headers();

		expect(headers['x-content-type-options']).toBe('nosniff');
		expect(headers['x-frame-options']).toBe('DENY');
		expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
		expect(headers['cross-origin-opener-policy']).toBe('same-origin');
		expect(headers['permissions-policy']).toContain('camera=()');
	});

	test('switches language from the header', async ({ page }) => {
		await page.goto('/id');
		await page.getByRole('link', { name: 'Ganti bahasa' }).click();
		await expect(page).toHaveURL(/\/en$/);
		await expect(
			page
				.getByRole('navigation', { name: 'Main navigation' })
				.getByRole('link', { name: 'Home', exact: true })
		).toBeVisible();
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Pura Batuan Kaler');
	});

	test('renders the panorama viewer controls', async ({ page }) => {
		await page.goto('/id/tour');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Jelajahi kawasan');
		await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });
		await expect(page.getByRole('button', { name: 'Perbesar' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Layar penuh' })).toBeVisible();
	});

	test('switches scenes from the scene list', async ({ page }) => {
		await page.goto('/id/tour');

		const sceneList = page.getByRole('complementary', { name: 'Daftar scene' });
		await expect(sceneList.getByRole('button', { name: /Madya Mandala/ })).toBeVisible({
			timeout: 15_000
		});
		await sceneList.getByRole('button', { name: /Madya Mandala/ }).click();

		await expect(page.getByRole('heading', { name: 'Madya Mandala' })).toBeVisible();
		await expect(sceneList.getByRole('button', { name: /Madya Mandala/ })).toHaveAttribute(
			'aria-pressed',
			'true'
		);
	});

	test('navigates between scenes through a hotspot', async ({ page }) => {
		await page.goto('/id/tour');

		const hotspot = page.getByRole('button', { name: 'Menuju Madya Mandala' });
		await expect(hotspot).toBeVisible({ timeout: 15_000 });
		await hotspot.click();

		await expect(page.getByRole('heading', { name: 'Madya Mandala' })).toBeVisible();
	});

	test('opens information hotspots', async ({ page }) => {
		await page.goto('/id/tour');

		const hotspot = page.getByRole('button', { name: 'Informasi gapura' });
		await expect(hotspot).toBeVisible({ timeout: 15_000 });
		await hotspot.click();

		const infoPanel = page.getByRole('region', { name: 'Informasi hotspot' });
		await expect(infoPanel).toBeVisible();
		await expect(infoPanel.getByRole('heading', { name: 'Gapura masuk' })).toBeVisible();
		await expect(infoPanel).toContainText('Gapura menjadi penanda peralihan');
	});

	test('keeps hotspot information visible in fullscreen', async ({ page }) => {
		await page.goto('/id/tour');

		await page.getByRole('button', { name: 'Informasi gapura' }).click();
		const panel = page.getByRole('region', { name: 'Informasi hotspot' });
		await expect(panel).toBeVisible();

		await page.getByRole('button', { name: 'Layar penuh' }).click();
		await expect(page.getByRole('button', { name: 'Keluar layar penuh' })).toBeVisible();
		await expect(panel).toBeVisible();
	});

	test('loads a scene from a direct URL', async ({ page }) => {
		await page.goto('/id/tour/madya-mandala');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Madya Mandala');
		await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });
	});

	test('returns 404 for an unknown scene', async ({ page }) => {
		const response = await page.goto('/id/tour/scene-tidak-ada');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan.' })).toBeVisible();
		await expect(page.getByRole('link', { name: /Kembali ke beranda/ })).toBeVisible();
	});

	test('returns an English 404 page for an unknown scene', async ({ page }) => {
		const response = await page.goto('/en/tour/scene-tidak-ada');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
	});

	test('returns 404 for an unknown locale', async ({ page }) => {
		const response = await page.goto('/fr');
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan.' })).toBeVisible();
	});

	test('does not expose files outside the upload directory', async ({ page }) => {
		const response = await page.goto('/uploads/panoramas/..%2F..%2F.env');
		expect(response?.status()).toBe(404);
	});
});

test.describe('admin dashboard', () => {
	test('toggles password visibility on the login form', async ({ page }) => {
		await page.goto('/admin/login');

		const password = page.getByLabel('Password', { exact: true });
		await expect(password).toHaveAttribute('type', 'password');

		await page.getByRole('button', { name: 'Tampilkan sandi' }).click();
		await expect(password).toHaveAttribute('type', 'text');

		await page.getByRole('button', { name: 'Sembunyikan sandi' }).click();
		await expect(password).toHaveAttribute('type', 'password');
	});

	test('redirects unauthenticated visitors to the login page', async ({ page }) => {
		await page.goto('/admin/dashboard');
		await expect(page).toHaveURL(/\/admin\/login/);
		await expect(page.getByRole('heading', { name: 'Masuk ke panel admin' })).toBeVisible();
	});

	test('logs in and loads managed scenes', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await page.goto('/admin/login');
		await page.getByLabel('Email').fill(adminEmail!);
		await page.getByLabel('Password').fill(adminPassword!);
		await page.getByRole('button', { name: 'Masuk' }).click();

		await expect(page).toHaveURL(/\/admin\/dashboard/);
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

		await page.goto('/admin/scenes');
		await expect(page.getByRole('heading', { name: 'Scene', exact: true })).toBeVisible();
		await expect(page.getByText('Jaba Pura').first()).toBeVisible();

		await page.goto('/admin/media');
		await expect(page.getByRole('heading', { name: 'Aset panorama' })).toBeVisible();
		await expect(page.getByText('scene-jaba.jpg').first()).toBeVisible();
	});

	test('shows a friendly error page for unknown admin routes', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		const response = await page.goto('/admin/halaman-tidak-ada');

		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: 'Halaman tidak ditemukan.' })).toBeVisible();
		await expect(page.getByRole('link', { name: /Ke dashboard admin/ })).toBeVisible();
	});

	test('toggles and persists admin dark mode', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.getByRole('button', { name: 'Aktifkan mode gelap' }).click();
		await expect(page.locator('html')).toHaveAttribute('data-admin-theme', 'dark');

		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-admin-theme', 'dark');
		await expect(page.getByRole('button', { name: 'Aktifkan mode terang' })).toBeVisible();
	});

	test('loads the home content editor and switches language', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/pages');

		await expect(page.getByRole('link', { name: 'Edit beranda' })).toBeVisible();
		await page.getByRole('link', { name: 'Edit beranda' }).click();

		await expect(page.getByRole('heading', { name: 'Beranda', exact: true })).toBeVisible();
		await expect(page.getByLabel('Baris utama judul (ID)')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Gambar halaman' })).toBeVisible();
		await expect(page.getByLabel('Gambar hero')).toBeVisible();
		await expect(page.getByText('SEO halaman (ID)')).toBeVisible();

		await page.getByRole('button', { name: 'English' }).click();
		await expect(page.getByLabel('Baris utama judul (EN)')).toBeVisible();
		await expect(page.getByText('SEO halaman (EN)')).toBeVisible();
		await expect(page.getByLabel('Gambar pratinjau virtual tour')).toBeVisible();
	});

	test('loads the history page editor and adds an article block', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/pages');

		await expect(page.getByRole('heading', { name: 'Halaman', exact: true })).toBeVisible();
		await expect(page.getByText('Sejarah').first()).toBeVisible();
		await page.getByRole('link', { name: 'Edit halaman' }).first().click();

		await expect(page.getByRole('heading', { name: 'Artikel' })).toBeVisible();
		await page.getByRole('button', { name: 'Tambah bagian' }).first().click();

		await expect(page.getByLabel('Subjudul (ID)')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Simpan halaman' })).toBeVisible();
	});

	test('loads the visit information editor', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/content');

		await expect(page.getByRole('heading', { name: 'Informasi kunjungan' })).toBeVisible();
		await expect(page.getByLabel('Nama pengelola')).toBeVisible();
		await expect(page.getByLabel('Lokasi (ID)')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Simpan konten' })).toBeVisible();
	});

	test('lists hotspots and opens one for editing', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/hotspots');

		await expect(page.getByRole('heading', { name: 'Hotspot', exact: true })).toBeVisible();
		await expect(page.getByText('Informasi gapura').first()).toBeVisible();

		await page.getByRole('button', { name: 'Edit' }).first().click();
		await expect(page).toHaveURL(/\/admin\/scenes\/.+\/hotspots\?hotspot=/);
		await expect(
			page.locator('details[open]').getByRole('button', { name: 'Simpan hotspot' })
		).toBeVisible();
	});

	test('picks scene coordinates from the panorama', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/scenes');
		await page.getByRole('link', { name: 'Edit' }).first().click();
		await page.getByRole('button', { name: 'Buka pemilih' }).click();

		const viewer = page.locator('[role="application"]').first();
		await expect(viewer).toBeVisible();
		await viewer.scrollIntoViewIfNeeded();
		await expect(page.locator('.coordinate-pick-marker')).toHaveCount(1);

		const box = await viewer.boundingBox();
		if (!box) throw new Error('Viewer tidak memiliki ukuran.');

		const yaw = page.getByRole('spinbutton', { name: 'Yaw', exact: true });
		await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.5);
		await expect(yaw).not.toHaveValue('0.00');
	});

	test('rejects a non-image panorama upload', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/media/upload');
		await page.locator('input[name="original"]').setInputFiles({
			name: 'not-an-image.txt',
			mimeType: 'text/plain',
			buffer: Buffer.from('not an image')
		});
		await page
			.locator('input[name="thumbnail"]')
			.setInputFiles('static/images/panoramas/scene-jaba-thumb.jpg');
		await page.getByRole('button', { name: 'Unggah aset' }).click();

		await expect(page.getByRole('alert')).toContainText('Format file original');
	});

	test('uploads, previews, and deletes a panorama asset', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/media');
		const initialRows = await page.getByTestId('asset-row').count();

		await page.goto('/admin/media/upload');
		await page
			.locator('input[name="original"]')
			.setInputFiles('static/images/panoramas/scene-jaba.jpg');
		await page
			.locator('input[name="thumbnail"]')
			.setInputFiles('static/images/panoramas/scene-jaba-thumb.jpg');
		await page.route('**/admin/media/upload/api', async (route) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			await route.continue();
		});
		await page.getByRole('button', { name: 'Unggah aset' }).click();

		await expect(page.getByRole('progressbar', { name: 'Progres unggah aset' })).toBeVisible();
		await expect(page).toHaveURL(/\/admin\/media\?uploaded=1$/);
		await expect(page.getByRole('status')).toContainText('berhasil diunggah');
		await expect(page.getByTestId('asset-row')).toHaveCount(initialRows + 1);
		await expect(page.getByTestId('asset-row').last()).toContainText('/uploads/panoramas/');

		await page.getByTestId('asset-row').last().getByRole('link', { name: 'Preview' }).click();
		await expect(page.getByRole('heading', { name: 'Preview aset' })).toBeVisible();
		await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });

		await page.goto('/admin/media');
		await page.getByTestId('asset-row').last().getByTestId('delete-asset').click();
		const deleteDialog = page.getByRole('dialog', { name: 'Hapus aset panorama?' });
		await expect(deleteDialog).toBeVisible();
		await deleteDialog.getByRole('button', { name: 'Batal' }).click();
		await expect(deleteDialog).toBeHidden();
		await expect(page.getByTestId('asset-row')).toHaveCount(initialRows + 1);

		await page.getByTestId('asset-row').last().getByTestId('delete-asset').click();
		await deleteDialog.getByRole('button', { name: 'Hapus', exact: true }).click();
		await expect(page.getByTestId('asset-row')).toHaveCount(initialRows);
	});

	test('creates, publishes, and deletes a scene with a hotspot', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		const slug = `e2e-scene-${Date.now()}`;
		const title = `E2E Scene ${Date.now()}`;
		const updatedTitle = `${title} Updated`;

		await loginAsAdmin(page);
		await page.goto('/admin/scenes/new');

		await page.getByLabel('Slug').fill(slug);
		await page.getByLabel('Area').selectOption({ index: 1 });
		await page.getByLabel('Aset panorama').selectOption({ index: 1 });
		await page.getByLabel('Judul').fill(title);
		await page.getByLabel('Deskripsi').fill('Scene untuk pengujian otomatis.');
		await page.getByLabel('Title').fill(title);
		await page.getByLabel('Description').fill('Scene created by the automated test.');
		await page.getByRole('button', { name: 'Simpan scene' }).click();

		await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

		await page.getByLabel('Judul').fill(updatedTitle);
		await page.getByRole('button', { name: 'Simpan perubahan' }).click();
		await expect(page.getByRole('heading', { level: 1, name: updatedTitle })).toBeVisible();

		await page.getByRole('link', { name: 'Kelola hotspot' }).click();

		await page.getByLabel('Label hotspot').fill('E2E Info');
		await page.getByLabel('Judul informasi').fill('E2E Information');
		await page.getByLabel('Deskripsi').fill('Informasi untuk pengujian otomatis.');
		await page.getByLabel('Hotspot label').fill('E2E Info');
		await page.getByLabel('Information title').fill('E2E Information');
		await page.getByLabel('Description').fill('Information created by the automated test.');
		await page.getByRole('button', { name: 'Tambah hotspot' }).click();

		await expect(page.getByText('E2E Info').first()).toBeVisible();

		await page.getByRole('link', { name: 'Kembali ke scene' }).click();
		await page.getByRole('button', { name: 'Publikasikan' }).click();
		await expect(page.getByRole('link', { name: 'Lihat di situs' })).toBeVisible();

		await page.getByRole('button', { name: 'Hapus scene' }).click();
		const sceneDialog = page.getByRole('dialog', { name: 'Hapus scene?' });
		await expect(sceneDialog).toBeVisible();
		await sceneDialog.getByRole('button', { name: 'Hapus', exact: true }).click();

		await expect(page).toHaveURL(/\/admin\/scenes$/);
		await expect(page.getByText(slug)).toHaveCount(0);
	});
});
