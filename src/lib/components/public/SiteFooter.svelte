<script lang="ts">
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref, type Locale } from '#lib/i18n/index.ts';
	import TempleMark from './TempleMark.svelte';

	let { lang }: { lang: Locale } = $props();

	const content = $derived(dictionary[lang]);
	const year = new Date().getFullYear();

	function href(path: string) {
		return localeHref(lang, path);
	}
</script>

<footer class="bg-navy text-ivory">
	<div class="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr]">
		<div>
			<div class="flex items-center gap-3">
				<TempleMark class="h-10 w-10 text-gold-light" />
				<span class="font-display text-2xl"
					>Batuan Kaler <span class="text-gold-light">360</span></span
				>
			</div>
			<p class="mt-6 max-w-md text-sm leading-relaxed text-ivory/60">
				{content.footer.description}
			</p>
		</div>

		<div>
			<h2 class="text-xs font-semibold tracking-[0.28em] text-gold-light uppercase">
				{content.footer.explore}
			</h2>
			<nav class="mt-5 flex flex-col gap-3" aria-label={content.common.footerNavigation}>
				{#each content.nav as item (item.path)}
					<a
						href={href(item.path)}
						class="text-sm text-ivory/70 transition-colors hover:text-ivory"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		<div>
			<h2 class="text-xs font-semibold tracking-[0.28em] text-gold-light uppercase">
				{content.footer.visit}
			</h2>
			<p class="mt-5 text-sm leading-relaxed text-ivory/60">{content.footer.note}</p>
			<p class="mt-4 text-sm leading-relaxed text-ivory/60">{content.home.guide.body}</p>
		</div>
	</div>

	<div class="border-t border-ivory/10">
		<div
			class="container-page flex flex-col gap-2 py-6 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {year} {content.footer.rights}</p>
			<p>{content.meta.title}</p>
		</div>
	</div>
</footer>
