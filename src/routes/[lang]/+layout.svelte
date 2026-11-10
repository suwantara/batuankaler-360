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
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ivory"
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
