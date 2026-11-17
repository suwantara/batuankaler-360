<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const displayName = $derived(
		(form?.profile && form.profile.ok ? form.profile.name : data.user?.name) ?? '-'
	);
	const displayEmail = $derived(data.user?.email ?? '-');
</script>

<div class="flex flex-col gap-6">
	<header>
		<p class="eyebrow">Pengaturan</p>
		<h1 class="display-lg mt-4 text-heading">Akun admin</h1>
		<p class="body-copy mt-3 max-w-2xl">
			MVP menggunakan satu akun administrator utama. Registrasi publik dinonaktifkan.
		</p>
	</header>

	<div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
		<section class="surface p-5 sm:p-6">
			<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<div>
					<h2 class="title-sm text-heading">Profil akun</h2>
					<p class="field-help">Nama ini tampil di panel admin.</p>
				</div>
			</div>

			<div class="mt-5 flex items-center gap-4">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-full border border-gold-dark/20 bg-gold/20 font-display text-lg text-gold-dark"
				>
					{(displayEmail[0] ?? 'A').toUpperCase()}
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-semibold text-heading">{displayName}</p>
					<p class="mt-1 truncate text-xs text-muted">{displayEmail}</p>
				</div>
			</div>

			<form method="POST" action="?/updateName" class="mt-6 border-t border-charcoal/10 pt-5">
				<label class="block max-w-md">
					<span class="field-label">Nama administrator</span>
					<input
						type="text"
						name="name"
						value={displayName}
						required
						minlength="2"
						maxlength="100"
						class="field-input"
						autocomplete="name"
					/>
				</label>

				{#if form?.profile?.ok === false}
					<p class="field-error mt-2" role="alert">{form.profile.error}</p>
				{:else if form?.profile?.ok === true}
					<p class="mt-2 text-xs leading-relaxed text-success" role="status">
						{form.profile.message}
					</p>
				{/if}

				<button type="submit" class="btn btn--primary btn--sm mt-4">
					Simpan nama
					<Icon name="check" class="h-3.5 w-3.5" />
				</button>
			</form>
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

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<div>
				<h2 class="title-sm text-heading">Ganti password</h2>
				<p class="field-help">Setelah password diubah, sesi lain akan dikeluarkan.</p>
			</div>
		</div>

		<form
			method="POST"
			action="?/updatePassword"
			class="mt-5 grid max-w-xl gap-4 border-t border-charcoal/10 pt-5"
		>
			<label class="block">
				<span class="field-label">Password saat ini</span>
				<input
					type="password"
					name="currentPassword"
					required
					class="field-input"
					autocomplete="current-password"
				/>
			</label>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="block">
					<span class="field-label">Password baru</span>
					<input
						type="password"
						name="newPassword"
						required
						minlength="12"
						class="field-input"
						autocomplete="new-password"
					/>
				</label>
				<label class="block">
					<span class="field-label">Konfirmasi password baru</span>
					<input
						type="password"
						name="confirmPassword"
						required
						minlength="12"
						class="field-input"
						autocomplete="new-password"
					/>
				</label>
			</div>
			<p class="field-help">Minimal 12 karakter. Gunakan password yang unik untuk panel admin.</p>

			{#if form?.password?.ok === false}
				<p class="field-error" role="alert">{form.password.error}</p>
			{:else if form?.password?.ok === true}
				<p class="text-xs leading-relaxed text-success" role="status">
					{form.password.message}
				</p>
			{/if}

			<div>
				<button type="submit" class="btn btn--primary btn--sm">
					Perbarui password
					<Icon name="check" class="h-3.5 w-3.5" />
				</button>
			</div>
		</form>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">03</span>
			<div>
				<h2 class="title-sm text-heading">Penyimpanan upload</h2>
				<p class="field-help">Konfigurasi aktif untuk file panorama dan aset media.</p>
			</div>
		</div>

		<div class="mt-5 flex flex-wrap items-center gap-3">
			<span class="badge {data.storage.ready ? 'badge--published' : 'badge--draft'}">
				{data.storage.ready ? 'Siap' : 'Belum lengkap'}
			</span>
			<p class="text-sm font-semibold text-heading">
				{data.storage.driver === 's3' ? 'Object storage (S3-compatible)' : 'Penyimpanan lokal'}
			</p>
		</div>

		{#if data.storage.driver === 's3' && data.storage.ready}
			<dl class="mt-5 grid gap-3 border-t border-charcoal/10 pt-5 text-sm sm:grid-cols-[8rem_1fr]">
				<dt class="text-muted">Bucket</dt>
				<dd class="font-medium break-all text-heading">{data.storage.bucket}</dd>
				<dt class="text-muted">URL publik</dt>
				<dd class="font-medium break-all text-heading">{data.storage.publicUrl}</dd>
			</dl>
		{:else if data.storage.driver === 's3'}
			<div class="alert alert--warning mt-5">
				Lengkapi environment berikut lalu redeploy:
				<span class="mt-2 block font-mono text-xs">{data.storage.missing.join(', ')}</span>
			</div>
		{:else}
			<p class="mt-5 border-t border-charcoal/10 pt-5 text-sm leading-relaxed text-muted">
				File disimpan pada volume lokal <code>UPLOAD_DIR</code>. Untuk memakai R2/S3, set
				<code>STORAGE_DRIVER=s3</code> dan lengkapi environment S3.
			</p>
		{/if}

		{#if data.storage.error}
			<div class="alert alert--error mt-5" role="alert">{data.storage.error}</div>
		{/if}

		{#if form?.storageTest}
			<div
				class="alert {form.storageTest.ok ? 'alert--success' : 'alert--error'} mt-5"
				role="status"
			>
				{form.storageTest.message}
			</div>
		{/if}

		<form method="POST" action="?/testStorage" class="mt-5 border-t border-charcoal/10 pt-5">
			<button type="submit" class="btn btn--outline btn--sm" disabled={!data.storage.ready}>
				<Icon name="upload" class="h-3.5 w-3.5" />
				Uji koneksi penyimpanan
			</button>
			<p class="mt-2 text-xs leading-relaxed text-muted">
				Uji ini membuat objek kecil, memeriksa keberadaannya, lalu menghapusnya.
			</p>
		</form>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">04</span>
			<div>
				<h2 class="title-sm text-heading">Backup database</h2>
				<p class="field-help">Unduh salinan database untuk disimpan di luar server.</p>
			</div>
		</div>

		<div class="mt-5 flex flex-col items-start gap-3 border-t border-charcoal/10 pt-5">
			<a href={resolve('admin/settings/backup')} class="btn btn--primary btn--sm" download>
				<Icon name="file" class="h-3.5 w-3.5" />
				Unduh backup database
			</a>
			<p class="max-w-3xl text-xs leading-relaxed text-muted">
				File <code>.dump</code> dapat dipulihkan dengan <code>pg_restore</code>. Backup ini hanya
				berisi database. Untuk database dan file upload sekaligus, jalankan
				<code>docker/backup.sh</code> di server.
			</p>
		</div>
	</section>
</div>
