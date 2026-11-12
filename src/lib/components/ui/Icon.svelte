<script lang="ts">
	import type { IconName } from './icons.ts';

	let {
		name,
		class: className = 'h-5 w-5',
		strokeWidth = 1.5
	}: { name: IconName; class?: string; strokeWidth?: number } = $props();

	const paths: Record<IconName, string[]> = {
		alert: ['M12 3 2.7 20h18.6L12 3Z', 'M12 9v4', 'M12 17h.01'],
		'arrow-left': ['M20 12H4', 'm11 19-7-7 7-7'],
		'arrow-right': ['M4 12h16', 'm13 5 7 7-7 7'],
		'arrow-up-right': ['M7 17 17 7', 'M8 7h9v9'],
		check: ['m5 12 4.5 4.5L19 7'],
		'chevron-down': ['m6 9 6 6 6-6'],
		'chevron-right': ['m9 6 6 6-6 6'],
		close: ['m6 6 12 12', 'M18 6 6 18'],
		compass: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'm15.5 8.5-2 5-5 2 2-5 5-2Z'],
		cube: ['m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z', 'M12 12l8-4.5', 'M12 12v9', 'M12 12 4 7.5'],
		expand: ['M8 3H3v5', 'M16 3h5v5', 'M21 16v5h-5', 'M3 16v5h5'],
		external: [
			'M14 4h6v6',
			'M20 4 10 14',
			'M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4'
		],
		eye: [
			'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z',
			'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
		],
		file: [
			'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z',
			'M14 3v5h5',
			'M9 13h6',
			'M9 17h6'
		],
		globe: [
			'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
			'M3 12h18',
			'M12 3a14 14 0 0 1 0 18',
			'M12 3a14 14 0 0 0 0 18'
		],
		grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
		image: [
			'M4 4h16v16H4z',
			'M8.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
			'm4 17 5-5 4 4 2.5-2.5L20 18'
		],
		info: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M12 11v5', 'M12 8h.01'],
		layers: ['m12 3 9 5-9 5-9-5 9-5Z', 'm3 12 9 5 9-5', 'm3 16 9 5 9-5'],
		logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
		'map-pin': [
			'M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z',
			'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'
		],
		menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
		minus: ['M5 12h14'],
		play: ['M8 5v14l11-7L8 5Z'],
		plus: ['M12 5v14', 'M5 12h14'],
		reset: ['M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5'],
		settings: [
			'M4 6h9',
			'M17 6h3',
			'M4 12h3',
			'M11 12h9',
			'M4 18h9',
			'M17 18h3',
			'M15 4v4',
			'M9 10v4',
			'M15 16v4'
		],
		shrink: ['M8 3v5H3', 'M16 3v5h5', 'M21 16h-5v5', 'M3 16h5v5'],
		sun: [
			'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
			'M12 2v2',
			'M12 20v2',
			'M4.93 4.93l1.41 1.41',
			'M17.66 17.66l1.41 1.41',
			'M2 12h2',
			'M20 12h2',
			'M4.93 19.07l1.41-1.41',
			'M17.66 6.34l1.41-1.41'
		],
		moon: ['M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z'],
		trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 14h10l1-14', 'M10 11v6', 'M14 11v6'],
		upload: ['M12 16V4', 'm7 9 5-5 5 5', 'M4 20h16'],
		user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21a8 8 0 0 1 16 0']
	};
</script>

<svg class={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
	{#each paths[name] as path (path)}
		<path
			d={path}
			stroke="currentColor"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{/each}
</svg>
