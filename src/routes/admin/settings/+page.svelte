<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-6">
	<header>
		<p class="eyebrow">Pengaturan</p>
		<h1 class="display-lg mt-4 text-navy">Akun admin</h1>
		<p class="body-copy mt-3 max-w-2xl">
			MVP menggunakan satu akun administrator utama. Registrasi publik dinonaktifkan.
		</p>
	</header>

	<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
		<section class="surface p-5 sm:p-6">
			<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<h2 class="title-sm text-navy">Sesi aktif</h2>
			</div>

			<div class="mt-5 flex items-center gap-4">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full border border-gold-dark/20 bg-gold/20 font-display text-lg text-gold-dark"
				>
					{(data.user?.email?.[0] ?? 'A').toUpperCase()}
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold text-navy">{data.user?.name ?? '-'}</p>
					<p class="mt-1 truncate text-xs text-muted">{data.user?.email ?? '-'}</p>
				</div>
			</div>

			<dl class="mt-6 grid gap-3 border-t border-charcoal/10 pt-5 text-sm sm:grid-cols-[8rem_1fr]">
				<dt class="text-muted">Email</dt>
				<dd class="font-medium text-navy">{data.user?.email ?? '-'}</dd>
				<dt class="text-muted">Nama</dt>
				<dd class="font-medium text-navy">{data.user?.name ?? '-'}</dd>
			</dl>

			<p class="mt-5 text-xs leading-relaxed text-muted">
				Perubahan password dan pengelolaan akun akan ditambahkan pada fase berikutnya.
			</p>
		</section>

		<aside class="surface surface--dark h-fit p-6">
			<p class="meta text-[0.58rem] text-gold-light/60">Keamanan akses</p>
			<div class="mt-5 flex items-start gap-3">
				<Icon name="user" class="mt-0.5 h-5 w-5 shrink-0 text-gold-light/60" />
				<p class="text-xs leading-relaxed text-ivory/55">
					Registrasi publik dinonaktifkan. Akun administrator dibuat melalui proses provisioning
					yang terkontrol, dan sesi diverifikasi di server pada setiap route admin.
				</p>
			</div>
		</aside>
	</div>
</div>
