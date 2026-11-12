#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
	if [ -z "${DATABASE_URL:-}" ]; then
		echo "DATABASE_URL is required when RUN_MIGRATIONS=true." >&2
		exit 1
	fi

	attempt=1
	max_attempts=10
	until node /app/docker/migrate.mjs; do
		if [ "$attempt" -ge "$max_attempts" ]; then
			echo "Database migrations failed after ${max_attempts} attempts." >&2
			exit 1
		fi

		attempt=$((attempt + 1))
		echo "Migration attempt failed. Retrying in 3 seconds..." >&2
		sleep 3
	done
fi

if [ "${SEED_ON_START:-false}" = "true" ]; then
	echo "Seeding initial content..."
	node /app/docker/seed.mjs
fi

if [ "${CREATE_ADMIN_ON_START:-false}" = "true" ]; then
	if [ -z "${ADMIN_EMAIL:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ]; then
		echo "ADMIN_EMAIL and ADMIN_PASSWORD are required when CREATE_ADMIN_ON_START=true." >&2
		exit 1
	fi

	node /app/docker/create-admin.mjs
fi

exec "$@"
