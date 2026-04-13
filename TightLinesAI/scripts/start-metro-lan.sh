#!/usr/bin/env bash
# Fast path: phone + Mac on same Wi‑Fi, no tunnel.
# Requires a dev build that includes NSLocalNetworkUsageDescription (see app.json).
#
# Green dot in the dev client = the phone successfully reached Metro on :8081.
# If QR times out: Mac firewall, guest/AP isolation, wrong IP, or Local Network off.
#
# Force a specific IP (e.g. if auto-detect picks VPN): METRO_LAN_IP=192.168.1.5 npm run start:dev-client
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

is_private_ipv4() {
  local ip="$1"
  [[ "$ip" =~ ^127\. ]] && return 1
  [[ "$ip" =~ ^10\. ]] && return 0
  [[ "$ip" =~ ^192\.168\. ]] && return 0
  if [[ "$ip" =~ ^172\.([0-9]{1,3})\. ]]; then
    local o="${BASH_REMATCH[1]}"
    [[ "$o" =~ ^[0-9]+$ ]] && [[ "$o" -ge 16 && "$o" -le 31 ]] && return 0
  fi
  return 1
}

# Score: higher = better for typical home/office Wi‑Fi (easier for phones to route to).
score_ip() {
  local ip="$1"
  if [[ "$ip" =~ ^192\.168\. ]]; then echo 30; return; fi
  if [[ "$ip" =~ ^10\. ]]; then echo 20; return; fi
  if [[ "$ip" =~ ^172\. ]]; then echo 10; return; fi
  echo 0
}

collect_en_ips() {
  local i ip
  for i in $(seq 0 12); do
    ip=$(ipconfig getifaddr "en${i}" 2>/dev/null || true)
    if [[ -n "${ip:-}" ]] && is_private_ipv4 "$ip"; then
      echo "${ip} en${i}"
    fi
  done
}

pick_lan_ip() {
  if [[ -n "${METRO_LAN_IP:-}" ]]; then
    echo "$METRO_LAN_IP"
    return
  fi

  local def_if ip best_ip="" best_score=-1 best_if=""
  def_if=$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')
  def_if="${def_if:-}"

  # VPN / tunnel often owns the default route; Wi‑Fi still has the IP the phone needs.
  if [[ "$def_if" == utun* ]] || [[ "$def_if" == llw0 ]] || [[ "$def_if" == bridge* ]]; then
    def_if=""
  fi

  if [[ -n "$def_if" ]]; then
    ip=$(ipconfig getifaddr "$def_if" 2>/dev/null || true)
    if [[ -n "${ip:-}" ]] && is_private_ipv4 "$ip"; then
      best_ip="$ip"
      best_if="$def_if"
      best_score=$(score_ip "$ip")
    fi
  fi

  local line s iface_addr
  while read -r line; do
    [[ -z "$line" ]] && continue
    ip="${line%% *}"
    iface_addr="${line#* }"
    s=$(score_ip "$ip")
    if [[ "$s" -gt "$best_score" ]]; then
      best_score=$s
      best_ip="$ip"
      best_if="$iface_addr"
    fi
  done < <(collect_en_ips)

  if [[ -z "$best_ip" ]]; then
    echo ""
    return 1
  fi
  echo "$best_ip"
  return 0
}

LAN_IP="$(pick_lan_ip)" || true
if [[ -z "${LAN_IP:-}" ]]; then
  echo "Could not read a LAN IP. Connect this Mac to Wi‑Fi (or set METRO_LAN_IP) and try again."
  exit 1
fi

IFACE=""
for i in $(seq 0 12); do
  ip=$(ipconfig getifaddr "en${i}" 2>/dev/null || true)
  if [[ "$ip" == "$LAN_IP" ]]; then
    IFACE="en${i}"
    break
  fi
done
IFACE="${IFACE:-unknown}"

lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

export CI=0
export REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP"
unset EXPO_PACKAGER_PROXY_URL || true

PORT="${RCT_METRO_PORT:-8081}"
MANIFEST="http://${LAN_IP}:${PORT}"
DEV_CLIENT_URL="$(node -e "
const slug = require('./app.json').expo.slug;
const s = String(slug).replace(/[^A-Za-z0-9+\\-.]/g, '').toLowerCase();
const scheme = 'exp+' + s;
const manifest = process.argv[1];
process.stdout.write(scheme + '://expo-development-client/?url=' + encodeURIComponent(manifest));
" "$MANIFEST")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LAN Metro (same Wi‑Fi — no tunnel, fast reloads)"
echo "  Using IP: ${LAN_IP}  (interface: ${IFACE})  Port: ${PORT}"
if [[ -n "${METRO_LAN_IP:-}" ]]; then
  echo "  (METRO_LAN_IP override in effect)"
fi
echo ""
echo "  Green dot = phone can reach Metro. Grey = blocked or wrong network."
echo "  Quick check on iPhone Safari:  http://${LAN_IP}:${PORT}"
echo "    (You should see JSON/text from Metro, not a timeout.)"
echo ""
echo "  If Safari times out: guest Wi‑Fi / AP client isolation, or Mac Firewall"
echo "  blocking port ${PORT}. System Settings → Network → Firewall → allow Node."
echo ""
echo "  Preferred: TightLines dev build → Development servers → tap this Mac."
echo "  iPhone: Settings → TightLines AI → Local Network → On"
echo ""
echo "  Fallback — scan QR below, or Enter URL manually:"
echo "    ${DEV_CLIENT_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export RCT_METRO_PORT="${PORT}"
if [[ "${EXPO_START_CLEAR:-}" == "1" ]]; then
  exec npx expo start --dev-client --host lan --clear --port "${RCT_METRO_PORT}"
fi
exec npx expo start --dev-client --host lan --port "${RCT_METRO_PORT}"
