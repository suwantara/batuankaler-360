<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';
	import type { SiteDictionary } from '#lib/i18n/dictionary.ts';
	import { localeHref } from '#lib/i18n/index.ts';
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { VisitInformationView } from '#lib/types/site-content.ts';

	let {
		content,
		data,
		lang,
		compact = false
	}: {
		content: SiteDictionary['visitInfo'];
		data: VisitInformationView;
		lang: Locale;
		compact?: boolean;
	} = $props();

	interface VisitItem {
		label: string;
		value: string;
		icon: IconName;
		href?: string;
		linkLabel?: string;
	}

	const items = $derived(
		(
			[
				{
					label: content.labels.location,
					value: data.location,
					icon: 'map-pin',
					href: data.mapUrl,
					linkLabel: content.openMap
				},
				{
					label: content.labels.hours,
					value: data.visitingHours,
					icon: 'compass'
				},
				{
					label: content.labels.access,
					value: data.access,
					icon: 'arrow-up-right'
				},
				{
					label: content.labels.dressCode,
					value: data.dressCode,
					icon: 'user'
				},
				{
					label: content.labels.photoPolicy,
					value: data.photoPolicy,
					icon: 'image'
				},
				{
					label: content.labels.etiquette,
					value: data.etiquette,
					icon: 'info'
				},
				{
					label: content.labels.contact,
					value: data.contact,
					icon: 'globe'
				}
			] satisfies VisitItem[]
		).filter((item) => item.value.trim().length > 0)
	);

	const updatedLabel = $derived(
		new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
			dateStyle: 'medium',
			timeZone: 'Asia/Makassar'
		}).format(new Date(data.updatedAt))
	);

	const guideHref = $derived(localeHref(lang, '/panduan'));
</script>

<!-- Tautan eksternal berasal dari data terverifikasi dan divalidasi sebagai http(s) di server. -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#snippet managerLink()}
	{#if data.managerUrl}
		<a
			href={data.managerUrl}
			target="_blank"
			rel="noreferrer"
			class="inline-flex items-center gap-2 underline decoration-gold-dark/40 underline-offset-4 transition-colors hover:text-gold-dark"
		>
			{data.managerName}
			<Icon name="external" class="h-3.5 w-3.5" />
		</a>
	{:else}
		{data.managerName}
	{/if}
{/snippet}

{#snippet visitItems(columns: string)}
	{#if items.length === 0}
		<p class="surface surface--sand p-5 text-sm leading-relaxed text-muted">{content.empty}</p>
	{:else}
		<dl class={columns}>
			{#each items as item (item.label)}
				<div class="border-t border-charcoal/12 py-5">
					<dt class="flex items-center gap-2 text-xs font-semibold text-gold-dark">
						<Icon name={item.icon} class="h-4 w-4" />
						{item.label}
					</dt>
					<dd class="mt-2 text-sm leading-relaxed whitespace-pre-line text-body">
						{item.value}
					</dd>
					{#if item.href && item.linkLabel}
						<a href={item.href} target="_blank" rel="noreferrer" class="link-arrow mt-3">
							{item.linkLabel}
							<Icon name="external" class="h-3.5 w-3.5" />
						</a>
					{/if}
				</div>
			{/each}
		</dl>
	{/if}
{/snippet}

<section
	id="informasi-kunjungan"
	class="section section--tight section--ivory scroll-mt-24 border-b border-charcoal/10"
>
	{#if compact}
		<div class="container-page">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<p class="eyebrow">{content.eyebrow}</p>
				{#if data.heritageLabel}
					<span class="badge badge--gold">{data.heritageLabel}</span>
				{/if}
			</div>

			{#if data.verificationNote}
				<p class="mt-3 flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-muted">
					<Icon name="info" class="mt-0.5 h-4 w-4 shrink-0 text-gold-dark/70" />
					<span>{data.verificationNote}</span>
				</p>
			{/if}

			<div class="mt-8">
				{@render visitItems('grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3')}
			</div>

			<div
				class="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-charcoal/12 pt-5"
			>
				{#if data.managerName}
					<div>
						<p class="meta text-[0.65rem] text-muted">{content.labels.manager}</p>
						<p class="mt-1.5 text-sm font-semibold text-navy">{@render managerLink()}</p>
					</div>
				{/if}
				<p class="text-xs text-muted">{content.updated}: {updatedLabel}</p>
			</div>

			{#if data.fallbackUsed}
				<div class="alert alert--info mt-5">{content.fallback}</div>
			{/if}
		</div>
	{:else}
		<div class="container-page grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
			<div>
				<p class="eyebrow">{content.eyebrow}</p>
				<h2 class="display-lg mt-4 text-navy">{content.title}</h2>
				<p class="body-copy mt-4 max-w-md">{content.description}</p>

				{#if data.heritageLabel}
					<div class="mt-6 flex flex-wrap items-center gap-2">
						<span class="badge badge--gold">{data.heritageLabel}</span>
					</div>
				{/if}

				{#if data.verificationNote}
					<p class="mt-4 flex max-w-md items-start gap-2 text-xs leading-relaxed text-muted">
						<Icon name="info" class="mt-0.5 h-4 w-4 shrink-0 text-gold-dark/70" />
						<span>{data.verificationNote}</span>
					</p>
				{/if}

				{#if data.managerName}
					<div class="mt-6 border-t border-charcoal/10 pt-4">
						<p class="meta text-[0.65rem] text-muted">{content.labels.manager}</p>
						<p class="mt-2 text-sm font-semibold text-navy">{@render managerLink()}</p>
					</div>
				{/if}
			</div>

			<div>
				{@render visitItems('grid gap-x-8 gap-y-0 sm:grid-cols-2')}

				<div
					class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/12 pt-5"
				>
					<p class="text-xs text-muted">{content.updated}: {updatedLabel}</p>
					<a href={guideHref} class="link-arrow">
						{content.guideLink}
						<Icon name="arrow-right" class="h-3.5 w-3.5" />
					</a>
				</div>

				{#if data.fallbackUsed}
					<div class="alert alert--info mt-5">{content.fallback}</div>
				{/if}
			</div>
		</div>
	{/if}
</section>
