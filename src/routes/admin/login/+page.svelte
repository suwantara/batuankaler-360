<script lang="ts">
	import { resolve } from '$app/paths';
	import TempleMark from '#lib/components/public/TempleMark.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Masuk Admin — Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex min-h-dvh items-center justify-center bg-navy px-5 py-12">
	<div class="w-full max-w-md rounded-[2rem] border border-ivory/10 bg-ivory p-7 shadow-2xl sm:p-9">
		<a href={resolve('id')} class="flex items-center gap-3" aria-label="Kembali ke situs">
			<TempleMark class="h-10 w-10 text-navy" />
			<span class="font-display text-xl text-navy"
				>Batuan Kaler <span class="text-gold-dark">360</span></span
			>
		</a>

		<h1 class="mt-8 font-display text-3xl text-navy">Masuk ke panel admin</h1>
		<p class="mt-2 text-sm leading-relaxed text-charcoal/60">
			Gunakan akun administrator yang telah dibuat melalui proses provisioning.
		</p>

		{#if form?.message}
			<div
				class="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
				role="alert"
				aria-live="polite"
			>
				{form.message}
			</div>
		{/if}

		<form method="POST" class="mt-7 space-y-5">
			<label class="block">
				<span class="text-sm font-medium text-navy">Email</span>
				<input
					type="email"
					name="email"
					value={form?.email ?? ''}
					autocomplete="username"
					required
					class="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-charcoal transition outline-none focus:border-gold-dark focus:ring-2 focus:ring-gold/20"
					placeholder="admin@contoh.id"
				/>
			</label>

			<label class="block">
				<span class="text-sm font-medium text-navy">Password</span>
				<input
					type="password"
					name="password"
					autocomplete="current-password"
					required
					class="mt-2 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-charcoal transition outline-none focus:border-gold-dark focus:ring-2 focus:ring-gold/20"
				/>
			</label>

			<button
				type="submit"
				class="w-full rounded-full bg-navy px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
			>
				Masuk
			</button>
		</form>

		<p class="mt-6 text-center text-xs text-charcoal/45">
			<a href={resolve('id')} class="font-semibold text-navy hover:text-gold-dark"
				>Kembali ke situs publik</a
			>
		</p>

		{#if data.redirectTo}
			<p class="mt-3 text-center text-[0.7rem] text-charcoal/35">
				Setelah masuk Anda akan diarahkan ke halaman yang diminta.
			</p>
		{/if}
	</div>
</div>
