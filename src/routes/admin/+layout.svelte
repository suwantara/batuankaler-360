<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const isLogin = $derived(page.url.pathname === '/admin/login');
	const navItems: Array<{ label: string; href: string; icon: IconName }> = [
		{ label: 'Dashboard', href: resolve('admin/dashboard'), icon: 'grid' },
		{ label: 'Scene', href: resolve('admin/scenes'), icon: 'layers' },
		{ label: 'Media', href: resolve('admin/media'), icon: 'image' },
		{ label: 'Konten', href: resolve('admin/content'), icon: 'file' },
		{ label: 'Pengaturan', href: resolve('admin/settings'), icon: 'settings' }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}

	const activeItem = $derived(navItems.find((item) => isActive(item.href)));
	const email = $derived(data.user?.email ?? '-');
	const initial = $derived((data.user?.email?.[0] ?? 'A').toUpperCase());
</script>

<svelte:head>
	<title>Admin — Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLogin}
	{@render children()}
{:else}
	<div class="min-h-dvh bg-sand/30 lg:grid lg:grid-cols-[17rem_1fr]">
		<aside class="dark-surface flex flex-col lg:min-h-dvh">
			<div class="border-b border-ivory/10 px-5 py-5">
				<a href={resolve('admin/dashboard')} aria-label="Dashboard admin">
					<BrandLockup tone="light" tagline />
				</a>
			</div>

			<nav
				class="flex gap-1 overflow-x-auto px-3 py-4 lg:flex-1 lg:flex-col lg:overflow-visible"
				aria-label="Navigasi admin"
			>
				<p class="meta hidden px-3 pb-2 text-[0.58rem] text-ivory/55 lg:block">Panel</p>
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class="admin-nav-link shrink-0 whitespace-nowrap lg:shrink"
					>
						<Icon name={item.icon} class="h-4 w-4 shrink-0" />
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="hidden border-t border-ivory/10 p-4 lg:block">
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
				<div class="mt-4 flex items-center justify-between gap-2">
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
			<header class="sticky top-0 z-30 border-b border-charcoal/10 bg-paper/90 backdrop-blur-md">
				<div class="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
					<div>
						<p class="meta text-[0.55rem] text-muted">Panel pengelolaan</p>
						<p class="mt-1 font-display text-lg leading-none text-navy">
							{activeItem?.label ?? 'Dashboard'}
						</p>
					</div>

					<div class="flex items-center gap-2 sm:gap-3">
						<a
							href={resolve('id')}
							class="hidden items-center gap-1.5 text-xs font-semibold text-navy transition-colors hover:text-gold-dark sm:inline-flex"
						>
							Lihat situs
							<Icon name="external" class="h-3.5 w-3.5" />
						</a>
						<span class="hidden h-4 w-px bg-navy/15 md:block" aria-hidden="true"></span>
						<span class="hidden max-w-40 truncate text-xs text-muted md:block">{email}</span>
						<form method="POST" action={resolve('admin/logout')} class="lg:hidden">
							<button type="submit" class="btn btn--outline btn--sm">
								<Icon name="logout" class="h-3.5 w-3.5" />
								Keluar
							</button>
						</form>
					</div>
				</div>
			</header>

			<main class="p-4 sm:p-6 lg:p-10">
				<div class="mx-auto max-w-6xl">
					{@render children()}
				</div>
			</main>
		</div>
	</div>
{/if}
