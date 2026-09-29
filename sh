#!/usr/bin/env bash
# ==============================================================================
# Script: sh
# Purpose: GitHub and Vercel build/deploy automation script
# Target: https://school-tau-pearl.vercel.app/
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "$DIR/deploy.sh" "$@"
