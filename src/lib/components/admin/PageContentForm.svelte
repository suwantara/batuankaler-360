<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { SitePageBlockFormValues, SitePageFormValues } from '#lib/schemas/site-page.ts';
	import VisitField from './VisitField.svelte';

	let {
		values,
		errors = {},
		action
	}: {
		values: SitePageFormValues;
		errors?: Record<string, string>;
		action: string;
	} = $props();

	type BlockDraft = SitePageBlockFormValues & { key: string };
	type PageDraft = Omit<SitePageFormValues, 'blocks'> & { blocks: BlockDraft[] };

	let nextKey = 0;

	function withKeys(blocks: SitePageBlockFormValues[]): BlockDraft[] {
		return blocks.map((block) => ({
			...block,
			key: block.id ?? `new-${nextKey++}`
		}));
	}

	// Local editable copy of server values; reset when a form action returns new values.
	// svelte-ignore state_referenced_locally
	// eslint-disable-next-line svelte/prefer-writable-derived
	let form = $state<PageDraft>({ ...values, blocks: withKeys(values.blocks) });

	$effect(() => {
		form = { ...values, blocks: withKeys(values.blocks) };
	});

	const blocksPayload = $derived(JSON.stringify(form.blocks));
	const blockError = $derived(
		Object.entries(errors).find(([key]) => key === 'blocks' || key.startsWith('blocks.'))?.[1] ?? ''
	);

	function addBlock(): void {
		form.blocks.push({
			id: null,
			type: 'section',
			headingId: '',
			bodyId: '',
			headingEn: '',
			bodyEn: '',
			key: `new-${nextKey++}`
		});
	}

	function removeBlock(index: number): void {
		form.blocks.splice(index, 1);
	}

	function moveBlock(index: number, direction: number): void {
		const target = index + direction;

		if (target < 0 || target >= form.blocks.length) return;

		const [block] = form.blocks.splice(index, 1);
		if (block) form.blocks.splice(target, 0, block);
	}

	function headingLabel(type: SitePageBlockFormValues['type']): string {
		if (type === 'quote') return 'Judul kutipan (opsional)';
		if (type === 'source') return 'Judul sumber (opsional)';
		return 'Subjudul';
	}

	function bodyLabel(type: SitePageBlockFormValues['type']): string {
		if (type === 'quote') return 'Kutipan';
		if (type === 'source') return 'Isi sumber';
		return 'Isi bagian';
	}

	function typeHint(type: SitePageBlockFormValues['type']): string {
		if (type === 'quote') return 'Tampil sebagai kutipan besar dengan garis emas.';
		if (type === 'source') return 'Tampil sebagai catatan sumber di akhir artikel.';
		return 'Pisahkan paragraf dengan satu baris kosong.';
	}
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	<input type="hidden" name="blocks" value={blocksPayload} />

	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<h2 class="title-sm text-heading">Publikasi &amp; metadata</h2>
		</div>

		<div class="mt-5 max-w-md">
			<label class="block">
				<span class="field-label">Status</span>
				<select name="status" class="field-input" bind:value={form.status}>
					<option value="draft">Draf</option>
					<option value="published">Tayang</option>
				</select>
				<span class="field-help">Halaman hanya tampil di publik setelah status Tayang.</span>
				{#if errors.status}<p class="field-error">{errors.status}</p>{/if}
			</label>
		</div>

		<div class="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-10">
			<div>
				<h3 class="meta text-gold-dark">Bahasa Indonesia</h3>
				<div class="mt-4 flex flex-col gap-4">
					<VisitField
						name="eyebrowId"
						label="Eyebrow (ID)"
						bind:value={form.eyebrowId}
						error={errors.eyebrowId}
						placeholder="Sejarah"
					/>
					<VisitField
						name="titleId"
						label="Judul (ID)"
						bind:value={form.titleId}
						error={errors.titleId}
						placeholder="Sejarah dan konteks kawasan."
					/>
					<VisitField
						name="descriptionId"
						label="Deskripsi (ID)"
						bind:value={form.descriptionId}
						error={errors.descriptionId}
						multiline
						rows={4}
						hint="Tampil sebagai paragraf pembuka di bawah judul."
					/>
					<VisitField
						name="verificationNoteId"
						label="Catatan verifikasi (ID)"
						bind:value={form.verificationNoteId}
						error={errors.verificationNoteId}
						placeholder="Contoh: Konten telah diverifikasi pengelola, November 2026."
					/>
				</div>
			</div>

			<div class="border-t border-charcoal/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
				<h3 class="meta text-gold-dark">English</h3>
				<div class="mt-4 flex flex-col gap-4">
					<VisitField
						name="eyebrowEn"
						label="Eyebrow (EN)"
						bind:value={form.eyebrowEn}
						error={errors.eyebrowEn}
						placeholder="History"
					/>
					<VisitField
						name="titleEn"
						label="Title (EN)"
						bind:value={form.titleEn}
						error={errors.titleEn}
						placeholder="History and context of the grounds."
					/>
					<VisitField
						name="descriptionEn"
						label="Description (EN)"
						bind:value={form.descriptionEn}
						error={errors.descriptionEn}
						multiline
						rows={4}
						hint="If empty, visitors in English will see the Indonesian version."
					/>
					<VisitField
						name="verificationNoteEn"
						label="Verification note (EN)"
						bind:value={form.verificationNoteEn}
						error={errors.verificationNoteEn}
						placeholder="Example: Content verified by the management, November 2026."
					/>
				</div>
			</div>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<div>
				<h2 class="title-sm text-heading">Artikel</h2>
				<p class="field-help">
					Susun konten sebagai bagian-bagian yang berurutan. Kutipan dan sumber opsional.
				</p>
			</div>
		</div>

		{#if blockError}
			<div class="alert alert--error mt-4" role="alert">
				Periksa bagian artikel: {blockError}
			</div>
		{/if}

		{#if form.blocks.length === 0}
			<div class="surface surface--sand mt-5 flex flex-col items-center px-5 py-10 text-center">
				<Icon name="file" class="h-6 w-6 text-heading/25" />
				<p class="mt-3 text-sm text-muted">Belum ada bagian artikel.</p>
				<button type="button" class="btn btn--outline btn--sm mt-4" onclick={addBlock}>
					<Icon name="plus" class="h-3.5 w-3.5" />
					Tambah bagian
				</button>
			</div>
		{:else}
			<div class="mt-5 flex flex-col gap-4">
				{#each form.blocks as block, index (block.key)}
					<article class="surface--sand rounded-md border border-heading/10 p-4 sm:p-5">
						<div class="flex flex-wrap items-center justify-between gap-3">
							<div class="flex flex-wrap items-center gap-2">
								<span class="meta text-[0.65rem] text-muted">
									Bagian {String(index + 1).padStart(2, '0')}
								</span>
								<select
									class="field-input mt-0 min-h-9 w-auto py-1 text-xs"
									bind:value={block.type}
								>
									<option value="section">Bagian artikel</option>
									<option value="quote">Kutipan</option>
									<option value="source">Sumber</option>
								</select>
							</div>

							<div class="flex items-center gap-1">
								<button
									type="button"
									class="flex h-9 w-9 items-center justify-center rounded-full border border-line/15 text-heading transition-colors hover:border-gold-dark hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-35"
									disabled={index === 0}
									onclick={() => moveBlock(index, -1)}
									aria-label="Naikkan bagian"
									title="Naikkan bagian"
								>
									<Icon name="chevron-up" class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="flex h-9 w-9 items-center justify-center rounded-full border border-line/15 text-heading transition-colors hover:border-gold-dark hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-35"
									disabled={index === form.blocks.length - 1}
									onclick={() => moveBlock(index, 1)}
									aria-label="Turunkan bagian"
									title="Turunkan bagian"
								>
									<Icon name="chevron-down" class="h-4 w-4" />
								</button>
								<button
									type="button"
									class="flex h-9 w-9 items-center justify-center rounded-full border border-danger/25 text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-35"
									onclick={() => removeBlock(index)}
									aria-label="Hapus bagian"
									title="Hapus bagian"
								>
									<Icon name="trash" class="h-4 w-4" />
								</button>
							</div>
						</div>

						<div class="mt-4 grid gap-6 lg:grid-cols-2">
							<div>
								<h4 class="meta text-gold-dark">Bahasa Indonesia</h4>
								<div class="mt-3 flex flex-col gap-4">
									<VisitField
										name={`heading-${block.key}-id`}
										label={`${headingLabel(block.type)} (ID)`}
										bind:value={block.headingId}
									/>
									<VisitField
										name={`body-${block.key}-id`}
										label={`${bodyLabel(block.type)} (ID)`}
										bind:value={block.bodyId}
										multiline
										rows={5}
										hint={typeHint(block.type)}
									/>
								</div>
							</div>

							<div
								class="border-t border-charcoal/10 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
							>
								<h4 class="meta text-gold-dark">English</h4>
								<div class="mt-3 flex flex-col gap-4">
									<VisitField
										name={`heading-${block.key}-en`}
										label={`${headingLabel(block.type)} (EN)`}
										bind:value={block.headingEn}
									/>
									<VisitField
										name={`body-${block.key}-en`}
										label={`${bodyLabel(block.type)} (EN)`}
										bind:value={block.bodyEn}
										multiline
										rows={5}
										hint="If empty, the Indonesian version is used."
									/>
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<button type="button" class="btn btn--outline btn--sm mt-4" onclick={addBlock}>
				<Icon name="plus" class="h-3.5 w-3.5" />
				Tambah bagian
			</button>
		{/if}
	</section>

	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" class="btn btn--primary">
			Simpan halaman
			<Icon name="check" class="h-4 w-4" />
		</button>
	</div>
</form>
