<script lang="ts">
	import type { GalleryItemView } from '#lib/types/gallery.ts';

	let { item, index }: { item: GalleryItemView; index: number } = $props();
</script>

<figure class="group">
	<!-- Tautan membuka file gambar langsung. -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		href={item.imagePath}
		target="_blank"
		rel="noreferrer"
		class="relative block aspect-[4/5] overflow-hidden border border-charcoal/12 bg-sand"
		aria-label={`Lihat foto: ${item.title}`}
	>
		<img
			src={item.imagePath}
			alt={item.title}
			width={item.width}
			height={item.height}
			loading="lazy"
			decoding="async"
			class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
		/>
		<span
			class="absolute top-4 left-4 flex h-9 w-9 items-center justify-center border border-ivory/35 bg-navy-deep font-display text-sm text-ivory"
		>
			{String(index + 1).padStart(2, '0')}
		</span>
	</a>

	<figcaption class="flex items-start justify-between gap-4 border-b border-charcoal/12 pt-4 pb-5">
		<div>
			<p class="font-display text-xl leading-snug text-navy">{item.title}</p>
			{#if item.caption}
				<p class="mt-1.5 text-xs leading-relaxed text-muted">{item.caption}</p>
			{/if}
		</div>
		<span class="meta shrink-0 text-gold-dark">0{index + 1}</span>
	</figcaption>
</figure>
