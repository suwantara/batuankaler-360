<script lang="ts">
	import { page } from '$app/state';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localizePath, localeHref, otherLocale, type Locale } from '#lib/i18n/index.ts';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Ornament from '#lib/components/ui/Ornament.svelte';

	let { lang }: { lang: Locale } = $props();

	const content = $derived(dictionary[lang]);
	const targetLocale = $derived(otherLocale(lang));
	const switchHref = $derived(localizePath(page.url.pathname, targetLocale));
	const year = new Date().getFullYear();

	function href(path: string) {
		return localeHref(lang, path);
	}
</script>

<footer class="dark-surface relative overflow-hidden">
	<div
		class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
		aria-hidden="true"
	></div>

	<section class="container-page grid gap-10 py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:py-20">
		<div class="max-w-2xl">
			<p class="eyebrow">{content.footer.cta.eyebrow}</p>
			<h2 class="display-lg mt-5 text-ivory">{content.footer.cta.title}</h2>
			<p class="mt-5 max-w-xl text-sm leading-relaxed text-ivory/55">
				{content.footer.cta.body}
			</p>
		</div>
		<a href={href('/tour')} class="btn btn--gold w-fit">
			{content.actions.exploreTour}
			<Icon name="arrow-up-right" class="h-4 w-4" />
		</a>
	</section>

	<div class="border-t border-ivory/10">
		<div class="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_0.8fr_1fr]">
			<div>
				<a href={href('')}>
					<BrandLockup tone="light" tagline />
				</a>
				<p class="mt-7 max-w-md text-sm leading-relaxed text-ivory/55">
					{content.footer.description}
				</p>
				<div class="mt-7 flex items-center gap-4">
					<Ornament class="h-3 w-40 text-gold/45" />
				</div>
			</div>

			<div>
				<h2 class="meta text-gold-light/75">{content.footer.explore}</h2>
				<nav class="mt-5 flex flex-col gap-3" aria-label={content.common.footerNavigation}>
					{#each content.nav as item (item.path)}
						<a
							href={href(item.path)}
							class="group inline-flex w-fit items-center gap-2 py-1.5 text-sm text-ivory/60 transition-colors hover:text-ivory"
						>
							<span
								class="h-px w-0 bg-gold-light transition-all duration-200 group-hover:w-3"
								aria-hidden="true"
							></span>
							{item.label}
						</a>
					{/each}
				</nav>
			</div>

			<div>
				<h2 class="meta text-gold-light/75">{content.footer.visit}</h2>
				<p class="mt-5 text-sm leading-relaxed text-ivory/55">{content.footer.note}</p>
				<p class="mt-4 text-sm leading-relaxed text-ivory/55">{content.home.guide.body}</p>
				<a
					href={switchHref}
					class="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-gold-light uppercase transition-colors hover:text-ivory"
				>
					<Icon name="globe" class="h-4 w-4" />
					{targetLocale === 'en' ? 'English' : 'Bahasa Indonesia'}
				</a>
			</div>
		</div>
	</div>

	<div class="border-t border-ivory/10">
		<div
			class="container-page flex flex-col gap-3 py-6 text-[0.6875rem] tracking-[0.06em] text-ivory/55 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {year} {content.footer.rights}</p>
			<p>{content.meta.title}</p>
		</div>
	</div>

	<div class="container-page relative overflow-hidden pt-4 pb-8" aria-hidden="true">
		<p class="watermark">Batuan Kaler</p>
	</div>
</footer>
