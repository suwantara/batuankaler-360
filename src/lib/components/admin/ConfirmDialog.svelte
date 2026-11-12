<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		onconfirm: () => void;
		oncancel: () => void;
	}

	let {
		open,
		title,
		description = '',
		confirmLabel = 'Hapus',
		cancelLabel = 'Batal',
		onconfirm,
		oncancel
	}: Props = $props();

	const id = $props.id();
	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialog) return;

		if (open) {
			if (!dialog.open) dialog.showModal();
		} else if (dialog.open) {
			dialog.close();
		}
	});

	function cancel(): void {
		oncancel();
	}

	function handleCancel(event: Event): void {
		event.preventDefault();
		cancel();
	}
</script>

<dialog
	bind:this={dialog}
	class="confirm-dialog surface m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100vw-2rem))] overflow-y-auto p-0 text-heading shadow-lift"
	aria-labelledby={`${id}-title`}
	aria-describedby={description ? `${id}-description` : undefined}
	oncancel={handleCancel}
>
	<div class="p-5 sm:p-6">
		<div class="flex items-start gap-3">
			<span
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger"
				aria-hidden="true"
			>
				<Icon name="alert" class="h-5 w-5" />
			</span>
			<div class="min-w-0">
				<h2 id={`${id}-title`} class="title-sm text-heading">{title}</h2>
				{#if description}
					<p id={`${id}-description`} class="mt-2 text-sm leading-relaxed text-muted">
						{description}
					</p>
				{/if}
			</div>
		</div>

		<div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<button type="button" class="btn btn--outline btn--sm w-full sm:w-auto" onclick={cancel}>
				{cancelLabel}
			</button>
			<button type="button" class="btn btn--danger btn--sm w-full sm:w-auto" onclick={onconfirm}>
				{confirmLabel}
			</button>
		</div>
	</div>
</dialog>

<style>
	.confirm-dialog::backdrop {
		background-color: rgb(20 24 41 / 0.55);
		backdrop-filter: blur(4px);
	}

	@media (prefers-reduced-motion: no-preference) {
		.confirm-dialog[open] {
			animation: dialog-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
		}

		.confirm-dialog[open]::backdrop {
			animation: backdrop-in 180ms ease-out both;
		}
	}

	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: translateY(0.5rem) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
