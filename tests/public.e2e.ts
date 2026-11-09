import { expect, test } from '@playwright/test';

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
});
