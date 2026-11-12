<script lang="ts">
	import type { IconName } from '#lib/components/ui/icons.ts';
	import Icon from '#lib/components/ui/Icon.svelte';

	let {
		name,
		label,
		onclick,
		class: className = ''
	}: {
		name: IconName;
		label: string;
		onclick?: (event: MouseEvent) => void;
		class?: string;
	} = $props();
</script>

<button
	type="button"
	{onclick}
	aria-label={label}
	title={label}
	class="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 bg-charcoal/45 text-ivory backdrop-blur-md transition-colors hover:border-gold-light/70 hover:text-gold-light {className}"
>
	<Icon {name} class="h-4 w-4" />
</button>
