<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Icon from '#lib/components/ui/Icon.svelte';
	import type { IconName } from '#lib/components/ui/icons.ts';

	interface WorkflowStep {
		key: 'media' | 'scene' | 'hotspot';
		label: string;
		hint: string;
		href: string;
		icon: IconName;
	}

	const steps: WorkflowStep[] = [
		{
			key: 'media',
			label: 'Media',
			hint: 'Unggah panorama',
			href: resolve('admin/media'),
			icon: 'image'
		},
		{
			key: 'scene',
			label: 'Scene',
			hint: 'Hubungkan aset & tampilan',
			href: resolve('admin/scenes'),
			icon: 'layers'
		},
		{
			key: 'hotspot',
			label: 'Hotspot',
			hint: 'Tambah interaksi',
			href: resolve('admin/hotspots'),
			icon: 'map-pin'
		}
	];

	const path = $derived(page.url.pathname);

	function activeStep(): WorkflowStep['key'] | null {
		if (path.startsWith('/admin/scenes/') && path.includes('/hotspots')) return 'hotspot';
		if (path.startsWith('/admin/scenes')) return 'scene';
		if (path.startsWith('/admin/hotspots')) return 'hotspot';
		if (path.startsWith('/admin/media')) return 'media';
		return null;
	}

	const active = $derived(activeStep());
</script>

<nav
	class="surface flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:gap-3"
	aria-label="Alur pengelolaan konten"
>
	<p class="meta shrink-0 px-2 text-[0.58rem] text-muted">Alur konten</p>
	<ol class="grid min-w-0 flex-1 grid-cols-3 gap-1">
		{#each steps as step, index (step.key)}
			{@const isActive = active === step.key}
			<li class="min-w-0">
				<a
					href={step.href}
					aria-current={isActive ? 'step' : undefined}
					class="flex min-w-0 items-center gap-2 rounded-xs px-2 py-1.5 transition-colors {isActive
						? 'bg-gold/15 text-heading'
						: 'text-muted hover:bg-line/[0.04] hover:text-heading'}"
				>
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.62rem] font-semibold {isActive
							? 'border-gold-dark/35 bg-gold/20 text-heading'
							: 'border-line/15 text-muted'}"
					>
						{String(index + 1).padStart(2, '0')}
					</span>
					<span class="min-w-0">
						<span class="flex items-center gap-1 text-xs font-semibold">
							{step.label}
							{#if isActive}
								<Icon name={step.icon} class="h-3 w-3" />
							{/if}
						</span>
						<span class="hidden truncate text-[0.65rem] leading-snug sm:block">{step.hint}</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>
</nav>
