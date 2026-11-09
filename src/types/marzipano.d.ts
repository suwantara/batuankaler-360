declare module 'marzipano' {
	export interface Size {
		width: number;
		height?: number;
		tileSize?: number;
		fallbackOnly?: boolean;
	}

	export interface SceneOptions {
		source: unknown;
		geometry: unknown;
		view: unknown;
	}

	export interface Hotspot {
		destroy(): void;
		domElement(): HTMLElement;
		setPosition(coords: { yaw: number; pitch: number }): void;
	}

	export interface HotspotContainer {
		createHotspot(
			element: HTMLElement,
			coords: { yaw: number; pitch: number },
			options?: Record<string, unknown>
		): Hotspot;
		destroyHotspot(hotspot: Hotspot): void;
		listHotspots(): Hotspot[];
	}

	export interface Scene {
		switchTo(options?: { transitionDuration?: number }): void;
		lookTo(params: { yaw: number; pitch: number; fov: number }, transitionDuration?: number): void;
		hotspotContainer(): HotspotContainer;
	}

	export interface View {
		yaw(): number;
		pitch(): number;
		fov(): number;
		setYaw(yaw: number): void;
		setPitch(pitch: number): void;
		setFov(fov: number): void;
	}

	export interface Viewer {
		createScene(options: SceneOptions): Scene;
		switchScene(scene: Scene, options?: { transitionDuration?: number }): void;
		destroyScene(scene: Scene): void;
		destroy(): void;
		updateSize(): void;
	}

	export interface ViewerOptions {
		controls?: boolean | Record<string, string | number | boolean>;
	}

	export interface ViewerConstructor {
		new (element: HTMLElement, options?: ViewerOptions): Viewer;
	}

	export interface EquirectGeometryConstructor {
		new (levels: Size[]): unknown;
	}

	export interface RectilinearViewConstructor {
		new (params: { yaw: number; pitch: number; fov: number }, limiter?: unknown): View;
		limit: {
			traditional(size: number, maxFov: number): unknown;
		};
	}

	export interface ImageUrlSourceConstructor {
		fromString(url: string, options?: Record<string, unknown>): unknown;
	}

	export interface Marzipano {
		Viewer: ViewerConstructor;
		EquirectGeometry: EquirectGeometryConstructor;
		RectilinearView: RectilinearViewConstructor;
		ImageUrlSource: ImageUrlSourceConstructor;
	}

	const marzipano: Marzipano;
	export default marzipano;
}
