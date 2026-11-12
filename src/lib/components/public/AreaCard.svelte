<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import Icon from '#lib/components/ui/Icon.svelte';

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
					row: 'border-ivory/12 hover:bg-ivory/[0.03]',
					number: 'text-gold-light/50',
					title: 'text-ivory group-hover:text-gold-light',
					body: 'text-ivory/55',
					arrow:
						'border-ivory/20 text-ivory/50 group-hover:border-gold-light/60 group-hover:text-gold-light'
				}
			: {
					row: 'border-charcoal/12 hover:bg-navy/[0.025]',
					number: 'text-gold-dark',
					title: 'text-navy group-hover:text-gold-dark',
					body: 'text-body',
					arrow:
						'border-navy/15 text-navy/45 group-hover:border-gold-dark/50 group-hover:text-gold-dark'
				}
	);
</script>

<a
	{href}
	class="group grid gap-3 border-t px-1 py-6 transition-colors sm:grid-cols-[3.5rem_1fr_2.5rem] sm:items-start sm:gap-6 sm:py-7 {toneClasses.row}"
>
	<span class="font-display text-lg leading-none {toneClasses.number}">
		{String(index + 1).padStart(2, '0')}
	</span>

	<span class="min-w-0">
		<span
			class="block font-display text-2xl leading-tight tracking-tight transition-colors sm:text-[1.65rem] {toneClasses.title}"
		>
			{name}
		</span>
		<span class="mt-2 block max-w-2xl text-sm leading-relaxed {toneClasses.body}">
			{description}
		</span>
	</span>

	<span
		class="hidden h-9 w-9 items-center justify-center rounded-full border transition-colors sm:flex {toneClasses.arrow}"
		aria-hidden="true"
	>
		<Icon name="arrow-up-right" class="h-4 w-4" />
	</span>
</a>
