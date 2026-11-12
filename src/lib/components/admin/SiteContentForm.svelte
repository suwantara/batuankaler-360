<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { VisitInformationFormValues } from '#lib/schemas/site-content.ts';
	import VisitField from './VisitField.svelte';

	let {
		values,
		errors = {},
		action
	}: {
		values: VisitInformationFormValues;
		errors?: Record<string, string>;
		action: string;
	} = $props();

	const previewHref = resolve('id');
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	{#if errors.form}
		<div class="alert alert--error" role="alert">{errors.form}</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<h2 class="title-sm text-navy">Publikasi &amp; identitas</h2>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<label class="block">
				<span class="field-label">Status</span>
				<select name="status" class="field-input">
					<option value="draft" selected={values.status === 'draft'}>Draf</option>
					<option value="published" selected={values.status === 'published'}>Tayang</option>
				</select>
				<span class="field-help">Konten hanya tampil di situs publik setelah berstatus Tayang.</span
				>
			</label>

			<VisitField
				name="managerName"
				label="Nama pengelola"
				value={values.managerName}
				error={errors.managerName}
				placeholder="Pengelola Pura Batuan Kaler"
				hint="Ditampilkan sebagai pihak yang mengelola informasi."
			/>

			<VisitField
				name="managerUrl"
				label="URL pengelola (opsional)"
				type="url"
				value={values.managerUrl}
				error={errors.managerUrl}
				placeholder="https://..."
			/>

			<VisitField
				name="mapUrl"
				label="URL peta (opsional)"
				type="url"
				value={values.mapUrl}
				error={errors.mapUrl}
				placeholder="https://maps.google.com/..."
				hint="Tautan eksternal yang muncul di samping informasi lokasi."
			/>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<div>
				<h2 class="title-sm text-navy">Bahasa Indonesia</h2>
				<p class="field-help">Kosongkan field yang belum diverifikasi pengelola.</p>
			</div>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name="heritageLabelId"
				label="Label status (ID)"
				value={values.heritageLabelId}
				error={errors.heritageLabelId}
				placeholder="Cagar Budaya"
				hint="Contoh: Cagar Budaya, Kawasan Pura, atau label resmi lainnya."
			/>
			<VisitField
				name="locationId"
				label="Lokasi (ID)"
				value={values.locationId}
				error={errors.locationId}
				placeholder="Alamat atau patokan lokasi"
			/>
			<VisitField
				name="visitingHoursId"
				label="Jam kunjungan (ID)"
				value={values.visitingHoursId}
				error={errors.visitingHoursId}
				placeholder="Contoh: Setiap hari, 07.00–17.00 WITA"
			/>
			<VisitField
				name="contactId"
				label="Kontak (ID)"
				value={values.contactId}
				error={errors.contactId}
				placeholder="Email, telepon, atau narahubung"
			/>
			<VisitField
				name="accessId"
				label="Akses (ID)"
				value={values.accessId}
				error={errors.accessId}
				multiline
				hint="Jalur masuk, transportasi, atau kebutuhan akses khusus."
			/>
			<VisitField
				name="dressCodeId"
				label="Pakaian (ID)"
				value={values.dressCodeId}
				error={errors.dressCodeId}
				multiline
				hint="Ketentuan pakaian yang berlaku di kawasan."
			/>
			<VisitField
				name="photoPolicyId"
				label="Ketentuan foto (ID)"
				value={values.photoPolicyId}
				error={errors.photoPolicyId}
				multiline
				hint="Area yang boleh atau tidak boleh didokumentasikan."
			/>
			<VisitField
				name="etiquetteId"
				label="Etika kunjungan (ID)"
				value={values.etiquetteId}
				error={errors.etiquetteId}
				multiline
			/>
			<VisitField
				name="verificationNoteId"
				label="Catatan verifikasi (ID)"
				value={values.verificationNoteId}
				error={errors.verificationNoteId}
				placeholder="Contoh: Konten telah diverifikasi pengelola, November 2026."
				class="sm:col-span-2"
				hint="Tampil sebagai catatan status di blok informasi kunjungan."
			/>
		</div>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">03</span>
			<div>
				<h2 class="title-sm text-navy">English</h2>
				<p class="field-help">
					Jika kosong, pengunjung versi Inggris akan melihat versi Indonesia dengan indikator
					fallback.
				</p>
			</div>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2">
			<VisitField
				name="heritageLabelEn"
				label="Status label (EN)"
				value={values.heritageLabelEn}
				error={errors.heritageLabelEn}
				placeholder="Cultural Heritage"
			/>
			<VisitField
				name="locationEn"
				label="Location (EN)"
				value={values.locationEn}
				error={errors.locationEn}
				placeholder="Address or location landmark"
			/>
			<VisitField
				name="visitingHoursEn"
				label="Visiting hours (EN)"
				value={values.visitingHoursEn}
				error={errors.visitingHoursEn}
				placeholder="Example: Daily, 7 a.m.–5 p.m. WITA"
			/>
			<VisitField
				name="contactEn"
				label="Contact (EN)"
				value={values.contactEn}
				error={errors.contactEn}
				placeholder="Email, phone, or contact person"
			/>
			<VisitField
				name="accessEn"
				label="Access (EN)"
				value={values.accessEn}
				error={errors.accessEn}
				multiline
				hint="Entrance route, transport, or accessibility needs."
			/>
			<VisitField
				name="dressCodeEn"
				label="Dress code (EN)"
				value={values.dressCodeEn}
				error={errors.dressCodeEn}
				multiline
				hint="Dress requirements applicable across the grounds."
			/>
			<VisitField
				name="photoPolicyEn"
				label="Photo policy (EN)"
				value={values.photoPolicyEn}
				error={errors.photoPolicyEn}
				multiline
				hint="Areas that may or may not be photographed."
			/>
			<VisitField
				name="etiquetteEn"
				label="Visit etiquette (EN)"
				value={values.etiquetteEn}
				error={errors.etiquetteEn}
				multiline
			/>
			<VisitField
				name="verificationNoteEn"
				label="Verification note (EN)"
				value={values.verificationNoteEn}
				error={errors.verificationNoteEn}
				placeholder="Example: Content verified by the management, November 2026."
				class="sm:col-span-2"
				hint="Shown as a status note in the visit information block."
			/>
		</div>
	</section>

	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" class="btn btn--primary">
			Simpan konten
			<Icon name="check" class="h-4 w-4" />
		</button>
		<a
			href={previewHref}
			class="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-navy"
		>
			Lihat beranda
			<Icon name="external" class="h-3.5 w-3.5" />
		</a>
	</div>
</form>
