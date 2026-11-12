<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import Ornament from '#lib/components/ui/Ornament.svelte';
	import { resolve } from '$app/paths';
	import { dictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/index.ts';

	let {
		status,
		lang,
		audience = 'public'
	}: {
		status: number;
		lang: Locale;
		audience?: 'public' | 'admin';
	} = $props();

	const labels = $derived(dictionary[lang].errorPage);
	const isAdmin = $derived(audience === 'admin');
	const homeHref = $derived(resolve(lang));
	const tourHref = $derived(resolve(`${lang}/tour`));
	const adminHref = $derived(resolve(status === 401 ? 'admin/login' : 'admin/dashboard'));

	const copy = $derived.by(() => {
		if (status === 404) {
			return { title: labels.notFoundTitle, body: labels.notFoundBody };
		}

		if (status === 401) {
			return { title: labels.unauthorizedTitle, body: labels.unauthorizedBody };
		}

		if (status === 403) {
			return { title: labels.forbiddenTitle, body: labels.forbiddenBody };
		}

		if (status >= 500) {
			return { title: labels.serverTitle, body: labels.serverBody };
		}

		return { title: labels.genericTitle, body: labels.genericBody };
	});
</script>

<section class="section section--tight w-full" aria-labelledby="error-title">
	<div
		class="container-page grid gap-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-center lg:gap-20"
	>
		<div class="flex flex-col items-start gap-6">
			<p class="eyebrow">{labels.eyebrow}</p>
			<p
				class="font-display text-[clamp(4.5rem,12vw,9rem)] leading-[0.78] font-medium tracking-tight text-gold-dark/20"
				aria-hidden="true"
			>
				{status}
			</p>
			<Ornament class="h-3 w-44 text-gold-dark/40" />
		</div>

		<div class="max-w-2xl">
			<h1 id="error-title" class="display-lg text-navy">{copy.title}</h1>
			<p class="body-copy mt-5">{copy.body}</p>

			<div class="mt-8 flex flex-wrap items-center gap-3">
				{#if isAdmin}
					<a href={adminHref} class="btn btn--primary">
						<Icon name={status === 401 ? 'user' : 'grid'} class="h-4 w-4" />
						{status === 401 ? labels.login : labels.dashboard}
					</a>
					<a href={homeHref} class="btn btn--outline">
						{labels.publicSite}
						<Icon name="external" class="h-4 w-4" />
					</a>
				{:else}
					<a href={homeHref} class="btn btn--primary">
						{labels.backHome}
						<Icon name="arrow-right" class="h-4 w-4" />
					</a>
					<a href={tourHref} class="btn btn--outline">
						<Icon name="compass" class="h-4 w-4" />
						{labels.openTour}
					</a>
				{/if}

				<button type="button" class="btn btn--ghost" onclick={() => window.location.reload()}>
					<Icon name="reset" class="h-3.5 w-3.5" />
					{labels.retry}
				</button>
			</div>

			<p class="mt-7 border-t border-charcoal/10 pt-5 text-xs leading-relaxed text-muted">
				{isAdmin ? labels.adminHelp : labels.help}
			</p>
		</div>
	</div>
</section>
