<script lang="ts">
	import type { Locale } from '#lib/i18n/locales.ts';
	import type { TourScene } from '#lib/tour/scenes.ts';

	interface Node {
		scene: TourScene;
		index: number;
		x: number;
		y: number;
	}

	interface Edge {
		key: string;
		from: Node;
		to: Node;
		active: boolean;
	}

	let {
		scenes,
		activeSceneId,
		onNavigate,
		lang,
		hint
	}: {
		scenes: TourScene[];
		activeSceneId: string;
		onNavigate: (sceneId: string) => void;
		lang: Locale;
		hint: string;
	} = $props();

	const nodes = $derived.by<Node[]>(() => {
		const count = scenes.length;

		if (count === 0) return [];
		if (count === 1) return [{ scene: scenes[0], index: 0, x: 50, y: 50 }];
		if (count === 2) {
			return scenes.map((scene, index) => ({
				scene,
				index,
				x: index === 0 ? 30 : 70,
				y: 50
			}));
		}

		const radiusX = 33;
		const radiusY = 31;

		return scenes.map((scene, index) => {
			const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;

			return {
				scene,
				index,
				x: 50 + radiusX * Math.cos(angle),
				y: 50 + radiusY * Math.sin(angle)
			};
		});
	});

	const positions = $derived(new Map(nodes.map((node) => [node.scene.id, node])));

	const edges = $derived.by<Edge[]>(() => {
		// Local deduplication only; this Set is not reactive state.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const seen = new Set<string>();
		const result: Edge[] = [];

		for (const node of nodes) {
			for (const hotspot of node.scene.hotspots) {
				if (hotspot.type !== 'navigation') continue;

				const target = positions.get(hotspot.targetSceneId);

				if (!target || target.scene.id === node.scene.id) continue;

				const key = [node.scene.id, target.scene.id].sort().join(':');

				if (seen.has(key)) continue;

				seen.add(key);
				result.push({
					key,
					from: node,
					to: target,
					active: node.scene.id === activeSceneId || target.scene.id === activeSceneId
				});
			}
		}

		return result;
	});

	function title(scene: TourScene): string {
		return scene.translations[lang].title;
	}

	function number(index: number): string {
		return String(index + 1).padStart(2, '0');
	}
</script>

<div
	class="relative mt-3 aspect-[16/9] min-h-40 overflow-hidden border border-ivory/10 bg-ivory/[0.025]"
>
	<svg
		viewBox="0 0 100 100"
		preserveAspectRatio="none"
		class="absolute inset-0 h-full w-full"
		aria-hidden="true"
	>
		{#each edges as edge (edge.key)}
			<line
				x1={edge.from.x}
				y1={edge.from.y}
				x2={edge.to.x}
				y2={edge.to.y}
				stroke={edge.active ? 'var(--color-gold)' : 'rgba(244, 238, 220, 0.2)'}
				stroke-width={edge.active ? 0.8 : 0.5}
				stroke-dasharray={edge.active ? undefined : '1.5 1.5'}
			/>
		{/each}
	</svg>

	{#each nodes as node (node.scene.id)}
		{@const isActive = node.scene.id === activeSceneId}
		<button
			type="button"
			onclick={() => onNavigate(node.scene.id)}
			aria-pressed={isActive}
			aria-label={title(node.scene)}
			title={title(node.scene)}
			class="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-display text-[0.65rem] transition-colors {isActive
				? 'border-gold bg-gold text-ink'
				: 'border-ivory/25 bg-navy-deep text-ivory/65 hover:border-gold-light/60 hover:text-ivory'}"
			style={`left:${node.x}%;top:${node.y}%`}
		>
			{number(node.index)}
		</button>
	{/each}
</div>

<p class="mt-3 text-xs leading-relaxed text-ivory/55">{hint}</p>

<ol class="mt-3 grid gap-1">
	{#each nodes as node (node.scene.id)}
		<li>
			<button
				type="button"
				onclick={() => onNavigate(node.scene.id)}
				aria-pressed={node.scene.id === activeSceneId}
				class="flex w-full items-center gap-2 py-1 text-left text-xs transition-colors {node.scene
					.id === activeSceneId
					? 'text-gold-light'
					: 'text-ivory/55 hover:text-ivory'}"
			>
				<span class="font-display text-[0.65rem]">{number(node.index)}</span>
				<span class="truncate">{title(node.scene)}</span>
			</button>
		</li>
	{/each}
</ol>
