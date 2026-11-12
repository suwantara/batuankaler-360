<script lang="ts">
	let {
		name,
		label,
		value,
		error = '',
		placeholder = '',
		hint = '',
		multiline = false,
		rows = 3,
		type = 'text',
		class: className = ''
	}: {
		name: string;
		label: string;
		value: string;
		error?: string;
		placeholder?: string;
		hint?: string;
		multiline?: boolean;
		rows?: number;
		type?: 'text' | 'url';
		class?: string;
	} = $props();
</script>

<label class="block {className}">
	<span class="field-label">{label}</span>

	{#if multiline}
		<textarea
			{name}
			{rows}
			{placeholder}
			class="field-input"
			aria-invalid={error ? 'true' : undefined}>{value}</textarea
		>
	{:else}
		<input
			{name}
			{type}
			{value}
			{placeholder}
			class="field-input"
			aria-invalid={error ? 'true' : undefined}
		/>
	{/if}

	{#if hint}<span class="field-help">{hint}</span>{/if}
	{#if error}<p class="field-error">{error}</p>{/if}
</label>
