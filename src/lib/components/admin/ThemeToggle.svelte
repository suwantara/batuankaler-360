<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { applyAdminTheme, resolveAdminTheme, type AdminTheme } from '#lib/admin/theme.ts';

	let { class: className = '' }: { class?: string } = $props();

	let theme = $state<AdminTheme>(
		browser && document.documentElement.dataset.adminTheme === 'dark' ? 'dark' : 'light'
	);

	const label = $derived(theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');

	onMount(() => {
		theme = resolveAdminTheme();
		document.documentElement.dataset.adminTheme = theme;
	});

	function toggle(): void {
		theme = theme === 'dark' ? 'light' : 'dark';
		applyAdminTheme(theme);
	}
</script>

<button
	type="button"
	onclick={toggle}
	aria-label={label}
	title={label}
	aria-pressed={theme === 'dark'}
	class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line/15 text-heading transition-colors hover:border-gold-dark hover:text-gold-dark {className}"
>
	<span class="theme-icon--moon">
		<Icon name="moon" class="h-4 w-4" />
	</span>
	<span class="theme-icon--sun">
		<Icon name="sun" class="h-4 w-4" />
	</span>
</button>
