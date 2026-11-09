<script lang="ts">
	let { class: className = 'h-8 w-8' }: { class?: string } = $props();
</script>

<svg class={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
	<path
		d="M9 42V21l6-4V9l9-6 9 6v8l6 4v21"
		stroke="currentColor"
		stroke-width="2"
		stroke-linejoin="round"
	/>
	<path
		d="M4 21h40M11 9h26M17 3h14"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
	/>
	<path
		d="M20 42V31a4 4 0 0 1 8 0v11"
		stroke="currentColor"
		stroke-width="2"
		stroke-linejoin="round"
	/>
	<path d="M9 42h30" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
</svg>
