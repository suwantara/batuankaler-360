<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
</script>

<div class="flex flex-col gap-6">
	<header>
		<p class="eyebrow">Konten</p>
		<h1 class="display-lg mt-4 text-navy">Konten situs</h1>
		<p class="body-copy mt-3 max-w-2xl">
			Pengelolaan halaman sejarah, area, galeri, dan panduan akan ditambahkan pada Fase 5.
		</p>
	</header>

	<div class="surface flex flex-col items-start gap-5 p-6 sm:p-8">
		<span
			class="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/10 bg-sand/60"
		>
			<Icon name="file" class="h-5 w-5 text-navy/35" />
		</span>
		<div>
			<h2 class="title-sm text-navy">Konten halaman publik belum tersambung</h2>
			<p class="mt-2 max-w-2xl text-sm leading-relaxed text-body">
				Untuk saat ini konten halaman publik masih berupa placeholder dan belum tersambung ke
				database. Scene dan hotspot sudah dapat dikelola melalui menu Scene.
			</p>
		</div>
	</div>
</div>
