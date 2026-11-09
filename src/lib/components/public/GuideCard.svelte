<script lang="ts">
	let { title, body, index }: { title: string; body: string; index: number } = $props();
</script>

<article class="rounded-3xl border border-forest/10 bg-ivory p-6">
	<span class="font-display text-3xl text-gold-dark/70">{String(index + 1).padStart(2, '0')}</span>
	<h3 class="mt-4 font-display text-xl text-forest">{title}</h3>
	<p class="mt-3 text-sm leading-relaxed text-charcoal/65">{body}</p>
</article>
