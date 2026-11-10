<script lang="ts">
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

	const inputClass =
		'mt-2 w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-gold-dark focus:ring-2 focus:ring-gold/20';
	const labelClass = 'text-sm font-medium text-navy';
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

<form method="POST" {action} class="grid gap-5">
	<input type="hidden" name="sceneId" value={sceneId} />
	{#if hotspotId}
		<input type="hidden" name="hotspotId" value={hotspotId} />
	{/if}

	{#if Object.keys(errors).length > 0}
		<div
			class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
			role="alert"
		>
			<ul class="list-inside list-disc space-y-1">
				{#each Object.entries(errors) as [key, message] (key)}
					<li>{fieldLabels[key] ?? key}: {message}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		<label class="block">
			<span class={labelClass}>Tipe</span>
			<select name="type" class={inputClass}>
				<option value="navigation" selected={values.type === 'navigation'}>Navigasi</option>
				<option value="information" selected={values.type === 'information'}>Informasi</option>
			</select>
		</label>

		<label class="block">
			<span class={labelClass}>Scene tujuan</span>
			<select name="targetSceneId" class={inputClass}>
				<option value="" selected={values.targetSceneId === ''}>— Tidak ada —</option>
				{#each scenes as scene (scene.id)}
					<option value={scene.id} selected={values.targetSceneId === scene.id}
						>{sceneLabel(scene)}</option
					>
				{/each}
			</select>
		</label>

		<label class="block">
			<span class={labelClass}>Urutan</span>
			<input
				type="number"
				name="sortOrder"
				value={values.sortOrder}
				min="0"
				step="1"
				class={inputClass}
			/>
		</label>

		<label class="block">
			<span class={labelClass}>Yaw (derajat)</span>
			<input
				type="number"
				name="yaw"
				value={values.yaw}
				min="-180"
				max="180"
				step="0.1"
				class={inputClass}
			/>
		</label>

		<label class="block">
			<span class={labelClass}>Pitch (derajat)</span>
			<input
				type="number"
				name="pitch"
				value={values.pitch}
				min="-90"
				max="90"
				step="0.1"
				class={inputClass}
			/>
		</label>

		<label class="mt-7 flex items-center gap-2 text-sm font-medium text-navy">
			<input
				type="checkbox"
				name="isActive"
				checked={values.isActive}
				class="rounded border-navy/20 text-navy"
			/>
			Aktif
		</label>
	</div>

	<p class="text-xs leading-relaxed text-charcoal/50">
		Scene tujuan wajib diisi untuk hotspot navigasi. Koordinat yaw dan pitch disimpan sebagai
		radian, tetapi diisi dalam derajat.
	</p>

	<div class="grid gap-6 lg:grid-cols-2">
		<div class="rounded-xl bg-sand/40 p-4">
			<h3 class="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
				Bahasa Indonesia
			</h3>
			<label class="mt-4 block">
				<span class={labelClass}>Label hotspot</span>
				<input
					type="text"
					name="labelId"
					value={values.labelId}
					required
					class={inputClass}
					placeholder="Menuju Madya Mandala"
				/>
			</label>
			<label class="mt-4 block">
				<span class={labelClass}>Judul informasi</span>
				<input type="text" name="titleId" value={values.titleId} required class={inputClass} />
			</label>
			<label class="mt-4 block">
				<span class={labelClass}>Deskripsi</span>
				<textarea name="bodyId" rows="4" required class={inputClass}>{values.bodyId}</textarea>
			</label>
		</div>

		<div class="rounded-xl bg-sand/40 p-4">
			<h3 class="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">English</h3>
			<label class="mt-4 block">
				<span class={labelClass}>Hotspot label</span>
				<input
					type="text"
					name="labelEn"
					value={values.labelEn}
					required
					class={inputClass}
					placeholder="To Madya Mandala"
				/>
			</label>
			<label class="mt-4 block">
				<span class={labelClass}>Information title</span>
				<input type="text" name="titleEn" value={values.titleEn} required class={inputClass} />
			</label>
			<label class="mt-4 block">
				<span class={labelClass}>Description</span>
				<textarea name="bodyEn" rows="4" required class={inputClass}>{values.bodyEn}</textarea>
			</label>
		</div>
	</div>

	<label class="block">
		<span class={labelClass}>URL eksternal (opsional)</span>
		<input
			type="url"
			name="externalUrl"
			value={values.externalUrl}
			class={inputClass}
			placeholder="https://..."
		/>
	</label>

	<div>
		<button
			type="submit"
			class="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-ivory transition hover:bg-navy-soft"
		>
			{submitLabel}
		</button>
	</div>
</form>
