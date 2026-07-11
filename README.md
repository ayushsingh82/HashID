<img src="client/public/logo.png" alt="CredentialMint" width="96" />

# CredentialMint

Benchmark-verified skill credentials for AI agents, built on the [CROO Agent Protocol](https://docs.croo.network) (CAP).

**Tracks:** Data & Verification · Developer Tooling

**Live on the CROO Agent Store:** https://agent.croo.network/agents/df96b86f-82de-425d-9daa-b8d333b7153f

## The problem

Every agent registered on CROO gets a DID and a "verifiable service interface" — but nothing
verifies that what an agent *claims* to do is what it actually does. A Service listing is a
description its owner wrote; buyers have no independent signal that it holds up.

## What CredentialMint does

CredentialMint is a CAP agent that verifies other agents by actually using them. Point it at a
`serviceId` and it:

1. Places a real, paid CAP order against that service (negotiate → pay → wait for delivery),
   exactly as any other Requester would.
2. Scores what comes back — completeness, structure, delivery latency — against the service's
   own declared requirements.
3. Issues a signed, structured credential (`{ verified, score, summary, orderId, ... }`) as a
   Schema deliverable, bound to the target's on-chain order history.

It's not a self-report, a survey, or an LLM guessing from a description. It's a real, on-chain
settled order — the credential *is* the receipt.

## Why this fits Data & Verification + Developer Tooling

- **Data & Verification** — the entire product is "provenance, credentials, output checks":
  literally the track description.
- **Developer Tooling** — it's infrastructure other CAP builders plug into. Any agent (an
  onboarding flow, a marketplace, another verification agent) can hire CredentialMint as a
  sub-check before trusting a third service.

## Architecture

```
Browser (React client) ──► Express API bridge (src/server.ts) ──► benchmark.ts (Requester role)
                                                                          │
                                                                          ▼
                                                              Target agent's CAP Service
                                                          (real order, on-chain settled)

Another CAP agent ────────► provider.ts (Provider role, sells "Skill Verification Report")
                             on OrderPaid → runs benchmark.ts against requirements.targetServiceId
                             → delivers the credential
```

`benchmark.ts` + `scoring.ts` are the single source of truth for "verify a service" — both the
Store-facing provider listing and the local web demo call the same code path. Nothing is
duplicated, and nothing about the verification result is fabricated.

A browser can never safely hold `CROO_SDK_KEY` (it would be visible in devtools to anyone), so
the React client talks to a small Express bridge (`src/server.ts`) instead of the SDK directly.
That server makes real `@croo-network/sdk` calls; the client never sees the key.

## Project layout

```
src/
  config.ts       env/config loading (CROO_API_URL, CROO_SDK_KEY, ...)
  types.ts        VerificationRequest / VerificationReport
  scoring.ts       v1 heuristic scorer for a Delivery
  benchmark.ts     Requester-role flow: negotiate → pay → score
  provider.ts      Provider-role flow: sells the "Skill Verification Report" service
  reports.ts       in-memory report store used by the API bridge
  server.ts        Express API the React client talks to
  index.ts         entrypoint — starts the provider listener

client/
  src/pages/           Home, VerificationProcess ("Verify an Agent"), VerificationResult, Dashboard
  src/context/          CredentialMintContext — thin state wrapper around the service layer
  src/services/         CredentialMintService — fetch client for the Express API
  src/components/icons.jsx  custom SVG icon set + brand mark (no emoji)
```

## Setup

### Prerequisites

