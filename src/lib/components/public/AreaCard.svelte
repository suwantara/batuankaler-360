<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import TempleMark from './TempleMark.svelte';

	let {
		name,
		description,
		index,
		href,
		tone = 'dark'
	}: {
		name: string;
		description: string;
		index: number;
		href: ResolvedPathname;
		tone?: 'dark' | 'light';
	} = $props();

	const toneClasses = $derived(
		tone === 'dark'
			? {
					card: 'border-ivory/10 bg-ivory/5 hover:border-gold/50',
					number: 'text-gold-light/60',
					title: 'text-ivory',
					body: 'text-ivory/60',
					mark: 'text-ivory/10'
				}
			: {
					card: 'border-navy/10 bg-ivory hover:border-gold-dark/60',
					number: 'text-gold-dark/70',
					title: 'text-navy',
					body: 'text-charcoal/65',
					mark: 'text-navy/10'
				}
	);
</script>

<a
	{href}
	class="group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-colors {toneClasses.card}"
>
	<TempleMark class="absolute -top-4 -right-4 h-28 w-28 {toneClasses.mark}" />
	<span class="font-display text-5xl {toneClasses.number}">
		{String(index + 1).padStart(2, '0')}
	</span>
	<h3 class="mt-10 font-display text-2xl {toneClasses.title}">{name}</h3>
	<p class="mt-3 flex-1 text-sm leading-relaxed {toneClasses.body}">{description}</p>
	<span
		class="mt-6 text-sm font-semibold {tone === 'dark' ? 'text-gold-light' : 'text-navy'}"
		aria-hidden="true"
	>
		→
	</span>
</a>
