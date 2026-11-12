<script lang="ts">
	import { resolve } from '$app/paths';
	import SceneForm from '#lib/components/admin/SceneForm.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const title = $derived(
		data.scene.translations.find((item) => item.locale === 'id')?.title ?? data.scene.slug
	);
	const values = $derived(form?.values ?? data.values);
</script>

<svelte:head>
	<title>{title} — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-5">
		<nav class="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="transition-colors hover:text-navy">Scene</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-navy/60">{title}</span>
		</nav>

		<div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<p class="eyebrow">Scene</p>
				<div class="mt-4 flex flex-wrap items-center gap-3">
					<h1 class="display-lg text-navy">{title}</h1>
					<span
						class="badge {data.scene.status === 'published' ? 'badge--published' : 'badge--draft'}"
					>
						{data.scene.status === 'published' ? 'Tayang' : 'Draf'}
					</span>
				</div>
				<p class="mt-2 text-sm text-muted">/{data.scene.slug}</p>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				{#if data.scene.status === 'published'}
					<a href={resolve(`id/tour/${data.scene.slug}`)} class="btn btn--outline btn--sm">
						Lihat di situs
						<Icon name="external" class="h-3.5 w-3.5" />
					</a>
					<form method="POST" action="?/unpublish">
						<button type="submit" class="btn btn--outline btn--sm">Jadikan draft</button>
					</form>
				{:else}
					<form method="POST" action="?/publish">
						<button type="submit" class="btn btn--gold btn--sm">
							Publikasikan
							<Icon name="check" class="h-3.5 w-3.5" />
						</button>
					</form>
				{/if}
				<a
					href={resolve(`admin/scenes/${data.scene.id}/hotspots`)}
					class="btn btn--primary btn--sm"
				>
					<Icon name="map-pin" class="h-3.5 w-3.5" />
					Kelola hotspot
				</a>
			</div>
		</div>
	</header>

	{#if form?.errors?.form}
		<div class="alert alert--error" role="alert">
			{form.errors.form}
		</div>
	{/if}

	<SceneForm
		{values}
		areas={data.areas}
		assets={data.assets}
		errors={form?.errors}
		submitLabel="Simpan perubahan"
		action="?/update"
	/>

	<section class="rounded-md border border-danger/25 bg-danger-soft/40 p-5 sm:p-6">
		<div class="flex items-start gap-3">
			<Icon name="trash" class="mt-0.5 h-5 w-5 shrink-0 text-danger/70" />
			<div>
				<h2 class="title-sm text-danger">Hapus scene</h2>
				<p class="mt-2 max-w-2xl text-xs leading-relaxed text-danger/70">
					Scene yang masih menjadi tujuan hotspot tidak dapat dihapus. Pindahkan atau hapus hotspot
					terkait terlebih dahulu.
				</p>
				<form
					method="POST"
					action="?/delete"
					class="mt-4"
					onsubmit={(event) => {
						if (!confirm('Hapus scene ini? Tindakan ini tidak dapat dibatalkan.')) {
							event.preventDefault();
						}
					}}
				>
					<button type="submit" class="btn btn--danger btn--sm">Hapus scene</button>
				</form>
			</div>
		</div>
	</section>
</div>
