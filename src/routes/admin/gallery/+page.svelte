<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let selectedIds = $state<string[]>([]);
	let confirmDialog: HTMLDialogElement | undefined = $state();
	let formElement: HTMLFormElement | undefined = $state();

	const draftItems = $derived(data.items.filter((item) => item.status === 'draft'));
	const selectedDraftIds = $derived(
		selectedIds.filter((id) => draftItems.some((item) => item.id === id))
	);
	const allDraftsSelected = $derived(
		draftItems.length > 0 && selectedDraftIds.length === draftItems.length
	);
	const bulkResult = $derived(form && 'bulkResult' in form ? form.bulkResult : null);
	const bulkMessage = $derived(form && 'bulkMessage' in form ? form.bulkMessage : null);

	function title(item: (typeof data.items)[number]): string {
		return item.translations.id.title.trim() || 'Foto tanpa judul';
	}

	function updatedLabel(item: (typeof data.items)[number]): string {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(item.updatedAt));
	}

	function toggleAll(event: Event): void {
		const input = event.currentTarget;

		selectedIds =
			input instanceof HTMLInputElement && input.checked ? draftItems.map((item) => item.id) : [];
	}

	function openPublishDialog(): void {
		if (selectedDraftIds.length === 0 || !confirmDialog || confirmDialog.open) return;

		confirmDialog.showModal();
	}

	function closePublishDialog(): void {
		confirmDialog?.close();
	}

	function confirmPublish(): void {
		confirmDialog?.close();
		formElement?.requestSubmit();
	}

	function handlePublishClick(event: MouseEvent): void {
		event.preventDefault();
		openPublishDialog();
	}
</script>

<svelte:head>
	<title>Galeri | Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<p class="eyebrow">Media</p>
			<h1 class="display-lg mt-4 text-heading">Galeri</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Kelola foto dokumentasi kawasan pura yang tampil di halaman galeri publik.
			</p>
		</div>
		<a href={resolve('admin/gallery/new')} class="btn btn--primary btn--sm w-fit">
			Tambah foto
			<Icon name="plus" class="h-3.5 w-3.5" />
		</a>
	</header>

	{#if data.publishedCount > 0}
		<div class="alert alert--success" role="status">
			{data.publishedCount} foto berhasil dipublikasikan.
		</div>
	{/if}

	{#if bulkResult}
		<div
			class="alert {bulkResult.failed.length > 0 ? 'alert--warning' : 'alert--success'}"
			role="status"
		>
			<p>
				{bulkResult.published} foto dipublikasikan
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

	{#if data.items.length === 0}
		<div class="surface flex flex-col items-center px-5 py-16 text-center">
			<span
				class="flex h-12 w-12 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
			>
				<Icon name="image" class="h-5 w-5 text-heading/35" />
			</span>
			<p class="mt-5 text-sm text-muted">Belum ada foto galeri.</p>
			<a href={resolve('admin/gallery/new')} class="btn btn--outline btn--sm mt-5">
				Unggah foto pertama
			</a>
		</div>
	{:else}
		<form bind:this={formElement} method="POST" action="?/bulkPublish">
			<div
				class="flex flex-col gap-3 border-b border-charcoal/10 bg-sand/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
			>
				{#if draftItems.length > 0}
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
							{selectedDraftIds.length} foto dipilih
						</span>
						<button
							type="submit"
							class="btn btn--gold btn--sm"
							disabled={selectedDraftIds.length === 0}
							onclick={handlePublishClick}
						>
							Tayangkan terpilih
							<Icon name="upload" class="h-3.5 w-3.5" />
						</button>
					</div>
				{:else}
					<p class="text-xs text-muted">Semua foto sudah tayang.</p>
				{/if}
			</div>

			<div class="grid gap-5 py-5 sm:grid-cols-2 xl:grid-cols-3">
				{#each data.items as item (item.id)}
					<article class="surface overflow-hidden">
						<div class="relative">
							{#if item.status === 'draft'}
								<label
									class="absolute top-3 left-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md bg-paper/85"
								>
									<input
										type="checkbox"
										name="itemIds"
										value={item.id}
										bind:group={selectedIds}
										aria-label={`Pilih foto ${title(item)}`}
										class="h-5 w-5 rounded border-charcoal/30 text-gold-dark focus:ring-gold-dark"
									/>
								</label>
							{/if}
							<img
								src={item.imagePath}
								alt=""
								class="aspect-[4/3] w-full object-cover"
								loading="lazy"
							/>
						</div>
						<div class="p-5">
							<div class="flex flex-wrap items-center gap-2">
								<p class="line-clamp-1 text-sm font-semibold text-heading">{title(item)}</p>
								<span
									class="badge {item.status === 'published' ? 'badge--published' : 'badge--draft'}"
								>
									{item.status === 'published' ? 'Tayang' : 'Draf'}
								</span>
							</div>
							<p class="mt-1.5 text-xs text-muted">
								Urutan {item.sortOrder} · Diperbarui {updatedLabel(item)}
							</p>
							<div class="mt-4 flex flex-wrap items-center gap-3">
								{#if item.status === 'published'}
									<a
										href={localeHref('id', '/galeri')}
										class="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-heading"
									>
										<Icon name="eye" class="h-3.5 w-3.5" />
										Lihat
									</a>
								{/if}
								<a
									href={resolve(`admin/gallery/${item.id}`)}
									class="inline-flex items-center gap-1.5 text-xs font-semibold text-heading transition-colors hover:text-gold-dark"
								>
									Edit
									<Icon name="arrow-right" class="h-3.5 w-3.5" />
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</form>
	{/if}
</div>

<dialog
	bind:this={confirmDialog}
	class="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-lg border border-charcoal/10 bg-paper p-0 text-heading shadow-lift"
	aria-labelledby="gallery-publish-title"
	aria-describedby="gallery-publish-description"
>
	<div class="p-5 sm:p-6">
		<div class="flex items-start gap-3">
			<span
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark"
				aria-hidden="true"
			>
				<Icon name="upload" class="h-5 w-5" />
			</span>
			<div class="min-w-0">
				<h2 id="gallery-publish-title" class="title-sm text-heading">Tayangkan foto terpilih?</h2>
				<p id="gallery-publish-description" class="mt-2 text-sm leading-relaxed text-muted">
					{selectedDraftIds.length} foto akan tampil di galeri publik. Foto tanpa judul tidak akan dipublikasikan.
				</p>
			</div>
		</div>
		<div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<button type="button" class="btn btn--outline btn--sm" onclick={closePublishDialog}>
				Batal
			</button>
			<button type="button" class="btn btn--gold btn--sm" onclick={confirmPublish}>
				Ya, tayangkan
				<Icon name="check" class="h-3.5 w-3.5" />
			</button>
		</div>
	</div>
</dialog>
