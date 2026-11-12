import { expect, test, type Page } from '@playwright/test';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function loginAsAdmin(page: Page): Promise<void> {
	await page.goto('/admin/login');
	await page.getByLabel('Email').fill(adminEmail!);
	await page.getByLabel('Password').fill(adminPassword!);
	await page.getByRole('button', { name: 'Masuk' }).click();
	await expect(page).toHaveURL(/\/admin\/dashboard/);
}

test.describe('public website', () => {
	test('redirects the root path to the Indonesian home page', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/id$/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Pura Batuan Kaler');
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

	test('loads a scene from a direct URL', async ({ page }) => {
		await page.goto('/id/tour/madya-mandala');
		await expect(page.getByRole('heading', { level: 1 })).toContainText('Madya Mandala');
		await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });
	});

	test('returns 404 for an unknown scene', async ({ page }) => {
		const response = await page.goto('/id/tour/scene-tidak-ada');
		expect(response?.status()).toBe(404);
	});

	test('returns 404 for an unknown locale', async ({ page }) => {
		const response = await page.goto('/fr');
		expect(response?.status()).toBe(404);
	});

	test('does not expose files outside the upload directory', async ({ page }) => {
		const response = await page.goto('/uploads/panoramas/..%2F..%2F.env');
		expect(response?.status()).toBe(404);
	});
});

test.describe('admin dashboard', () => {
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

	test('loads the visit information editor', async ({ page }) => {
		test.skip(!adminEmail || !adminPassword, 'Admin credentials are not configured.');

		await loginAsAdmin(page);
		await page.goto('/admin/content');

		await expect(page.getByRole('heading', { name: 'Informasi kunjungan' })).toBeVisible();
		await expect(page.getByLabel('Nama pengelola')).toBeVisible();
		await expect(page.getByLabel('Lokasi (ID)')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Simpan konten' })).toBeVisible();
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
		await page.getByRole('button', { name: 'Unggah aset' }).click();

		await expect(page).toHaveURL(/\/admin\/media$/);
		await expect(page.getByTestId('asset-row')).toHaveCount(initialRows + 1);
		await expect(page.getByTestId('asset-row').last()).toContainText('/uploads/panoramas/');

		await page.getByTestId('asset-row').last().getByRole('link', { name: 'Preview' }).click();
		await expect(page.getByRole('heading', { name: 'Preview aset' })).toBeVisible();
		await expect(page.locator('canvas')).toBeVisible({ timeout: 15_000 });

		await page.goto('/admin/media');
		page.once('dialog', (dialog) => dialog.accept());
		await page.getByTestId('asset-row').last().getByTestId('delete-asset').click();
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

		page.once('dialog', (dialog) => dialog.accept());
		await page.getByRole('button', { name: 'Hapus scene' }).click();

		await expect(page).toHaveURL(/\/admin\/scenes$/);
		await expect(page.getByText(slug)).toHaveCount(0);
	});
});
