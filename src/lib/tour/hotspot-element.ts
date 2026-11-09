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
	button.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopPropagation();
		onClick();
	});

	root.append(button);
	return root;
}
