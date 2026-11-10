<script lang="ts">
	import { resolve } from '$app/paths';
	import SceneForm from '#lib/components/admin/SceneForm.svelte';
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
	<header class="flex flex-col gap-4">
		<nav class="text-xs text-charcoal/45" aria-label="Breadcrumb">
			<a href={resolve('admin/scenes')} class="hover:text-navy">Scene</a>
			<span aria-hidden="true"> / </span>
			<span>{title}</span>
		</nav>

		<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div>
				<div class="flex flex-wrap items-center gap-3">
					<h1 class="font-display text-3xl text-navy sm:text-4xl">{title}</h1>
					<span
						class="rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider uppercase {data
							.scene.status === 'published'
							? 'bg-emerald-50 text-emerald-700'
							: 'bg-amber-50 text-amber-700'}"
					>
						{data.scene.status}
					</span>
				</div>
				<p class="mt-2 text-sm text-charcoal/50">/{data.scene.slug}</p>
			</div>

			<div class="flex flex-wrap items-center gap-2">
				{#if data.scene.status === 'published'}
					<a
						href={resolve(`id/tour/${data.scene.slug}`)}
						class="rounded-full border border-navy/15 px-4 py-2 text-xs font-semibold text-navy transition hover:border-gold-dark hover:text-gold-dark"
					>
						Lihat di situs
					</a>
					<form method="POST" action="?/unpublish">
						<button
							type="submit"
							class="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
						>
							Jadikan draft
						</button>
					</form>
				{:else}
					<form method="POST" action="?/publish">
						<button
							type="submit"
							class="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
						>
							Publikasikan
						</button>
					</form>
				{/if}
				<a
					href={resolve(`admin/scenes/${data.scene.id}/hotspots`)}
					class="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-ivory transition hover:bg-navy-soft"
				>
					Kelola hotspot
				</a>
			</div>
		</div>
	</header>

	{#if form?.errors?.form}
		<div
			class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
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

	<section class="rounded-2xl border border-red-200 bg-red-50/60 p-5">
		<h2 class="font-display text-lg text-red-900">Hapus scene</h2>
		<p class="mt-1 max-w-2xl text-xs leading-relaxed text-red-800/70">
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
			<button
				type="submit"
				class="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-100"
			>
				Hapus scene
			</button>
		</form>
	</section>
</div>
