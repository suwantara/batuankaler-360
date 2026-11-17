#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
	echo "DATABASE_URL is required to create a backup." >&2
	exit 1
fi

UPLOAD_DIR="${UPLOAD_DIR:-/app/uploads}"
BACKUP_DIR="${BACKUP_DIR:-${UPLOAD_DIR}/backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$BACKUP_DIR"

DATABASE_FILE="${BACKUP_DIR}/database-${STAMP}.dump"
UPLOADS_FILE="${BACKUP_DIR}/uploads-${STAMP}.tar.gz"
MANIFEST_FILE="${BACKUP_DIR}/manifest-${STAMP}.txt"

pg_dump "$DATABASE_URL" \
	--format=custom \
	--no-owner \
	--no-privileges \
	--file="$DATABASE_FILE"

if [ -d "$UPLOAD_DIR" ]; then
	tar -czf "$UPLOADS_FILE" --exclude='./backups' -C "$UPLOAD_DIR" .
fi

cat > "$MANIFEST_FILE" <<EOF
Pura Batuan Kaler 360 backup
Created: ${STAMP}
Database: $(basename "$DATABASE_FILE")
Uploads: $(basename "$UPLOADS_FILE")
Retention: ${RETENTION_DAYS} days
EOF

find "$BACKUP_DIR" -type f -mtime +"$RETENTION_DAYS" -delete

echo "Backup selesai:"
ls -lh "$DATABASE_FILE" "$UPLOADS_FILE" "$MANIFEST_FILE"
