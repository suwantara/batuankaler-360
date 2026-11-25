export interface HotspotElementOptions {
	label: string;
	type: 'navigation' | 'information';
	onClick: () => void;
}

export function createHotspotElement({ label, type, onClick }: HotspotElementOptions): HTMLElement {
	const root = document.createElement('div');
	root.className = 'hotspot-root';

	const button = document.createElement('button');
	button.type = 'button';
	button.className = `hotspot hotspot--${type}`;
	button.setAttribute('aria-label', label);
	button.title = label;

	const icon = document.createElement('span');
	icon.className = 'hotspot__icon';
	icon.textContent = type === 'navigation' ? '→' : 'i';
	icon.setAttribute('aria-hidden', 'true');

	const text = document.createElement('span');
	text.className = 'hotspot__label';
	text.textContent = label;

	button.append(icon, text);

	let pulseTimer = 0;

	button.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopPropagation();

		if (!button.classList.contains('hotspot--active')) {
			button.classList.add('hotspot--active');
			window.clearTimeout(pulseTimer);
			pulseTimer = window.setTimeout(() => button.classList.remove('hotspot--active'), 650);
		}

		// Navigasi antar scene diberi jeda singkat agar animasi klik terlihat
		// sebelum crossfade panorama berjalan.
		if (type === 'navigation') {
			window.setTimeout(onClick, 340);
		} else {
			onClick();
		}
	});

	root.append(button);
	return root;
}
