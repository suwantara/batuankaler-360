<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { SiteDictionary } from '#lib/i18n/dictionary.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import {
		googleMapsDirectionsUrl,
		googleMapsEmbedUrl,
		googleMapsPlaceUrl
	} from '#lib/location.ts';

	let {
		content,
		lang
	}: {
		content: SiteDictionary['locationMap'];
		lang: Locale;
	} = $props();

	const embedUrl = $derived(googleMapsEmbedUrl(lang));
	const placeUrl = googleMapsPlaceUrl();
	const directionsUrl = googleMapsDirectionsUrl();
</script>

<!-- Tautan eksternal berasal dari lokasi terverifikasi. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->

<section class="section section--sand" aria-labelledby="location-map-title">
	<div class="container-page grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
		<div>
			<p class="eyebrow">{content.eyebrow}</p>
			<h2 id="location-map-title" class="display-xl mt-6 text-navy">{content.title}</h2>
			<p class="body-copy mt-5 max-w-md">{content.description}</p>

			<div class="mt-8 border-t border-charcoal/12 pt-5">
				<p class="meta text-gold-dark">{content.addressLabel}</p>
				<p class="mt-2 max-w-sm text-sm leading-relaxed text-body">{content.address}</p>
			</div>

			<div class="mt-6 flex flex-wrap gap-3">
				<a href={placeUrl} target="_blank" rel="noreferrer" class="btn btn--primary btn--sm">
					{content.openMap}
					<Icon name="external" class="h-3.5 w-3.5" />
				</a>
				<a href={directionsUrl} target="_blank" rel="noreferrer" class="btn btn--outline btn--sm">
					{content.directions}
					<Icon name="arrow-up-right" class="h-3.5 w-3.5" />
				</a>
			</div>

			<p class="mt-4 max-w-sm text-xs leading-relaxed text-muted">{content.note}</p>
		</div>

		<div class="relative">
			<div class="absolute -inset-2 border border-gold-dark/25" aria-hidden="true"></div>
			<div class="relative overflow-hidden border border-charcoal/15 bg-sand">
				<iframe
					title={content.mapTitle}
					src={embedUrl}
					class="aspect-[4/3] w-full sm:aspect-[16/10]"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</div>
</section>
