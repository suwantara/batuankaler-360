<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '#lib/components/admin/ThemeToggle.svelte';
	import BrandLockup from '#lib/components/ui/BrandLockup.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import Ornament from '#lib/components/ui/Ornament.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let showPassword = $state(false);
</script>

<svelte:head>
	<title>Masuk Admin — Pura Batuan Kaler 360</title>
</svelte:head>

<div class="relative grid min-h-dvh bg-paper lg:grid-cols-[1.04fr_0.96fr]">
	<ThemeToggle class="absolute top-5 right-5 z-20" />

	<section
		class="dark-surface relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-14"
	>
		<img
			src="/images/hero-pura.svg"
			alt=""
			class="absolute inset-0 h-full w-full object-cover opacity-65"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-b from-navy-deep/80 via-navy-deep/60 to-navy-deep"
		></div>

		<a href={resolve('id')} class="relative z-10 w-fit" aria-label="Kembali ke situs">
			<BrandLockup tone="light" tagline />
		</a>

		<div class="relative z-10 max-w-lg py-12">
			<p class="eyebrow">Panel pengelolaan</p>
			<p class="display-xl mt-5 text-ivory">Dokumentasi yang terawat, satu scene demi satu.</p>
			<p class="mt-5 max-w-md text-sm leading-relaxed text-ivory/55">
				Kelola panorama, scene, hotspot, dan status publikasi kawasan Pura Batuan Kaler.
			</p>
		</div>

		<div class="relative z-10">
			<Ornament class="h-3 w-44 text-gold-light/35" />
			<p class="meta mt-5 text-[0.55rem] text-ivory/55">Pura Batuan Kaler · 2026</p>
		</div>
	</section>

	<section class="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12">
		<div class="w-full max-w-md">
			<a href={resolve('id')} class="w-fit lg:hidden" aria-label="Kembali ke situs">
				<BrandLockup tagline />
			</a>

			<p class="eyebrow mt-10 lg:mt-0">Akses administrator</p>
			<h1 class="display-lg mt-5 text-heading">Masuk ke panel admin</h1>
			<p class="mt-4 max-w-sm text-sm leading-relaxed text-body">
				Gunakan akun administrator yang telah dibuat melalui proses provisioning.
			</p>

			{#if form?.message}
				<div class="alert alert--error mt-6" role="alert" aria-live="polite">
					{form.message}
				</div>
			{/if}

			<form method="POST" class="mt-8 space-y-5">
				<label class="block">
					<span class="field-label">Email</span>
					<input
						type="email"
						name="email"
						value={form?.email ?? ''}
						autocomplete="username"
						required
						class="field-input"
						placeholder="admin@contoh.id"
					/>
				</label>

				<div>
					<label for="admin-password" class="field-label">Password</label>
					<div class="relative mt-2">
						<input
							id="admin-password"
							type={showPassword ? 'text' : 'password'}
							name="password"
							autocomplete="current-password"
							required
							class="field-input mt-0 pr-12"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition-colors hover:text-heading"
							onclick={() => (showPassword = !showPassword)}
							aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
							aria-controls="admin-password"
						>
							<Icon name={showPassword ? 'eye-off' : 'eye'} class="h-4 w-4" />
						</button>
					</div>
				</div>

				<button type="submit" class="btn btn--primary w-full">
					Masuk
					<Icon name="arrow-right" class="h-4 w-4" />
				</button>
			</form>

			<div class="mt-8 border-t border-charcoal/10 pt-5">
				<a
					href={resolve('id')}
					class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-heading uppercase transition-colors hover:text-gold-dark"
				>
					<Icon name="arrow-left" class="h-3.5 w-3.5" />
					Kembali ke situs publik
				</a>
				{#if data.redirectTo}
					<p class="mt-3 text-[0.7rem] leading-relaxed text-muted">
						Setelah masuk Anda akan diarahkan ke halaman yang diminta.
					</p>
				{/if}
			</div>
		</div>
	</section>
</div>
