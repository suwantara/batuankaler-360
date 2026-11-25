<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let selectedIds = $state<string[]>([]);
	let confirmDialog: HTMLDialogElement | undefined = $state();
	let formElement: HTMLFormElement | undefined = $state();

	const draftScenes = $derived(data.scenes.filter((scene) => scene.status === 'draft'));
	const selectedDraftIds = $derived(
		selectedIds.filter((id) => draftScenes.some((scene) => scene.id === id))
	);
	const allDraftsSelected = $derived(
		draftScenes.length > 0 && selectedDraftIds.length === draftScenes.length
	);
	const bulkResult = $derived(form && 'bulkResult' in form ? form.bulkResult : null);
	const bulkMessage = $derived(form && 'bulkMessage' in form ? form.bulkMessage : null);

	function title(scene: (typeof data.scenes)[number]): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.slug;
	}

	function toggleAll(event: Event): void {
		const input = event.currentTarget;

		selectedIds =
			input instanceof HTMLInputElement && input.checked
				? draftScenes.map((scene) => scene.id)
				: [];
	}

	function openPublishDialog(): void {
		if (selectedDraftIds.length === 0 || !confirmDialog || confirmDialog.open) return;

		confirmDialog.showModal();
	}

	function handlePublishClick(event: MouseEvent): void {
		event.preventDefault();
		openPublishDialog();
	}

	function closePublishDialog(): void {
		confirmDialog?.close();
	}

	function confirmPublish(): void {
		confirmDialog?.close();
		formElement?.requestSubmit();
	}

	$effect(() => {
		if (bulkResult) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	});
</script>

