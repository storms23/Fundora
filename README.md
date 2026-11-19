<p align="center">
  <img src="docs/brand/fundora-logo.png" alt="Fundora" width="280" />
</p>

<p align="center"><strong>Open. Verify. Transact.</strong></p>

# Fundora

**Fundora** helps sponsors fund community projects and release payment after completion is verified. A sponsor funds an award, a recipient submits private evidence, an independent verifier approves it, then the sponsor releases payment on **Stellar** — so money moves with a clear proof trail, not on trust alone.

**Live app:** [proofpay-preview.vercel.app](https://proofpay-preview.vercel.app). Visitors land on the Fundora story first; **Sign in** opens the workspace doors. An administrator provisions accounts and project access.

## Contents

- [About](#about) · [Roles](#who-its-for) · [Award workflow](#how-it-works)
- [Architecture](#architecture) · [Tech stack and layout](#tech-stack--layout) · [Status](#status)
- [Quickstart](#quickstart) · [Local test credentials](#local-test-credentials) · [Walkthrough](#local-walkthrough)
- [Development checks](#development-checks) · [Troubleshooting](#troubleshooting) · [Security and privacy](#security--privacy)
- [Contributing](#contributing) · [Contributors](#contributors) · [Documentation](#docs-for-builders--agents) · [License](#license)

---

## About

Fundora is built for **community activities with verifiable outcomes**. Sponsors define fixed award terms, recipients upload completion evidence privately, verifiers decide independently, and sponsors authorize payout. Evidence stays off-chain; Stellar records the approvals and transfers your organization can audit.

Brand values:

| | |
|---|---|
| **Trust & Transparency** | Separated roles; approvals and payouts are inspectable on-chain |
| **Community Empowerment** | Designed for community projects with clearly defined outcomes |
| **Blockchain-Ready** | Soroban award contracts with Freighter wallet signing |

Logo & brand kit: [docs/brand/](docs/brand/)

---

## Who it’s for

| Role | Does | Cannot |
|---|---|---|
| **Sponsor** | Set terms, fund awards, release approved payouts, recover unpaid funds after expiry | Act as the verifier |
| **Recipient** | Read own terms, submit evidence, follow own award | Approve or redirect payout |
| **Verifier** | Review evidence; approve, reject, or hold | Move funds |
| **Administrator** | Provision users and program membership | Sign chain actions or override payment |

On-chain sponsor, recipient, and verifier addresses must differ. Admin status alone confers no payment authority.

---

## How it works

1. An administrator provisions users and wallets.
2. A provisioned sponsor defines a community project with fixed completion requirements and deadlines and selects an independent verifier from a project they already sponsor.
3. Sponsor creates one 20 Testnet XLM award per recipient, up to ten per project, and signs its funding transaction.
4. Recipient uploads private evidence → **SUBMIT** (wallet sign).
5. The verifier reviews the evidence and records a decision. On-chain approval and rejection require a wallet signature.
6. Sponsor **PAY**s the fixed award once (wallet sign).
7. After payout cutoff, unpaid funds can be recovered per contract rules.

---

## Architecture

```text
┌─────────────┐     session / API           ┌──────────────────────────────┐
│  Browser UI │ ←─────────────────────────→ │  Next.js (web/)               │
│  Freighter  │     signed transactions     │  route handlers + SQL         │
└──────┬──────┘                             └──────────────┬───────────────┘
       │                                                   │
       ▼                                                   ▼
┌─────────────┐                             ┌──────────────────────────────┐
│ Stellar     │  reconcile / chain reads    │ Supabase                     │
│ Soroban RPC │ ←────────────────────────── │ Auth · Postgres · Storage     │
│ award WASM  │                             └──────────────────────────────┘
└─────────────┘
```

**Trust boundaries**

- **UI + Freighter** — users sign; no server-held wallet secrets.
- **Next.js server** — sessions, permissions, prepare/submit/reconcile, evidence finalize.
- **Supabase** — Auth, Postgres, private evidence storage.
- **Soroban award contract** — fund / submit / approve / pay / expiry rules; one contract instance per award.

---

## Tech stack & layout

| Piece | Choice |
|---|---|
| App | Next.js + React (`web/`) |
| Data / auth / files | Supabase |
| Contract | Rust / Soroban (`contracts/award/`) |
| Wallet | Freighter (browser) |
| Tests | Vitest, Playwright, cargo, pgTAP |

```text
web/          Next.js + Supabase application
contracts/    Soroban award contract
supabase/     Migrations, config, db tests
oracle/       Archived comparison fixtures
docs/         Engineering docs + brand kit
docs/brand/   Official Fundora logo
```

---

## Status

| Item | State |
|---|---|
| Product path | Next.js + Supabase (`web/`) |
| Production app | https://fundora-instaward.vercel.app |
| Preview alias | https://proofpay-preview.vercel.app |
| Vercel project | `fundora` |
| Network | Stellar Testnet |
| Wallet verification | See the [verification matrix](docs/VERIFICATION.md) and [wallet rehearsal notes](docs/implementation/FREIGHTER_SMOKE_RESUME.md) for tested paths and open checks |
| Product branding | Fundora |

---

## Quickstart

Install Git and Node.js 22 or newer with npm, then start Docker Desktop or a compatible Docker engine. Rust and Cargo are needed for contract tests. A compatible browser wallet is needed for the live Testnet walkthrough.

Clone the repository with an account that has access. From the repository root, install dependencies and start local Supabase. Startup applies the repository's migrations to the local stack.

```sh
git clone https://github.com/storms23/Fundora.git
cd Fundora
npm --prefix web ci
npx supabase start
npx supabase status
```

Copy [`web/.env.example`](web/.env.example) to `web/.env.local`. Use the values from **local** Supabase status for the first four entries.

| Variable | Local value or source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Local anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Local service role key, for server and seed use |
| `DATABASE_URL` | Local Postgres connection URL |
| `AUTH_THROTTLE_SECRET`, `CRON_SECRET` | Separate long random values |
| `STELLAR_USE_FAKE_RPC`, `STELLAR_ALLOW_SUBMISSION` | Keep the example defaults of `1` and `0` for local UI exploration |
| `SEED_PASSWORD` | Keep the example value to use the sample credentials below, or choose a local password before seeding |

From `web/`, seed synthetic data and start the app:

```sh
cd web
npm run seed
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). See the [operations guide](docs/OPERATIONS.md) for deployment and Testnet configuration.

## Local test credentials

These synthetic logins come from [the local seed script](web/scripts/seed.ts) with the default prefix and password. Enter the **username** shown below.

| Workspace | Username | Default local password |
|---|---|---|
| [Sponsor](http://127.0.0.1:3000/login/sponsor) | `demo-sponsor` | `ProofPay-Demo-Password-12` |
| [Recipient](http://127.0.0.1:3000/login/recipient) | `demo-recipient-01` | `ProofPay-Demo-Password-12` |
| [Verifier](http://127.0.0.1:3000/login/verifier) | `demo-verifier` | `ProofPay-Demo-Password-12` |
| [Administrator](http://127.0.0.1:3000/login/administrator) | `demo-admin` | `ProofPay-Demo-Password-12` |

The standard seed also creates `demo-recipient-02` through `demo-recipient-10`. Use your configured `SEED_PASSWORD` for newly created accounts if you changed the default. Rerunning the seed preserves existing accounts and their passwords.

## Local walkthrough

1. Sign in as **Sponsor** and open the seeded community repair project. Inspect an award's terms, deadline, and payment status.
2. Sign out and return as **Recipient** to view that account's award and evidence entry point. Use a synthetic file if you try an upload.
3. Sign in as **Verifier** to open the review workspace. Evidence becomes available for review when the award reaches the applicable submission state.
4. Sign in as **Administrator** to inspect the user provisioning and membership controls.

The default setup is for exploring the interfaces with fake RPC and submission disabled. For a signed walkthrough, configure the installed Testnet WASM hash and distinct Testnet wallets assigned to the relevant award roles. The seed's randomly generated public addresses have no retained signing keys. Follow the [Freighter rehearsal notes](docs/implementation/FREIGHTER_SMOKE_RESUME.md) for the wallet steps and current verification limits.

## Development checks

| Command from the repository root | Purpose |
|---|---|
| `npm --prefix web run lint` | ESLint |
| `npm --prefix web run typecheck` | TypeScript checking |
| `npm --prefix web test` | Vitest suite |
| `npm --prefix web run build` | Next.js production build |
| `npm --prefix web run test:isolated` | Isolated local Supabase, pgTAP, and Playwright checks with synthetic data |
| `cargo test --manifest-path contracts/award/Cargo.toml --locked` | Soroban contract tests |

## Troubleshooting

| Symptom | What to check |
|---|---|
| Supabase fails to start | Check that Docker is running and inspect `npx supabase status` from the repository root. Check the startup output for local port conflicts. |
| The app cannot reach Supabase | Compare `web/.env.local` with the current local stack settings. Restart the dev server after editing the file. |
| A seeded login fails | Confirm the seed completed against the same stack the app uses. Enter the username and use the password set when that account was created. |
| A wallet cannot sign | For the live flow, confirm the wallet is on Stellar Testnet and its public address matches the assigned role. The default local configuration disables submission. |
| PowerShell blocks `npm.ps1` or `npx.ps1` | Use `npm.cmd` or `npx.cmd` in the same command. |

---

## Security & privacy

- Evidence objects are private; access is authorized and time-bounded.
- No secret keys, recovery phrases, or personal evidence in Git or logs.
- Wallet material stays with the user (Freighter); the server never holds signing keys.

## Contributing

Read the [engineering standard](docs/ENGINEERING_STANDARD.md) before changing product behavior. Use the [OpenSpec workflow](docs/OPENSPEC.md) for scoped implementation changes. Describe the affected roles, include relevant verification results with your change, and use synthetic records in screenshots and bug reports. For contribution scope and implementation context, see [AGENTS.md](AGENTS.md).

---

## Contributors

- **Jefferson Cruz Tuparan**
- **Ramon Dulatre Bonina**
- **Kench Loyola**

---

## Docs for builders & agents

| Read | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Agent entry instructions |
| [Engineering standard](docs/ENGINEERING_STANDARD.md) | Shared rules & document authority |
| [Product and scope](ProofPay_Product_and_Scope.md) | Users, boundaries, acceptance criteria |
| [System and implementation plan](ProofPay_System_and_Implementation_Plan.md) | Architecture, ABI, implementation tasks |
| [Architecture guide](docs/ARCHITECTURE.md) | Trust boundaries |
| [HTTP interfaces](docs/HTTP_INTERFACES.md) | API shapes |
| [Verification matrix](docs/VERIFICATION.md) | Acceptance evidence |
| [Operations](docs/OPERATIONS.md) | Local / preview ops |
| [Brand kit](docs/brand/README.md) | Logo assets |

OpenSpec: [docs/OPENSPEC.md](docs/OPENSPEC.md).

---

## License

License for original Fundora work is TBD. Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
