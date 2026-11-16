export interface PanoramaLevel {
	width: number;
	height?: number;
	tileSize?: number;
	fallbackOnly?: boolean;
}

export interface PanoramaConfig {
	levels?: PanoramaLevel[];
	faceSize?: number;
	tileSize?: number;
	format?: string;
}

export interface PanoramaViewParams {
	yaw: number;
	pitch: number;
	fov: number;
}

export interface PanoramaViewerHandle {
	captureThumbnail(view: PanoramaViewParams): Promise<string>;
}
