#!/usr/bin/env bash
# Local security scan — mirrors .github/workflows/security.yml so you can catch
# issues before pushing. Layers whose tool is missing are SKIPPED (not failed);
# install hints are printed. Run with: pnpm run security
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

fail=0
note() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }
skip() { printf '   \033[33mSKIPPED:\033[0m %s\n' "$1"; }

# 1. Dependency CVEs ---------------------------------------------------------
# Blocking on production deps (what ships); report-only on the full tree
# (dev-tooling CVEs that never reach the runtime bundle). Mirrors CI.
if command -v pnpm >/dev/null 2>&1; then
  note "Dependency audit — production (pnpm audit --prod --audit-level=high)"
  if pnpm audit --prod --audit-level=high; then
    echo "   OK: no high/critical advisories in production deps"
  else
    echo "   FAIL: high/critical advisories in production deps (run 'pnpm audit --prod')"
    fail=1
  fi

  note "Dependency audit — full tree (report-only)"
  if pnpm audit >/dev/null 2>&1; then
    echo "   OK: no advisories anywhere"
  else
    echo "   WARN: dev-tooling advisories present (run 'pnpm audit' for detail)"
  fi
else
  skip "pnpm not found"
fi

# 2. SAST --------------------------------------------------------------------
note "Static analysis (Semgrep)"
if command -v semgrep >/dev/null 2>&1; then
  if semgrep scan \
      --config p/javascript --config p/typescript --config p/react \
      --config p/nodejs --config p/secrets --config p/owasp-top-ten \
      --error --quiet; then
    echo "   OK: no findings"
  else
    echo "   FAIL: Semgrep findings above"
    fail=1
  fi
else
  skip "semgrep not installed — 'pipx install semgrep' or 'brew install semgrep'"
fi

# 3. Secret scanning ---------------------------------------------------------
note "Secret scan (Gitleaks)"
if command -v gitleaks >/dev/null 2>&1; then
  if gitleaks detect --source . --redact --exit-code 1 --config .gitleaks.toml; then
    echo "   OK: no secrets detected"
  else
    echo "   FAIL: potential secrets found above"
    fail=1
  fi
else
  skip "gitleaks not installed — 'brew install gitleaks' or see github.com/gitleaks/gitleaks"
fi

echo
if [ "$fail" -ne 0 ]; then
  printf '\033[31mSecurity scan FAILED.\033[0m\n'
  exit 1
fi
printf '\033[32mSecurity scan passed (skipped layers are not failures).\033[0m\n'
