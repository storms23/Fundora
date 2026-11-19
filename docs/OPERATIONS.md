# Operations notes

Status: updated 19 November 2026 after Fundora CI/CD and bounded self-heal. Preview is live; Freighter/Testnet submission for Phase 11 needs the operator at the wallet.

## Local development (no cloud required)

1. Install Docker Desktop, Node 22+, and use the repo `web/` npm toolchain.
2. From the repo root: `npx supabase start` (uses `supabase/config.toml`; signups disabled).
3. Copy `web/.env.example` → `web/.env.local` and fill values from `npx supabase status`.
4. `npm --prefix web install`
5. `npm --prefix web run dev` → http://127.0.0.1:3000
6. Contract tests: `cargo test --manifest-path contracts/award/Cargo.toml --locked`
7. App unit tests: `npm --prefix web test`

## Hosted preview

- URL: https://proofpay-preview.vercel.app
- Supabase project: `proofpay-preview` (`vttmpwgtnfpowgwdwcwz`)
- Preview env keeps `STELLAR_USE_FAKE_RPC=1` and `STELLAR_ALLOW_SUBMISSION=0`
- Free-tier notes: Supabase Free pauses after **7 idle days** and has **no automatic backups**. Dump before risky changes: `npx supabase db dump`.
- Vercel Hobby is **personal / non-commercial** (POC/MVP only).

## CI/CD

### Canonical deploy target

| Item | Value |
|---|---|
| Vercel project | **`fundora` only** (`jefferson-tuparans-projects/fundora`) |
| Root directory | **`web`** (repo root is not the Next app) |
| Framework | Next.js, Node **22.x** |
| Production URL | https://proofpay-preview.vercel.app |
| GitHub repo | `storms23/Fundora` |

Do **not** create or link an empty Vercel project named `web`. That mis-check failed PR #5. If a PR shows a Vercel failure for the wrong project, unlink it and keep only `fundora`.

### GitHub Actions

| Workflow | File | When | Jobs |
|---|---|---|---|
| **CI** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | PR / push to `main` or `dev` | `web` (lint, typecheck, unit tests, build), `contracts` (`cargo test --locked`) |
| **Preview smoke** | [`.github/workflows/smoke.yml`](../.github/workflows/smoke.yml) | Push to `main`, or manual `workflow_dispatch` | HTTP 200 for `/` and `/sponsors` on the preview URL |

CI uses FakeRpc-safe stub env only (`STELLAR_ALLOW_SUBMISSION=0`, `STELLAR_USE_FAKE_RPC=1`). It never sets Freighter wallets, service-role production keys, or Mainnet flags. Playwright and Freighter E2E stay out of CI until separately authorized.

Required status checks for merge (once branch protection is on): **`web`**, **`contracts`**, and **Vercel** (from project `fundora`).

### Bounded self-heal

What we do:

- Cancel in-progress CI runs on the same PR/ref (`concurrency`).
- Operator **Re-run failed jobs** once for infra flakes (runner outage, network). Do not treat product test failures as flakes.
- Preview smoke detects a bad production deploy (non-200 on `/` or `/sponsors`). Smoke **does not** auto-revert or force-push.
- Product reconcile: `POST /api/v1/cron/reconcile` with `Authorization: Bearer $CRON_SECRET` for stuck `SUBMITTED` / `UNKNOWN` / `SIGNED` ops after Phase 11 Freighter runs. CI must not call this against live Testnet without explicit authorization.

What we do **not** do:

- Auto-merge, AI auto-fix PRs, or inventing Testnet evidence.
- Silent rewrite of `main` history.
- Paid monitoring or Mainnet pipelines.

### Runbooks

**Wrong Vercel project / root**

1. Confirm the failing check URL is under `…/fundora/…`, not an empty `web` project.
2. In Vercel → Project Settings → General: Root Directory = `web`.
3. Redeploy or push an empty commit only if needed to retrigger.

**Smoke failed after merge**

1. Open the failed **Preview smoke** run and the Vercel deployment logs.
2. Roll back the deployment in Vercel **or** revert the bad commit on `main` (prefer revert over force-push).
3. Re-run **Preview smoke** via Actions → workflow_dispatch when the host is healthy again.

**Supabase Free paused (idle ~7 days)**

1. Preview returns 5xx or auth/DB errors.
2. Unpause the Supabase project in the dashboard; confirm Vercel env still matches.
3. Re-smoke `/` and `/sponsors`.

**Flaky CI**

1. Confirm the failure is runner/network (not assertion/lint).
2. Actions → Re-run failed jobs (once).
3. If it fails again the same way, fix the product or workflow — do not keep re-running.

### Branch protection (manual GitHub settings)

After CI has at least one green run on `main`:

1. GitHub → `storms23/Fundora` → Settings → Branches → Add rule for `main`.
2. Enable **Require a pull request before merging**.
3. Enable **Require status checks to pass before merging** and select: `web`, `contracts`, `Vercel`.
4. Enable **Do not allow bypassing the above settings** for admins if the team agrees.
5. Disable force-pushes to `main`.
6. Leave `dev` unprotected or mirror the same checks once it tracks `main`.

Branch protection cannot be fully expressed in repo files; an org/repo admin must click these settings.

## Live Testnet (Phase 11)

Local flags only when authorized:

- `STELLAR_USE_FAKE_RPC=0`
- `STELLAR_ALLOW_SUBMISSION=1`
- `STELLAR_WASM_HASH=<installed award WASM hash>`

Freighter must sign recipient SUBMIT, verifier APPROVE, and sponsor PAY. See [FREIGHTER_SMOKE_RESUME.md](implementation/FREIGHTER_SMOKE_RESUME.md) and [PHASE10_CUTOVER_AND_PHASE11.md](implementation/PHASE10_CUTOVER_AND_PHASE11.md).

## Secrets

Never commit `.env.local`, service-role keys, wallet secrets, or personal evidence. Browser code receives no server secrets. CI rejects a committed `web/.env.local` or root `.env.local`.

## Django rollback

Product Django packages were removed in Phase 10. Full restore: `git checkout django-final`. Archived golden test sources: `oracle/django-tests/`.
