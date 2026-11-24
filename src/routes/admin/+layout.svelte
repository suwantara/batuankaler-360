<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ContentWorkflow from '#lib/components/admin/ContentWorkflow.svelte';
	import ThemeToggle from '#lib/components/admin/ThemeToggle.svelte';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let mobileNavOpen = $state(false);
	let menuButton: HTMLButtonElement | undefined = $state();
	let closeButton: HTMLButtonElement | undefined = $state();

	function openMobileNav(): void {
		mobileNavOpen = true;
		void tick().then(() => closeButton?.focus());
	}

	function closeMobileNav(): void {
		mobileNavOpen = false;
		menuButton?.focus();
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && mobileNavOpen) {
			event.preventDefault();
			closeMobileNav();
		}
	}

	$effect(() => {
		document.body.style.overflow = mobileNavOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (page.url.pathname) mobileNavOpen = false;
	});

	onMount(() => {
		const desktop = window.matchMedia('(min-width: 64rem)');
		const handleChange = () => {
			if (desktop.matches) mobileNavOpen = false;
		};

		desktop.addEventListener('change', handleChange);

		return () => desktop.removeEventListener('change', handleChange);
	});

	const isLogin = $derived(page.url.pathname === '/admin/login');
	const navItems: Array<{ label: string; href: string; icon: IconName }> = [
		{ label: 'Dashboard', href: resolve('admin/dashboard'), icon: 'grid' },
		{ label: 'Media', href: resolve('admin/media'), icon: 'image' },
		{ label: 'Scene', href: resolve('admin/scenes'), icon: 'layers' },
		{ label: 'Hotspot', href: resolve('admin/hotspots'), icon: 'map-pin' },
		{ label: 'Galeri', href: resolve('admin/gallery'), icon: 'eye' },
		{ label: 'Area', href: resolve('admin/areas'), icon: 'cube' },
		{ label: 'Halaman', href: resolve('admin/pages'), icon: 'file' },
		{ label: 'Kunjungan', href: resolve('admin/content'), icon: 'compass' }
	];
	const settingsItem: { label: string; href: string; icon: IconName } = {
		label: 'Pengaturan akun',
		href: resolve('admin/settings'),
		icon: 'settings'
	};

	function isActive(href: string): boolean {
		if (href === resolve('admin/pages') && page.url.pathname === resolve('admin/home')) {
			return true;
		}

		if (href === resolve('admin/hotspots')) {
			return (
				page.url.pathname.startsWith('/admin/hotspots') ||
				(page.url.pathname.startsWith('/admin/scenes/') && page.url.pathname.includes('/hotspots'))
			);
		}

		if (href === resolve('admin/scenes')) {
			return (
				page.url.pathname.startsWith('/admin/scenes') && !page.url.pathname.includes('/hotspots')
			);
		}

		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	const activeItem = $derived(
		navItems.find((item) => isActive(item.href)) ??
			(isActive(settingsItem.href) ? settingsItem : undefined)
	);
	const email = $derived(data.user?.email ?? '-');
	const initial = $derived((data.user?.email?.[0] ?? 'A').toUpperCase());
</script>

<svelte:head>
	<title>Admin | Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if isLogin}
	<div class="admin-shell">
		{@render children()}
	</div>
{:else}
	<div class="admin-shell min-h-dvh bg-sand/30 lg:grid lg:grid-cols-[17rem_1fr]">
		{#if mobileNavOpen}
			<button
				type="button"
				class="fixed inset-0 z-40 bg-ink/60 lg:hidden"
				aria-label="Tutup menu navigasi"
				onclick={closeMobileNav}
			></button>
		{/if}

		<aside
			id="admin-sidebar"
			class="dark-surface fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col overflow-hidden shadow-2xl {mobileNavOpen
				? 'max-lg:visible max-lg:translate-x-0'
				: 'max-lg:invisible max-lg:-translate-x-full'} max-lg:transition-transform max-lg:duration-300 max-lg:ease-out lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:max-h-dvh lg:w-auto lg:max-w-none lg:translate-x-0 lg:self-start lg:shadow-none"
		>
			<div class="flex items-center justify-between gap-3 border-b border-ivory/10 px-5 py-5">
				<a href={resolve('admin/dashboard')}>
					<BrandLockup tone="light" tagline />
					<span class="sr-only">Dashboard admin</span>
				</a>
				<button
					bind:this={closeButton}
					type="button"
					onclick={closeMobileNav}
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory/65 transition-colors hover:border-gold-light/60 hover:text-ivory lg:hidden"
					aria-label="Tutup menu"
				>
					<Icon name="close" class="h-4 w-4" />
				</button>
			</div>

			<nav
				class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-4"
				aria-label="Navigasi admin"
			>
				<p class="meta px-3 pb-2 text-[0.58rem] text-ivory/55">Panel</p>
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class="admin-nav-link shrink-0 whitespace-nowrap"
					>
						<Icon name={item.icon} class="h-4 w-4 shrink-0" />
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="border-t border-ivory/10 p-4">
				<div class="flex items-center gap-3">
					<span
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-light/25 bg-gold/10 font-display text-sm text-gold-light"
					>
						{initial}
					</span>
					<div class="min-w-0">
						<p class="meta text-[0.55rem] text-ivory/55">Masuk sebagai</p>
						<p class="mt-1 truncate text-xs text-ivory/75">{email}</p>
					</div>
				</div>
				<a
					href={settingsItem.href}
					aria-current={isActive(settingsItem.href) ? 'page' : undefined}
					class="admin-nav-link mt-3"
				>
					<Icon name="settings" class="h-4 w-4" />
					{settingsItem.label}
				</a>
				<div class="mt-3 flex items-center justify-between gap-2">
					<a
						href={resolve('id')}
						class="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-light transition-colors hover:text-ivory"
					>
						Lihat situs
						<Icon name="external" class="h-3.5 w-3.5" />
					</a>
					<form method="POST" action={resolve('admin/logout')}>
						<button
							type="submit"
							class="inline-flex items-center gap-1.5 text-xs font-semibold text-ivory/55 transition-colors hover:text-ivory"
						>
							<Icon name="logout" class="h-3.5 w-3.5" />
							Keluar
						</button>
					</form>
				</div>
			</div>
		</aside>

		<div class="min-w-0">
			<header class="sticky top-0 z-30 border-b border-charcoal/10 bg-paper">
				<div class="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
					<div class="flex min-w-0 items-center gap-3">
						<button
							bind:this={menuButton}
							type="button"
							onclick={openMobileNav}
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-heading transition-colors hover:border-gold-dark hover:text-gold-dark lg:hidden"
							aria-label="Buka menu"
							aria-expanded={mobileNavOpen}
							aria-controls="admin-sidebar"
						>
							<Icon name="menu" class="h-5 w-5" />
						</button>
						<div class="min-w-0">
							<p class="meta text-[0.55rem] text-muted">Panel pengelolaan</p>
							<p class="mt-1 font-display text-lg leading-none text-heading">
								{activeItem?.label ?? 'Dashboard'}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-2 sm:gap-3">
						<ThemeToggle />
						<a
							href={resolve('id')}
							class="hidden items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark sm:inline-flex"
						>
							Lihat situs
							<Icon name="external" class="h-3.5 w-3.5" />
						</a>
					</div>
				</div>
			</header>

			<div
				class="sticky top-[3.75rem] z-20 border-b border-charcoal/10 bg-paper px-4 py-2 sm:px-6 lg:px-10"
			>
				<div class="mx-auto max-w-6xl">
					<ContentWorkflow />
				</div>
			</div>

			<main class="p-4 sm:p-6 lg:p-10">
				<div class="mx-auto max-w-6xl">
					{@render children()}
				</div>
			</main>
		</div>
	</div>
{/if}
