<script lang="ts">
	import { page } from '$app/state';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref, localizePath, otherLocale, type Locale } from '#lib/i18n/index.ts';
	import TempleMark from './TempleMark.svelte';

	let { lang }: { lang: Locale } = $props();

	const content = $derived(dictionary[lang]);
	const currentPath = $derived(page.url.pathname);
	const targetLocale = $derived(otherLocale(lang));
	const switchHref = $derived(localizePath(currentPath, targetLocale));

	function href(path: string) {
		return localeHref(lang, path);
	}

	function isActive(path: string): boolean {
		if (path === '') {
			return currentPath === href('');
		}

		return currentPath === href(path) || currentPath.startsWith(`${href(path)}/`);
	}

	function closeMenu(event: MouseEvent): void {
		const target = event.currentTarget;

		if (target instanceof HTMLAnchorElement) {
			target.closest('details')?.removeAttribute('open');
		}
	}
</script>

<header class="sticky top-0 z-50 border-b border-navy/10 bg-ivory/90 backdrop-blur-md">
	<div class="container-page flex h-20 items-center justify-between gap-4">
		<a
			href={href('')}
			class="group flex shrink-0 items-center gap-3"
			aria-label="Pura Batuan Kaler 360"
		>
			<TempleMark class="h-9 w-9 text-navy transition-colors group-hover:text-gold-dark" />
			<span class="font-display text-lg leading-none text-navy sm:text-xl">
				Batuan Kaler <span class="text-gold-dark">360</span>
			</span>
		</a>

		<nav class="hidden items-center gap-7 lg:flex" aria-label={content.common.navigation}>
			{#each content.nav as item (item.path)}
				<a
					href={href(item.path)}
					aria-current={isActive(item.path) ? 'page' : undefined}
					class="text-sm font-medium transition-colors {isActive(item.path)
						? 'text-gold-dark'
						: 'text-navy/70 hover:text-navy'}"
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<a
				href={switchHref}
				class="rounded-full border border-navy/15 px-3 py-2 text-xs font-semibold tracking-wider text-navy uppercase transition-colors hover:border-gold-dark hover:text-gold-dark"
				aria-label={content.common.language}
				title={content.common.language}
			>
				{targetLocale.toUpperCase()}
			</a>

			<details class="group relative lg:hidden">
				<summary
					class="flex cursor-pointer list-none items-center gap-2 rounded-full border border-navy/15 px-3 py-2 text-xs font-semibold tracking-wider text-navy uppercase [&::-webkit-details-marker]:hidden"
				>
					{content.common.menu}
					<svg
						class="h-3.5 w-3.5 transition-transform group-open:rotate-180"
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="m4 6 4 4 4-4"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</summary>

				<div
					class="absolute right-0 mt-3 w-60 rounded-2xl border border-navy/10 bg-ivory p-2 shadow-xl"
				>
					<nav class="flex flex-col" aria-label={content.common.navigation}>
						{#each content.nav as item (item.path)}
							<a
								href={href(item.path)}
								onclick={closeMenu}
								aria-current={isActive(item.path) ? 'page' : undefined}
								class="rounded-xl px-4 py-3 text-sm font-medium transition-colors {isActive(
									item.path
								)
									? 'bg-navy/5 text-gold-dark'
									: 'text-navy/75 hover:bg-navy/5 hover:text-navy'}"
							>
								{item.label}
							</a>
						{/each}
					</nav>
				</div>
			</details>
		</div>
	</div>
</header>
