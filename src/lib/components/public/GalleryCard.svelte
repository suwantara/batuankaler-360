<script lang="ts">
	let {
		title,
		caption,
		index,
		pending
	}: { title: string; caption: string; index: number; pending?: string } = $props();

	const variant = $derived(index % 3);
	const plateClass = $derived(
		variant === 1
			? 'border-charcoal/12 bg-sand text-navy/55'
			: variant === 2
				? 'border-ivory/15 bg-navy-deep text-gold/55'
				: 'border-ivory/15 bg-navy text-gold-light/55'
	);
	const innerClass = $derived(variant === 1 ? 'border-navy/15' : 'border-ivory/15');
</script>

<figure class="group">
	<div class="relative aspect-[4/5] overflow-hidden border {plateClass}">
		<div class="absolute inset-3 border {innerClass}"></div>

		<span class="absolute top-5 left-5 font-display text-lg leading-none opacity-70">
			{String(index + 1).padStart(2, '0')}
		</span>

		{#if pending}
			<span class="meta absolute top-5 right-5 text-[0.58rem] opacity-65">{pending}</span>
		{/if}

		<svg
			class="absolute inset-0 h-full w-full p-10 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
			viewBox="0 0 240 300"
			fill="none"
			aria-hidden="true"
		>
			{#if variant === 0}
				<g stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="176" cy="76" r="22" opacity="0.5" />
					<path d="M120 82v46" opacity="0.4" />
					<path d="M60 236V150a60 60 0 0 1 120 0v86" />
					<path d="M80 236v-82a40 40 0 0 1 80 0v82" opacity="0.7" />
					<path d="M48 236h144" />
					<path d="M62 248h116" opacity="0.6" />
					<path d="M76 260h88" opacity="0.35" />
					<path d="M120 154v82" opacity="0.25" />
				</g>
			{:else if variant === 1}
				<g stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M120 42v8" />
					<path d="M106 58h28l-3 8h-22l-3-8Z" />
					<path d="M98 78h44l-4 9h-36l-4-9Z" />
					<path d="M88 101h64l-5 10h-54l-5-10Z" />
					<path d="M78 126h84l-6 12h-72l-6-12Z" />
					<path d="M88 138v98" />
					<path d="M152 138v98" />
					<path d="M104 236v-38a16 16 0 0 1 32 0v38" opacity="0.7" />
					<path d="M62 236h116" />
					<path d="M50 250h140" opacity="0.6" />
					<path d="M72 264h96" opacity="0.3" />
				</g>
			{:else}
				<g stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M48 48h144v204H48z" opacity="0.45" />
					<path d="M120 68 178 126 120 184 62 126 120 68Z" />
					<path d="M120 92 154 126 120 160 86 126 120 92Z" opacity="0.65" />
					<circle cx="120" cy="126" r="6" />
					<path d="M120 184v44" opacity="0.5" />
					<path d="M104 204h32" opacity="0.5" />
					<path d="M64 68h14M64 82h8M162 68h14M168 82h8" opacity="0.4" />
					<path d="M64 230h112" opacity="0.25" />
				</g>
			{/if}
		</svg>

		<span class="absolute right-5 bottom-5 h-1.5 w-1.5 rotate-45 border border-current opacity-50"
		></span>
	</div>

	<figcaption class="flex items-start justify-between gap-4 border-b border-charcoal/12 pt-4 pb-5">
		<div>
			<p class="font-display text-xl leading-snug text-navy">{title}</p>
			<p class="mt-1.5 text-xs leading-relaxed text-muted">{caption}</p>
		</div>
		<span class="meta shrink-0 text-gold-dark">0{index + 1}</span>
	</figcaption>
</figure>