- Node.js 18+, pnpm
- A CROO account at [agent.croo.network](https://agent.croo.network)
- A registered Agent with a "Skill Verification Report" Service (Dashboard → Register Agent →
  Configure → Add Service — this step isn't scriptable, the SDK has no service-creation method)
- A small amount of USDC (Base) in the Agent's AA wallet for placing benchmark orders
- The Service ID of at least one target agent to verify against (any live Service in the CROO
  Agent Store)

### Clone

```bash
git clone <this-repo-url>
cd HashID
```

### Install

```bash
pnpm install
cp .env.example .env
# fill in CROO_API_URL, CROO_WS_URL, CROO_SDK_KEY (from the Dashboard)
```

### Run

Each of these runs in its own terminal (they're separate long-lived processes):

```bash
# Terminal 1 — Provider: lists CredentialMint on the Store, fulfils paid verification orders
pnpm run provider

# Terminal 2 — API bridge for the web client
pnpm run server

# Terminal 3 — React client
cd client && npm install && npm start
```

The client dev server proxies `/api/*` to `http://localhost:4000` (see `client/package.json`
`proxy` field), so `npm start` in `client/` talks to `pnpm run server` automatically. Once all
three are up: client on `http://localhost:3000`, API bridge on `http://localhost:4000`.

For a one-off CLI verification of a single agent, no server needed:

```bash
CROO_TARGET_SERVICE_ID=<serviceId> pnpm run benchmark
```

### Stop

`Ctrl+C` in each terminal running `pnpm run provider` / `pnpm run server` / `npm start` stops
that process. Stopping `pnpm run provider` takes CredentialMint's Store listing back offline
(`onlineStatus` is tied directly to that process's WebSocket connection staying open).

## API reference (`src/server.ts`)

The Express bridge the React client talks to — every route is a thin wrapper over a real
`@croo-network/sdk` call server-side (see [Architecture](#architecture)); nothing here is mocked.

| Method | Route | Cost | Description |
|---|---|---|---|
| `POST` | `/api/verify` | Real USDC (target service's price) | Body: `{ targetServiceId: string, testInput?: string }`. Runs a full `negotiateOrder → payOrder → getDelivery → score` cycle against the target service and stores the resulting report. Returns `{ success, report }` or `{ success: false, error }`. |
| `GET` | `/api/liveness/:serviceId` | Free | Confirms a service exists and returns its public track record via CROO's public Store API — no payment, no CAP order, no `CROO_SDK_KEY`. Useful to sanity-check a `serviceId` before spending USDC via `/api/verify`. Returns `{ success, liveness }`. |
| `GET` | `/api/reports` | Free (reads local store) | Lists every verification report generated this session. Returns `{ success, reports: VerificationReport[] }`. |
| `GET` | `/api/reports/:id` | Free (reads local store) | Fetches a single report by ID. Returns `{ success, report }` or 404 `{ success: false, error }`. |

All responses are JSON; failures return HTTP 4xx/5xx with `{ success: false, error }` rather than
throwing — the client (`client/src/services/CredentialMintService.js`) checks `success` on every
call rather than relying on status codes alone.

## SDK methods used (`@croo-network/sdk` v0.2.1)

| Method | Role | Where |
|---|---|---|
| `negotiateOrder` | Requester | `benchmark.ts` — starts a benchmark order against the target service |
| `payOrder` | Requester | `benchmark.ts` — pays once the target's `OrderCreated` fires |
| `getDelivery` | Requester | `benchmark.ts` — pulls the target's actual output for scoring |
| `acceptNegotiation` | Provider | `provider.ts` — accepts a buyer's verification request |
| `getOrder` / `getNegotiation` | Provider | `provider.ts` — reads the buyer's `targetServiceId` off the negotiation's requirements |
| `deliverOrder` | Provider | `provider.ts` — delivers the signed credential as a Schema deliverable |
| `connectWebSocket` / `EventType.*` | Both | all of `NegotiationCreated`, `OrderCreated`, `OrderPaid`, `OrderCompleted`, `NegotiationRejected`, `NegotiationExpired`, `OrderRejected`, `OrderExpired` are handled |

## "Skill Verification Report" Service schema

Configured on the Dashboard's Configure page (Add Service → Details) as Schema type on both sides,
matching `VerificationRequest`/`VerificationReport` in `src/types.ts` exactly — this is what
`provider.ts` actually parses out of the negotiation and actually sends back.

**Requirements** (what a buyer submits):

| Field | Type | Required | Description |
|---|---|---|---|
| `targetServiceId` | string | ✅ | serviceId of the agent to benchmark and verify |
| `testInput` | string | optional | Optional JSON requirements to send the target service |

**Deliverable** (the signed credential CredentialMint returns):

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Unique ID for this verification report |
| `targetServiceId` | string | ✅ | The serviceId that was benchmarked |
| `verified` | boolean | ✅ | Whether the score met the verification threshold |
| `score` | number | ✅ | Benchmark score out of 100 |
| `latencyMs` | number | ✅ | Delivery latency of the target service, in ms |
| `deliverableType` | string | ✅ | What the target returned — "text" or "schema" |
| `summary` | string | ✅ | Human-readable scoring notes |
| `orderId` | string | ✅ | CAP order ID of the internal benchmark order |
| `verifiedAt` | string | ✅ | ISO timestamp when verification completed |

All `string` fields use `stringSubtype: plain` — none of them are URLs or on-chain addresses, just
identifiers and descriptive text. (Contrast with a service like SwapGod's, which uses
`stringSubtype: address` for its `token_out`/`recipient` fields, since those really are Base
wallet addresses.)

## Integration notes

- Verified against the real installed package types (`node_modules/@croo-network/sdk/dist/*.d.ts`),
  not just doc prose — e.g. `Order` has no `requirements` field, only `Negotiation` does, which is
  why `provider.ts` does `getOrder` → `getNegotiation` → parse `requirements` rather than reading
  requirements off the order directly.
- `runBenchmark` opens its own `AgentClient`/WebSocket per call so it can run concurrently with,
  and independently of, the provider's own listener loop.
- Scoring (`scoring.ts`) is a v1 heuristic (non-empty deliverable, well-formed schema/text,
  delivery latency) — a real signal, not a placeholder, but intentionally simple for a first
  version. Swapping in task-specific known-answer grading per skill category is the natural next
  iteration.
- See `plan.md` for the current build status and what's left before this is live on the Store.

## License

MIT
