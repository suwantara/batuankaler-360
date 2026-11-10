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
