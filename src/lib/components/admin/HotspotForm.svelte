<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { HotspotFormValues } from '#lib/schemas/scene.ts';

	let {
		values,
		scenes,
		errors = {},
		sceneId,
		hotspotId,
		action,
		submitLabel
	}: {
		values: HotspotFormValues;
		scenes: Array<{ id: string; translations: Array<{ locale: Locale; title: string }> }>;
		errors?: Record<string, string>;
		sceneId: string;
		hotspotId?: string;
		action: string;
		submitLabel: string;
	} = $props();

	const fieldLabels: Record<string, string> = {
		form: 'Form',
		type: 'Tipe hotspot',
		targetSceneId: 'Scene tujuan',
		yaw: 'Yaw',
		pitch: 'Pitch',
		sortOrder: 'Urutan',
		labelId: 'Label ID',
		titleId: 'Judul ID',
		bodyId: 'Deskripsi ID',
		labelEn: 'Label EN',
		titleEn: 'Judul EN',
		bodyEn: 'Deskripsi EN',
		externalUrl: 'URL eksternal'
	};

	function sceneLabel(scene: (typeof scenes)[number]): string {
		return scene.translations.find((item) => item.locale === 'id')?.title ?? scene.id;
	}
</script>

<form method="POST" {action} class="flex flex-col gap-5">
	<input type="hidden" name="sceneId" value={sceneId} />
	{#if hotspotId}
		<input type="hidden" name="hotspotId" value={hotspotId} />
	{/if}

	{#if Object.keys(errors).length > 0}
		<div class="alert alert--error" role="alert">
			<ul class="list-inside list-disc space-y-1">
				{#each Object.entries(errors) as [key, message] (key)}
					<li>{fieldLabels[key] ?? key}: {message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">01</span>
			<h3 class="title-sm text-navy">Posisi &amp; tujuan</h3>
		</div>

		<div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			<label class="block">
				<span class="field-label">Tipe</span>
				<select name="type" class="field-input">
					<option value="navigation" selected={values.type === 'navigation'}>Navigasi</option>
					<option value="information" selected={values.type === 'information'}>Informasi</option>
				</select>
			</label>

			<label class="block">
				<span class="field-label">Scene tujuan</span>
				<select name="targetSceneId" class="field-input">
					<option value="" selected={values.targetSceneId === ''}>— Tidak ada —</option>
					{#each scenes as scene (scene.id)}
						<option value={scene.id} selected={values.targetSceneId === scene.id}
							>{sceneLabel(scene)}</option
						>
					{/each}
				</select>
			</label>

			<label class="block">
				<span class="field-label">Urutan</span>
				<input
					type="number"
					name="sortOrder"
					value={values.sortOrder}
					min="0"
					step="1"
					class="field-input"
				/>
			</label>

			<label class="block">
				<span class="field-label">Yaw (derajat)</span>
				<input
					type="number"
					name="yaw"
					value={values.yaw}
					min="-180"
					max="180"
					step="0.1"
					class="field-input"
				/>
			</label>

			<label class="block">
				<span class="field-label">Pitch (derajat)</span>
				<input
					type="number"
					name="pitch"
					value={values.pitch}
					min="-90"
					max="90"
					step="0.1"
					class="field-input"
				/>
			</label>

			<label class="mt-7 flex items-center gap-2.5 text-sm font-medium text-navy">
				<input
					type="checkbox"
					name="isActive"
					checked={values.isActive}
					class="h-4 w-4 rounded-xs border-navy/25 text-navy accent-[var(--color-navy)]"
				/>
				Aktif
			</label>
		</div>

		<p class="field-help">
			Scene tujuan wajib diisi untuk hotspot navigasi. Koordinat yaw dan pitch disimpan sebagai
			radian, tetapi diisi dalam derajat.
		</p>
	</section>

	<section class="surface p-5 sm:p-6">
		<div class="flex items-baseline gap-3 border-b border-charcoal/10 pb-4">
			<span class="font-display text-lg leading-none text-gold-dark/55">02</span>
			<h3 class="title-sm text-navy">Konten hotspot</h3>
		</div>

		<div class="mt-5 grid gap-8 lg:grid-cols-2 lg:gap-10">
			<div>
				<h4 class="meta text-gold-dark">Bahasa Indonesia</h4>
				<label class="mt-4 block">
					<span class="field-label">Label hotspot</span>
					<input
						type="text"
						name="labelId"
						value={values.labelId}
						required
						class="field-input"
						placeholder="Menuju Madya Mandala"
					/>
				</label>
				<label class="mt-4 block">
					<span class="field-label">Judul informasi</span>
					<input type="text" name="titleId" value={values.titleId} required class="field-input" />
				</label>
				<label class="mt-4 block">
					<span class="field-label">Deskripsi</span>
					<textarea name="bodyId" rows="4" required class="field-input">{values.bodyId}</textarea>
				</label>
			</div>

			<div class="border-t border-charcoal/10 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
				<h4 class="meta text-gold-dark">English</h4>
				<label class="mt-4 block">
					<span class="field-label">Hotspot label</span>
					<input
						type="text"
						name="labelEn"
						value={values.labelEn}
						required
						class="field-input"
						placeholder="To Madya Mandala"
					/>
				</label>
				<label class="mt-4 block">
					<span class="field-label">Information title</span>
					<input type="text" name="titleEn" value={values.titleEn} required class="field-input" />
				</label>
				<label class="mt-4 block">
					<span class="field-label">Description</span>
					<textarea name="bodyEn" rows="4" required class="field-input">{values.bodyEn}</textarea>
				</label>
			</div>
		</div>

		<label class="mt-6 block border-t border-charcoal/10 pt-5">
			<span class="field-label">URL eksternal (opsional)</span>
			<input
				type="url"
				name="externalUrl"
				value={values.externalUrl}
				class="field-input"
				placeholder="https://..."
			/>
		</label>
	</section>

	<div>
		<button type="submit" class="btn btn--primary">
			{submitLabel}
			<Icon name="check" class="h-4 w-4" />
		</button>
	</div>
</form>
