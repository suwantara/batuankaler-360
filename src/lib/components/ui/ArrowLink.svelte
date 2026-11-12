<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import Icon from './Icon.svelte';

	let {
		href,
		label,
		tone = 'dark'
	}: { href: ResolvedPathname; label: string; tone?: 'dark' | 'light' | 'muted' } = $props();

	const toneClass = $derived(
		tone === 'light' ? 'link-arrow--light' : tone === 'muted' ? 'link-arrow--muted' : ''
	);
</script>

<a {href} class="link-arrow {toneClass}">
	{label}
	<Icon name="arrow-right" class="h-3.5 w-3.5" />
</a>
