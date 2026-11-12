<script lang="ts">
	import { page } from '$app/state';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref, localizePath, otherLocale, type Locale } from '#lib/i18n/index.ts';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';

	let { lang }: { lang: Locale } = $props();

	const content = $derived(dictionary[lang]);
	const currentPath = $derived(page.url.pathname);
	const targetLocale = $derived(otherLocale(lang));
	const switchHref = $derived(localizePath(currentPath, targetLocale));

	let menuOpen = $state(false);
	let trigger: HTMLButtonElement | undefined = $state();
	let closeButton: HTMLButtonElement | undefined = $state();
	let panel: HTMLDivElement | undefined = $state();

	function href(path: string) {
		return localeHref(lang, path);
	}

	function isActive(path: string): boolean {
		if (path === '') {
			return currentPath === href('');
		}

		return currentPath === href(path) || currentPath.startsWith(`${href(path)}/`);
	}

	function closeMenu(restoreFocus = false): void {
		menuOpen = false;

		if (restoreFocus) {
			trigger?.focus();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (!menuOpen) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			closeMenu(true);
			return;
		}

		if (event.key !== 'Tab' || !panel) return;

		const focusable = Array.from(
			panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
		).filter((element) => element.offsetParent !== null);

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	$effect(() => {
		if (!menuOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		closeButton?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<header class="sticky top-0 z-50 border-b border-charcoal/10 bg-paper/90 backdrop-blur-xl">
	<div class="container-page flex h-[4.75rem] items-center justify-between gap-6">
		<a href={href('')} class="shrink-0">
			<BrandLockup />
		</a>

		<nav class="hidden items-center gap-6 lg:flex" aria-label={content.common.navigation}>
			{#each content.nav as item (item.path)}
				<a
					href={href(item.path)}
					aria-current={isActive(item.path) ? 'page' : undefined}
					class="nav-link"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2 sm:gap-3">
			<a
				href={switchHref}
				class="inline-flex items-center gap-1.5 rounded-xs px-1 py-2 text-[0.6875rem] font-semibold tracking-[0.16em] text-navy/60 uppercase transition-colors hover:text-gold-dark"
				aria-label={content.common.language}
				title={content.common.language}
			>
				<Icon name="globe" class="h-4 w-4" />
				<span>{targetLocale.toUpperCase()}</span>
			</a>

			<span class="hidden h-4 w-px bg-navy/15 sm:block" aria-hidden="true"></span>

			<a href={href('/tour')} class="btn btn--primary btn--sm hidden lg:inline-flex">
				{content.nav[1].label}
				<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
			</a>

			<button
				type="button"
				bind:this={trigger}
				onclick={() => (menuOpen = true)}
				aria-expanded={menuOpen}
				aria-controls="mobile-navigation"
				aria-label={content.common.menu}
				class="inline-flex h-11 w-11 items-center justify-center rounded-xs border border-navy/15 text-navy transition-colors hover:border-gold-dark hover:text-gold-dark lg:hidden"
			>
				<Icon name="menu" class="h-5 w-5" />
			</button>
		</div>
	</div>
</header>

{#if menuOpen}
	<div
		bind:this={panel}
		id="mobile-navigation"
		role="dialog"
		aria-modal="true"
		aria-label={content.common.navigation}
		class="mobile-menu fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-navy-deep text-ivory"
	>
		<div
			class="container-page flex h-[4.75rem] shrink-0 items-center justify-between border-b border-ivory/10"
		>
			<a href={href('')} onclick={() => closeMenu()}>
				<BrandLockup tone="light" />
			</a>
			<button
				type="button"
				bind:this={closeButton}
				onclick={() => closeMenu(true)}
				aria-label={content.common.closeMenu}
				class="inline-flex h-11 w-11 items-center justify-center rounded-xs border border-ivory/20 text-ivory transition-colors hover:border-gold-light hover:text-gold-light"
			>
				<Icon name="close" class="h-5 w-5" />
			</button>
		</div>

		<nav
			class="container-page flex flex-1 flex-col justify-center py-10"
			aria-label={content.common.navigation}
		>
			{#each content.nav as item, index (item.path)}
				<a
					href={href(item.path)}
					onclick={() => closeMenu()}
					aria-current={isActive(item.path) ? 'page' : undefined}
					class="group flex items-center justify-between border-b border-ivory/10 py-4 first:border-t sm:py-5"
				>
					<span class="flex items-baseline gap-4 sm:gap-6">
						<span class="meta text-gold-light/60">0{index + 1}</span>
						<span
							class="font-display text-3xl leading-none tracking-tight transition-colors group-hover:text-gold-light sm:text-4xl {isActive(
								item.path
							)
								? 'text-gold-light'
								: 'text-ivory'}"
						>
							{item.label}
						</span>
					</span>
					<Icon
						name="arrow-up-right"
						class="h-5 w-5 text-ivory/30 transition-colors group-hover:text-gold-light"
					/>
				</a>
			{/each}
		</nav>

		<div class="container-page shrink-0 border-t border-ivory/10 py-5">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<a
					href={switchHref}
					onclick={() => closeMenu()}
					class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-ivory/60 uppercase transition-colors hover:text-gold-light"
				>
					<Icon name="globe" class="h-4 w-4" />
					{targetLocale === 'en' ? 'English' : 'Bahasa Indonesia'}
				</a>
				<p class="max-w-xs text-xs leading-relaxed text-ivory/55">{content.footer.note}</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.mobile-menu {
		animation: menu-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateY(-0.75rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mobile-menu {
			animation: none;
		}
	}
</style>
