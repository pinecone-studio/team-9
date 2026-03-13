#!/bin/bash

ENV_FILE="libs/tools/.env"

mkdir -p "$(dirname "$ENV_FILE")"

if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
fi

echo "base=$NX_BASE" >"$ENV_FILE"
echo "head=$NX_HEAD" >>"$ENV_FILE"
echo "CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN" >>"$ENV_FILE"
echo "CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID" >>"$ENV_FILE"

cat "$ENV_FILE"
