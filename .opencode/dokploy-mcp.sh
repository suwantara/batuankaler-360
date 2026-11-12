#!/bin/sh
set -eu

ENV_FILE="${DOKPLOY_ENV_FILE:-$HOME/.config/opencode/dokploy.env}"

if [ ! -f "$ENV_FILE" ]; then
	echo "Dokploy environment file not found: $ENV_FILE" >&2
	echo "Create it from docs/dokploy.env.example and try again." >&2
	exit 1
fi

set -a
. "$ENV_FILE"
set +a

exec npx -y @dokploy/mcp
