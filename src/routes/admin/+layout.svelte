<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import TempleMark from '#lib/components/public/TempleMark.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const isLogin = $derived(page.url.pathname === '/admin/login');
	const navItems = [
		{ label: 'Dashboard', href: resolve('admin/dashboard') },
		{ label: 'Scene', href: resolve('admin/scenes') },
		{ label: 'Media', href: resolve('admin/media') },
		{ label: 'Konten', href: resolve('admin/content') },
		{ label: 'Pengaturan', href: resolve('admin/settings') }
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<svelte:head>
	<title>Admin — Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLogin}
	{@render children()}
{:else}
	<div class="min-h-dvh bg-sand/30 lg:grid lg:grid-cols-[16rem_1fr]">
		<aside class="bg-navy text-ivory lg:flex lg:min-h-dvh lg:flex-col">
			<div class="flex items-center gap-3 px-5 py-5">
				<TempleMark class="h-9 w-9 text-gold-light" />
				<div>
					<p class="font-display text-lg leading-none">
						Batuan Kaler <span class="text-gold-light">360</span>
					</p>
					<p class="mt-1 text-[0.65rem] font-semibold tracking-[0.24em] text-ivory/45 uppercase">
						Admin
					</p>
				</div>
			</div>

			<nav
				class="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible"
				aria-label="Navigasi admin"
			>
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						aria-current={isActive(item.href) ? 'page' : undefined}
						class="shrink-0 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:shrink {isActive(
							item.href
						)
							? 'bg-ivory/10 text-gold-light'
							: 'text-ivory/65 hover:bg-ivory/5 hover:text-ivory'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<div class="hidden border-t border-ivory/10 px-5 py-4 lg:block">
				<p class="text-xs text-ivory/45">Masuk sebagai</p>
				<p class="mt-1 truncate text-sm font-medium text-ivory">{data.user?.email ?? '-'}</p>
				<div class="mt-4 flex items-center justify-between gap-2">
					<a href={resolve('id')} class="text-xs font-semibold text-gold-light hover:text-ivory">
						Lihat situs
					</a>
					<form method="POST" action={resolve('admin/logout')}>
						<button type="submit" class="text-xs font-semibold text-ivory/60 hover:text-ivory">
							Keluar
						</button>
					</form>
				</div>
			</div>
		</aside>

		<div class="min-w-0">
			<header
				class="flex items-center justify-between gap-4 border-b border-navy/10 bg-ivory/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"
			>
				<div>
					<p class="text-[0.65rem] font-semibold tracking-[0.24em] text-navy/40 uppercase">
						Panel pengelolaan
					</p>
					<p class="font-display text-lg text-navy">Pura Batuan Kaler 360</p>
				</div>
				<div class="flex items-center gap-3 lg:hidden">
					<span class="max-w-32 truncate text-xs text-charcoal/50">{data.user?.email ?? '-'}</span>
					<form method="POST" action={resolve('admin/logout')}>
						<button
							type="submit"
							class="rounded-full border border-navy/15 px-3 py-2 text-xs font-semibold text-navy"
						>
							Keluar
						</button>
					</form>
				</div>
			</header>

			<main class="p-4 sm:p-6 lg:p-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
