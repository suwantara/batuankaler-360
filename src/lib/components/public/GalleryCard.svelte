<script lang="ts">
	import TempleMark from './TempleMark.svelte';

	let { title, caption, index }: { title: string; caption: string; index: number } = $props();

	const tones = [
		'from-navy via-navy/80 to-gold/40',
		'from-gold/70 via-sand to-navy/30',
		'from-charcoal via-navy to-navy/60',
		'from-navy/80 via-navy/40 to-sand'
	];

	const tone = $derived(tones[index % tones.length]);
</script>

<figure class="group relative overflow-hidden rounded-3xl bg-sand">
	<div class="relative aspect-[4/3] bg-gradient-to-br {tone}">
		<TempleMark class="absolute top-6 left-6 h-12 w-12 text-ivory/25" />
	</div>
	<figcaption
		class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-6 text-ivory"
	>
		<p class="font-display text-xl">{title}</p>
		<p class="mt-1 text-xs tracking-[0.18em] text-ivory/60 uppercase">{caption}</p>
	</figcaption>
</figure>
