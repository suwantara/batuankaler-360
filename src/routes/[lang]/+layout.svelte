<script lang="ts">
	import SiteFooter from '#lib/components/public/SiteFooter.svelte';
	import SiteHeader from '#lib/components/public/SiteHeader.svelte';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const content = $derived(dictionary[data.lang]);
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-xs focus:bg-gold focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:tracking-[0.1em] focus:text-ink focus:uppercase"
>
	{content.common.skipToContent}
</a>

<div lang={data.lang} class="flex min-h-dvh flex-col">
	<SiteHeader lang={data.lang} />

	<main id="main-content" class="flex-1">
		{@render children()}
	</main>

	<SiteFooter lang={data.lang} />
</div>
