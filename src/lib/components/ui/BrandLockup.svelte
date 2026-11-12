<script lang="ts">
	import TempleMark from '../public/TempleMark.svelte';

	let {
		tone = 'dark',
		tagline = false,
		class: className = ''
	}: { tone?: 'dark' | 'light'; tagline?: boolean; class?: string } = $props();

	const nameClass = $derived(tone === 'light' ? 'text-ivory' : 'text-heading');
	const accentClass = $derived(tone === 'light' ? 'text-gold-light' : 'text-gold-dark');
	const taglineClass = $derived(tone === 'light' ? 'text-ivory/60' : 'text-heading/55');
</script>

<span class="flex items-center gap-3 {className}">
	<TempleMark class="h-9 w-9 shrink-0 {tone === 'light' ? 'text-gold-light' : 'text-heading'}" />
	<span class="min-w-0">
		<span class="block font-display text-[1.12rem] leading-none tracking-tight {nameClass}">
			Batuan Kaler <span class={accentClass}>360</span>
		</span>
		{#if tagline}
			<span
				class="mt-1.5 block text-[0.55rem] font-semibold tracking-[0.26em] uppercase {taglineClass}"
			>
				Pura · Virtual Tour
			</span>
		{/if}
	</span>
</span>
