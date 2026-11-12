<script lang="ts">
	let { eyebrow, title, description }: { eyebrow: string; title: string; description: string } =
		$props();
</script>

<header class="relative overflow-hidden border-b border-charcoal/10 bg-ivory">
	<div
		class="pointer-events-none absolute -top-10 right-4 hidden font-display text-[16rem] leading-none text-navy/[0.035] select-none lg:block"
		aria-hidden="true"
	>
		360
	</div>

	<div class="container-page relative py-14 sm:py-20 lg:py-24">
		<p class="eyebrow">{eyebrow}</p>

		<div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
			<h1 class="display-xl max-w-4xl text-navy">{title}</h1>
			<div class="lg:border-l lg:border-charcoal/10 lg:pl-8">
				<p class="lede max-w-md">{description}</p>
			</div>
		</div>
	</div>
</header>
