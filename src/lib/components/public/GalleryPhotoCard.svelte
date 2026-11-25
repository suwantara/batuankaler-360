<script lang="ts">
	import type { GalleryItemView } from '#lib/types/gallery.ts';

	let {
		item,
		index,
		onopen
	}: {
		item: GalleryItemView;
		index: number;
		onopen: (index: number) => void;
	} = $props();
</script>

<figure class="group">
	<!-- Klik foto membuka lightbox dengan navigasi sebelumnya/berikutnya. -->
	<button
		type="button"
		class="relative block w-full overflow-hidden border border-charcoal/12 bg-sand"
		aria-label={`Perbesar foto: ${item.title}`}
		onclick={() => onopen(index)}
	>
		<img
			src={item.imagePath}
			alt={item.title}
			width={item.width}
			height={item.height}
			loading="lazy"
			decoding="async"
			class="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.02]"
		/>
		<span
			class="absolute top-4 left-4 flex h-9 w-9 items-center justify-center border border-ivory/35 bg-navy-deep font-display text-sm text-ivory"
		>
			{String(index + 1).padStart(2, '0')}
		</span>
	</button>

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