<svelte:head>
	<title>Scene | Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Konten</p>
			<h1 class="display-lg mt-4 text-heading">Scene</h1>
			<p class="body-copy mt-3 max-w-2xl">Kelola scene panorama, status publikasi, dan hotspot.</p>
		</div>
		<a href={resolve('admin/scenes/new')} class="btn btn--primary btn--sm w-fit">
			Tambah scene
			<Icon name="plus" class="h-3.5 w-3.5" />
		</a>
	</header>

	{#if data.publishedCount > 0}
		<div class="alert alert--success" role="status">
			{data.publishedCount} scene berhasil dipublikasikan.
		</div>
	{/if}

	{#if bulkResult}
		<div
			class="alert {bulkResult.failed.length > 0 ? 'alert--warning' : 'alert--success'}"
			role="status"
		>
			<p>
				{bulkResult.published} scene dipublikasikan
				{#if bulkResult.alreadyPublished > 0}
					· {bulkResult.alreadyPublished} sudah tayang
				{/if}
				{#if bulkResult.failed.length > 0}
					· {bulkResult.failed.length} gagal
				{/if}
			</p>
			{#if bulkResult.failed.length > 0}
				<ul class="mt-2 list-disc space-y-1 pl-5 text-xs">
					{#each bulkResult.failed as failure (failure.id)}
						<li><strong>{failure.title}</strong>: {failure.errors.join(' ')}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	{#if bulkMessage}
		<div class="alert alert--error" role="alert">{bulkMessage}</div>
	{/if}

	<div class="surface overflow-hidden">
		{#if data.scenes.length === 0}
			<div class="flex flex-col items-center px-5 py-16 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
				>
					<Icon name="layers" class="h-5 w-5 text-heading/35" />
				</span>
				<p class="mt-5 text-sm text-muted">Belum ada scene.</p>
				<a href={resolve('admin/scenes/new')} class="btn btn--outline btn--sm mt-5">
					Buat scene pertama
				</a>
			</div>
		{:else}
			<form bind:this={formElement} method="POST" action="?/bulkPublish">
				<div
					class="flex flex-col gap-3 border-b border-charcoal/10 bg-sand/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
				>
					{#if draftScenes.length > 0}
						<label class="flex items-center gap-2 text-xs font-medium text-heading">
							<input
								type="checkbox"
								checked={allDraftsSelected}
								onchange={toggleAll}
								class="h-4 w-4 rounded border-charcoal/30 text-gold-dark focus:ring-gold-dark"
							/>
							Pilih semua draf
						</label>
						<div class="flex flex-wrap items-center gap-3">
							<span class="text-xs text-muted" aria-live="polite">
								{selectedDraftIds.length} scene dipilih
							</span>
							<button
								type="submit"
								class="btn btn--gold btn--sm"
								disabled={selectedDraftIds.length === 0}
								onclick={handlePublishClick}
							>
								Publikasikan terpilih
								<Icon name="check" class="h-3.5 w-3.5" />
							</button>
						</div>
					{:else}
						<p class="text-xs text-muted">Semua scene sudah tayang.</p>
					{/if}
				</div>

				<div class="divide-y divide-charcoal/10">
					{#each data.scenes as scene (scene.id)}
						<div
							class="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between"
						>
							<div class="flex min-w-0 items-center gap-4">
								{#if scene.status === 'draft'}
									<input
										type="checkbox"
										name="sceneIds"
										value={scene.id}
										bind:group={selectedIds}
										aria-label={`Pilih ${title(scene)}`}
										class="h-4 w-4 shrink-0 rounded border-charcoal/30 text-gold-dark focus:ring-gold-dark"
									/>
								{:else}
									<span class="h-4 w-4 shrink-0" aria-hidden="true"></span>
								{/if}
								{#if scene.panoramaAsset}
									<img
										src={scene.panoramaAsset.thumbnailPath}
										alt=""
										class="h-14 w-20 shrink-0 border border-charcoal/10 object-cover"
										loading="lazy"
									/>
								{:else}
									<div
										class="flex h-14 w-20 shrink-0 items-center justify-center border border-charcoal/10 bg-sand text-[0.55rem] tracking-wider text-charcoal/35 uppercase"
									>
										Tanpa aset
									</div>
								{/if}
								<div class="min-w-0">
									<p class="truncate text-sm font-semibold text-heading">{title(scene)}</p>
									<p class="mt-0.5 truncate text-xs text-muted">/{scene.slug}</p>
									<p
										class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] text-muted"
									>
										<span>{scene.hotspots.length} hotspot</span>
										<span class="h-1 w-1 rounded-full bg-charcoal/20" aria-hidden="true"></span>
										<span>
											{scene.area
												? (scene.area.translations.find((item) => item.locale === 'id')?.title ??
													scene.area.slug)
												: 'Tanpa area'}
										</span>
									</p>
								</div>
							</div>

							<div class="flex flex-wrap items-center gap-3 sm:pl-24 lg:justify-end lg:pl-0">
								<span
									class="badge {scene.status === 'published' ? 'badge--published' : 'badge--draft'}"
								>
									{scene.status === 'published' ? 'Tayang' : 'Draf'}
								</span>
								<a
									href={resolve(`admin/scenes/${scene.id}/hotspots`)}
									class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
								>
									<Icon name="map-pin" class="h-3.5 w-3.5" />
									Hotspot
								</a>
								<a
									href={resolve(`admin/scenes/${scene.id}`)}
									class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
								>
									Edit
									<Icon name="arrow-right" class="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					{/each}
				</div>
			</form>
		{/if}
	</div>
</div>

<dialog
	bind:this={confirmDialog}
	class="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-charcoal/10 bg-paper p-0 text-heading shadow-lift backdrop:bg-ink/60"
	aria-labelledby="bulk-publish-title"
	aria-describedby="bulk-publish-description"
>
	<div class="p-5 sm:p-6">
		<div class="flex items-start gap-3">
			<span
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark"
				aria-hidden="true"
			>
				<Icon name="check" class="h-5 w-5" />
			</span>
			<div class="min-w-0">
				<h2 id="bulk-publish-title" class="title-sm text-heading">Publikasikan scene terpilih?</h2>
				<p id="bulk-publish-description" class="mt-2 text-sm leading-relaxed text-muted">
					{selectedDraftIds.length} scene akan ditayangkan di situs publik. Pastikan judul, deskripsi,
					dan hotspot sudah siap.
				</p>
			</div>
		</div>
		<div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<button type="button" class="btn btn--outline btn--sm" onclick={closePublishDialog}>
				Batal
			</button>
			<button type="button" class="btn btn--gold btn--sm" onclick={confirmPublish}>
				Ya, publikasikan
				<Icon name="check" class="h-3.5 w-3.5" />
			</button>
		</div>
	</div>
</dialog>
