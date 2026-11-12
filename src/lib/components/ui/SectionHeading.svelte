<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow,
		title,
		description,
		tone = 'dark',
		align = 'left',
		action
	}: {
		eyebrow: string;
		title: string;
		description?: string;
		tone?: 'dark' | 'light';
		align?: 'left' | 'center';
		action?: Snippet;
	} = $props();

	const titleClass = $derived(tone === 'light' ? 'text-ivory' : 'text-navy');
	const descriptionClass = $derived(tone === 'light' ? 'text-ivory/65' : 'text-body');
</script>

<div
	class="flex flex-col gap-7 {align === 'center'
		? 'items-center text-center'
		: 'sm:flex-row sm:items-end sm:justify-between'}"
>
	<div class="max-w-2xl {align === 'center' ? 'flex flex-col items-center' : ''}">
		<p class="eyebrow">{eyebrow}</p>
		<h2 class="display-lg mt-5 {titleClass}">{title}</h2>
		{#if description}
			<p class="lede mt-5 max-w-xl {descriptionClass}">{description}</p>
		{/if}
	</div>
	{#if action}
		<div class="shrink-0">{@render action()}</div>
	{/if}
</div>
