export class AppError extends Error {
	constructor(
		message: string,
		public readonly code: string,
		public readonly status = 400
	) {
		super(message);
		this.name = new.target.name;
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 'VALIDATION_ERROR', 400);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string) {
		super(message, 'NOT_FOUND', 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 'CONFLICT', 409);
	}
}

export class StorageError extends AppError {
	constructor(message: string) {
		super(message, 'STORAGE_ERROR', 500);
	}
}
