#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
	echo "DATABASE_URL is required to restore a backup." >&2
	exit 1
fi

if [ "$#" -lt 1 ]; then
	echo "Usage: restore.sh <database-*.dump> [uploads-*.tar.gz]" >&2
	exit 1
fi

DATABASE_FILE="$1"
UPLOADS_FILE="${2:-}"
UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"

if [ ! -f "$DATABASE_FILE" ]; then
	echo "Database backup not found: $DATABASE_FILE" >&2
	exit 1
fi

pg_restore \
	--clean \
	--if-exists \
	--no-owner \
	--no-privileges \
	--dbname="$DATABASE_URL" \
	"$DATABASE_FILE"

echo "Database restored from $DATABASE_FILE."

if [ -n "$UPLOADS_FILE" ]; then
	if [ ! -f "$UPLOADS_FILE" ]; then
		echo "Uploads backup not found: $UPLOADS_FILE" >&2
		exit 1
	fi

	mkdir -p "$UPLOAD_DIR"
	tar -xzf "$UPLOADS_FILE" -C "$UPLOAD_DIR"
	echo "Uploads restored from $UPLOADS_FILE."
fi
