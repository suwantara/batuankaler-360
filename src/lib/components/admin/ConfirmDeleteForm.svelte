<script lang="ts">
	import ConfirmDialog from './ConfirmDialog.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';

	interface Props {
		action: string;
		fields: Record<string, string | number>;
		buttonLabel: string;
		confirmTitle: string;
		confirmDescription?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		buttonClass?: string;
		formClass?: string;
		buttonTestId?: string;
		icon?: IconName;
	}

	let {
		action,
		fields,
		buttonLabel,
		confirmTitle,
		confirmDescription = '',
		confirmLabel = 'Hapus',
		cancelLabel = 'Batal',
		buttonClass = 'btn btn--danger btn--sm',
		formClass = '',
		buttonTestId,
		icon = 'trash'
	}: Props = $props();

	let form: HTMLFormElement | undefined = $state();
	let confirmOpen = $state(false);

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		confirmOpen = true;
	}

	function handleConfirm(): void {
		confirmOpen = false;
		form?.submit();
	}
</script>

<form bind:this={form} method="POST" {action} class={formClass} onsubmit={handleSubmit}>
	{#each Object.entries(fields) as [name, value] (name)}
		<input type="hidden" {name} value={String(value)} />
	{/each}
	<button type="submit" class={buttonClass} data-testid={buttonTestId}>
		{buttonLabel}
		<Icon name={icon} class="h-3.5 w-3.5" />
	</button>
</form>

<ConfirmDialog
	open={confirmOpen}
	title={confirmTitle}
	description={confirmDescription}
	{confirmLabel}
	{cancelLabel}
	onconfirm={handleConfirm}
	oncancel={() => (confirmOpen = false)}
/>
