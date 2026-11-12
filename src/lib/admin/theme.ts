export const ADMIN_THEME_STORAGE_KEY = 'batuankaler-admin-theme';

export type AdminTheme = 'light' | 'dark';

export function isAdminTheme(value: string | null): value is AdminTheme {
	return value === 'light' || value === 'dark';
}

export function getStoredAdminTheme(): AdminTheme | null {
	if (typeof window === 'undefined') return null;

	try {
		const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
		return isAdminTheme(stored) ? stored : null;
	} catch {
		return null;
	}
}

export function resolveAdminTheme(): AdminTheme {
	const stored = getStoredAdminTheme();
	if (stored) return stored;

	if (typeof window === 'undefined') return 'light';

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyAdminTheme(theme: AdminTheme): void {
	if (typeof document !== 'undefined') {
		document.documentElement.dataset.adminTheme = theme;
	}

	try {
		localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
	} catch {
		// localStorage can be unavailable in private modes; the visual toggle still works.
	}
}
