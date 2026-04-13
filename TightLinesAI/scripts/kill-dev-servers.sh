#!/usr/bin/env bash
# Stop Metro, duplicate tunnels, and stray packagers so a single dev session can bind cleanly.
set -euo pipefail

echo "Stopping Metro / Expo packager on 8081–8083…"
for port in 8081 8082 8083; do
  lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
done
sleep 1

echo "Stopping localtunnel instances forwarding port 8081…"
pkill -f "localtunnel --port 8081" 2>/dev/null || true
pkill -f "npx.*localtunnel.*8081" 2>/dev/null || true
echo "Stopping Cloudflare quick tunnels targeting local Metro…"
pkill -f "cloudflared tunnel --url http://127.0.0.1:" 2>/dev/null || true
sleep 1

echo "Done. Ports:"
for port in 8081 8082 8083; do
  if lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "  WARNING: something still listening on $port"
    lsof -iTCP:"$port" -sTCP:LISTEN
  else
    echo "  $port: free"
  fi
done
