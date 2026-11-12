<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import ErrorPanel from '#lib/components/ui/ErrorPanel.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';

	const isEnglish = $derived(page.url.pathname === '/en' || page.url.pathname.startsWith('/en/'));
	const lang = $derived(isEnglish ? 'en' : 'id');
	const audience = $derived(page.url.pathname.startsWith('/admin') ? 'admin' : 'public');
	const labels = $derived(dictionary[lang].errorPage);
	const homeHref = $derived(resolve(isEnglish ? 'en' : 'id'));
</script>

<svelte:head>
	<title>{labels.eyebrow} {page.status} — Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div {lang} class="flex min-h-dvh flex-col bg-paper">
	<header class="border-b border-charcoal/10">
		<div class="container-page flex h-[4.75rem] items-center justify-between gap-6">
			<a href={homeHref}>
				<BrandLockup />
			</a>
			<span class="badge badge--quiet">{labels.eyebrow} {page.status}</span>
		</div>
	</header>

	<main class="flex flex-1 items-center">
		<ErrorPanel status={page.status} {lang} {audience} />
	</main>

	<footer class="border-t border-charcoal/10">
		<div
			class="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-[0.65rem] tracking-[0.1em] text-muted uppercase"
		>
			<span>{labels.standaloneFooter}</span>
			<span>Pura Batuan Kaler 360</span>
		</div>
	</footer>
</div>
