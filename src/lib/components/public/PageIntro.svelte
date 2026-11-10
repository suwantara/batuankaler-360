<script lang="ts">
	let { eyebrow, title, description }: { eyebrow: string; title: string; description: string } =
		$props();
</script>

<header class="border-b border-navy/10 bg-sand/60">
	<div class="container-page py-20 sm:py-28">
		<p class="eyebrow">{eyebrow}</p>
		<h1
			class="mt-5 max-w-4xl font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl"
		>
			{title}
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/70">{description}</p>
	</div>
</header>
