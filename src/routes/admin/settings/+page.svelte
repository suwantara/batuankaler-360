<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-col gap-6">
	<header>
		<p class="text-xs font-semibold tracking-[0.24em] text-gold-dark uppercase">Pengaturan</p>
		<h1 class="mt-2 font-display text-3xl text-navy sm:text-4xl">Akun admin</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/60">
			MVP menggunakan satu akun administrator utama. Registrasi publik dinonaktifkan.
		</p>
	</header>

	<section class="rounded-2xl border border-navy/10 bg-ivory p-5 sm:p-6">
		<h2 class="font-display text-xl text-navy">Sesi aktif</h2>
		<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
			<dt class="text-charcoal/45">Email</dt>
			<dd class="font-medium text-navy">{data.user?.email ?? '-'}</dd>
			<dt class="text-charcoal/45">Nama</dt>
			<dd class="font-medium text-navy">{data.user?.name ?? '-'}</dd>
		</dl>
		<p class="mt-5 text-xs leading-relaxed text-charcoal/45">
			Perubahan password dan pengelolaan akun akan ditambahkan pada fase berikutnya.
		</p>
	</section>
</div>
