<script lang="ts">
	import { page } from '$app/state';
	import ErrorPanel from '#lib/components/ui/ErrorPanel.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';

	const lang = $derived(
		page.url.pathname === '/en' || page.url.pathname.startsWith('/en/') ? 'en' : 'id'
	);
	const labels = $derived(dictionary[lang].errorPage);
</script>

<svelte:head>
	<title>{labels.eyebrow} {page.status} — Pura Batuan Kaler 360</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<ErrorPanel status={page.status} {lang} />
