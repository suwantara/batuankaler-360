<script lang="ts">
	let { title, body, index }: { title: string; body: string; index: number } = $props();
</script>

<article
	class="group grid gap-3 border-t border-charcoal/12 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-5"
>
	<span class="font-display text-xl leading-none text-gold-dark/60">
		{String(index + 1).padStart(2, '0')}
	</span>
	<div>
		<h3 class="title-sm text-navy">{title}</h3>
		<p class="mt-2 max-w-xl text-sm leading-relaxed text-body">{body}</p>
	</div>
</article>
