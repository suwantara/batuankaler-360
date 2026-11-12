<script lang="ts">
	import { resolve } from '$app/paths';
	import { onDestroy } from 'svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ALLOWED_IMAGE_LABEL, UPLOAD_LIMITS } from '#lib/upload/limits.ts';
	import type { PageProps } from './$types';

	interface UploadResult {
		ok: boolean;
		message?: string;
	}

	let { form }: PageProps = $props();

	let uploading = $state(false);
	let progress = $state(0);
	let uploadError = $state('');
	let activeRequest: XMLHttpRequest | null = null;

	const processing = $derived(uploading && progress >= 100);

	function readMessage(payload: unknown): string | undefined {
		if (payload && typeof payload === 'object' && 'message' in payload) {
			const message = payload.message;

			if (typeof message === 'string') return message;
		}

		return undefined;
	}

	function sendUpload(formData: FormData): Promise<UploadResult> {
		return new Promise((finish) => {
			const request = new XMLHttpRequest();
			activeRequest = request;
			request.open('POST', resolve('admin/media/upload/api'));

			request.upload.addEventListener('progress', (event) => {
				if (!event.lengthComputable || event.total === 0) return;

				progress = Math.min(99, Math.round((event.loaded / event.total) * 100));
			});

			request.addEventListener('load', () => {
				activeRequest = null;
				progress = 100;

				let payload: unknown;

				try {
					payload = JSON.parse(request.responseText);
				} catch {
					payload = null;
				}

				const succeeded = request.status >= 200 && request.status < 300;

				finish({
					ok: succeeded,
					message:
						readMessage(payload) ?? (succeeded ? undefined : 'Gagal mengunggah aset panorama.')
				});
			});

			request.addEventListener('error', () => {
				activeRequest = null;
				finish({
					ok: false,
					message: 'Koneksi ke server terputus. Periksa jaringan lalu coba lagi.'
				});
			});

			request.addEventListener('abort', () => {
				activeRequest = null;
				finish({ ok: false, message: 'Unggahan dibatalkan.' });
			});

			request.send(formData);
		});
	}

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();

		const formElement = event.currentTarget;

		if (!(formElement instanceof HTMLFormElement) || uploading) return;
		if (!formElement.reportValidity()) return;

		uploadError = '';
		uploading = true;
		progress = 0;

		const result = await sendUpload(new FormData(formElement));

		uploading = false;

		if (!result.ok) {
			uploadError = result.message ?? 'Gagal mengunggah aset panorama.';
			return;
		}

		window.location.assign(`${resolve('admin/media')}?uploaded=1`);
	}

	onDestroy(() => activeRequest?.abort());
</script>

<svelte:head>
	<title>Upload Panorama — Admin Pura Batuan Kaler 360</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<header class="flex flex-col gap-4">
		<nav class="flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
			<a href={resolve('admin/media')} class="transition-colors hover:text-heading">Media</a>
			<Icon name="chevron-right" class="h-3 w-3" />
			<span class="text-heading/60">Upload</span>
		</nav>
		<div>
			<p class="eyebrow">Media baru</p>
			<h1 class="display-lg mt-4 text-heading">Upload panorama</h1>
			<p class="body-copy mt-3 max-w-2xl">
				Unggah panorama equirectangular beserta thumbnail dan preview opsional. File disimpan di
				storage lokal server.
			</p>
		</div>
	</header>

	{#if form?.message}
		<div class="alert alert--error" role="alert">{form.message}</div>
	{/if}

	{#if uploadError}
		<div class="alert alert--error" role="alert">{uploadError}</div>
	{/if}

	<div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
		<form
			method="POST"
			enctype="multipart/form-data"
			class="surface flex flex-col gap-6 p-5 sm:p-6"
			aria-busy={uploading}
			onsubmit={handleSubmit}
		>
			<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
				<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
				<h2 class="title-sm text-heading">Berkas panorama</h2>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				<label class="block sm:col-span-2">
					<span class="field-label">Panorama asli</span>
					<input
						type="file"
						name="original"
						accept=".jpg,.jpeg,.png,.webp"
						required
						class="field-input"
					/>
					<span class="field-help">
						{ALLOWED_IMAGE_LABEL}, rasio 2:1, lebar minimal 2000px, maksimal {Math.round(
							UPLOAD_LIMITS.original / (1024 * 1024)
						)} MB.
					</span>
				</label>

				<label class="block">
					<span class="field-label">Thumbnail</span>
					<input
						type="file"
						name="thumbnail"
						accept=".jpg,.jpeg,.png,.webp"
						required
						class="field-input"
					/>
					<span class="field-help">
						Maksimal {Math.round(UPLOAD_LIMITS.thumbnail / (1024 * 1024))} MB.
					</span>
				</label>

				<label class="block">
					<span class="field-label">Preview (opsional)</span>
					<input type="file" name="preview" accept=".jpg,.jpeg,.png,.webp" class="field-input" />
					<span class="field-help">
						Maksimal {Math.round(UPLOAD_LIMITS.preview / (1024 * 1024))} MB.
					</span>
				</label>

				<label class="block sm:col-span-2">
					<span class="field-label">Proyeksi</span>
					<input
						type="text"
						name="projection"
						value="equirectangular"
						required
						class="field-input"
					/>
				</label>
			</div>

			{#if uploading}
				<div class="border-t border-charcoal/10 pt-5" aria-live="polite">
					<div class="flex items-center justify-between gap-3 text-xs font-semibold text-heading">
						<span>{processing ? 'Memproses aset…' : 'Mengunggah aset…'}</span>
						<span class="tabular-nums">{progress}%</span>
					</div>
					<div
						class="mt-2 h-2 overflow-hidden rounded-full bg-line/10"
						role="progressbar"
						aria-label="Progres unggah aset"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={progress}
					>
						<div
							class="h-full rounded-full bg-gold-dark transition-[width] duration-200 ease-out"
							style={`width: ${progress}%`}
						></div>
					</div>
					<p class="mt-2 text-xs leading-relaxed text-muted">
						Jangan tutup halaman ini sampai proses selesai.
					</p>
				</div>
			{/if}

			<div class="flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-5">
				<button type="submit" class="btn btn--primary" disabled={uploading}>
					{uploading ? 'Mengunggah…' : 'Unggah aset'}
					<Icon name="upload" class="h-4 w-4" />
				</button>
				<a
					href={resolve('admin/media')}
					class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-heading"
				>
					<Icon name="arrow-left" class="h-3.5 w-3.5" />
					Batal
				</a>
			</div>
		</form>

		<aside class="surface surface--dark h-fit p-6">
			<p class="meta text-[0.58rem] text-gold-light/60">Ketentuan upload</p>
			<div class="mt-5 flex flex-col gap-5">
				<div>
					<p class="text-sm font-semibold text-ivory">Format</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">{ALLOWED_IMAGE_LABEL}.</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<p class="text-sm font-semibold text-ivory">Rasio &amp; resolusi</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						Panorama equirectangular 2:1 dengan lebar minimal 2000px. Gunakan thumbnail terpisah
						agar daftar scene tetap ringan.
					</p>
				</div>
				<div class="border-t border-ivory/10 pt-5">
					<p class="text-sm font-semibold text-ivory">Validasi</p>
					<p class="mt-1.5 text-xs leading-relaxed text-ivory/55">
						File divalidasi berdasarkan MIME, ekstensi, dimensi, dan ukuran. Nama file tidak
						digunakan langsung sebagai path penyimpanan.
					</p>
				</div>
			</div>
		</aside>
	</div>
</div>
