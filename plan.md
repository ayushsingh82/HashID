# CredentialMint — Build Plan

Working plan for the CROO Agent Hackathon submission. Tracks: **Data & Verification** + **Developer Tooling**.

## The idea

CredentialMint is a CAP agent that benchmark-verifies other agents' declared services. A buyer
(human or agent) points it at a `serviceId`; CredentialMint places a real, paid CAP order against
that service, scores what actually comes back (completeness, structure, delivery latency), and
returns a signed, structured "skill credential" — a report other agents/marketplaces can trust
instead of taking a self-reported claim at face value.

It fills a gap the CAP docs imply but don't provide: every agent gets a DID and a "verifiable
service interface" at registration, but nothing verifies that the *claimed* skill tags are true.

## Architecture

```
                         ┌─────────────────────────────┐
   Browser (React)  ───► │  src/server.ts (Express)     │
   client/               │  POST /api/verify            │
                         │  GET  /api/reports[/:id]     │
                         └──────────────┬────────────────┘
                                        │ calls
                                        ▼
                         ┌─────────────────────────────┐
                         │  src/benchmark.ts             │
                         │  Requester role via           │
                         │  @croo-network/sdk:           │
                         │  negotiateOrder → payOrder →  │
                         │  getDelivery → scoreDelivery  │
                         └──────────────┬────────────────┘
                                        │ real CAP order, on-chain settled
                                        ▼
                              Target agent's Service

   Separately, CredentialMint's own listing:
                         ┌─────────────────────────────┐
   Another CAP agent ───►│  src/provider.ts               │
   hires CredentialMint  │  Provider role: accepts        │
   as a paid service     │  negotiation → on OrderPaid,   │
                         │  runs benchmark.ts against the │
                         │  requirements.targetServiceId, │
                         │  delivers the credential       │
                         └─────────────────────────────┘
```

Both paths share the same `benchmark.ts` + `scoring.ts` — one real implementation of "verify a
service," consumed by (a) CredentialMint's own paid Store listing, and (b) the local API the web
UI talks to. No duplicated or fabricated logic in either path.

**Why the client doesn't call the SDK directly:** `CROO_SDK_KEY` is a secret. A browser bundle
can't hold it without exposing it to anyone who opens devtools. `src/server.ts` is the thin bridge
that keeps the key server-side while still running 100% real `@croo-network/sdk` calls underneath.

## Live deployment

- **Agent:** CredentialMint — `df96b86f-82de-425d-9daa-b8d333b7153f`
  Configure page: https://agent.croo.network/account/agents/df96b86f-82de-425d-9daa-b8d333b7153f/configure
- **Service:** "Skill Verification Report" — `svc-new-1783696685075`
- **`CROO_SDK_KEY`**: issued, stored in `.env` only (gitignored — never committed, never put in this file)

## Status

**Done**
- [x] Backend agent scaffolded against the real `@croo-network/sdk` v0.2.1 types (verified by
      unpacking the actual npm package, not guessed from docs) — `negotiateOrder`, `payOrder`,
      `getOrder`, `getNegotiation`, `deliverOrder`, `getDelivery`, full WebSocket event handling.
  - `src/config.ts`, `src/types.ts`, `src/scoring.ts`, `src/benchmark.ts`, `src/provider.ts`,
    `src/index.ts`
- [x] Express API bridge (`src/server.ts`, `src/reports.ts`) — smoke-tested against the live
      `api.croo.network` WebSocket endpoint (got a real 401 with a placeholder key, proving the
      integration is genuine, not mocked).
- [x] Legacy Hedera/ElizaOS plugin backend removed (~90 files: actions, providers, tests).
- [x] Client rebranded end-to-end: Hedera wallet-connect UI, HashID naming, and all Hedera
      references removed. `HederaContext`/`HederaService` replaced with `CredentialMintContext`/
      `CredentialMintService`, which now calls the real API (no client-side simulation, no seed
      data — an empty reports list means no orders have settled yet, honestly).
- [x] Verification flow repurposed: selfie/ID upload → target `serviceId` + optional test input.
- [x] Dashboard repurposed: KYC history → CAP order/report history, pulling from the live API.
- [x] Custom SVG icon set + brand mark (`components/icons.jsx`) — no emoji anywhere in the UI.
- [x] Visual pass: green/white theme, rounded-square icon tiles, Fraunces italic accent type,
      scroll-triggered vertical "How It Works" timeline, sticky footer, mobile-responsive header
      and layout (verified via Playwright screenshots at 1280px and 375px).
- [x] `.jsx` extensions for all component/page/context files.
- [x] CredentialMint Agent registered on the CROO Dashboard, real `CROO_SDK_KEY` issued and
      stored in `.env` (gitignored).
- [x] "Skill Verification Report" Service created (`svc-new-1783696685075`).
- [x] LICENSE file added (MIT).
- [x] Confirmed real key authenticates: `server.ts`'s WebSocket connects to `wss://api.croo.network/ws`
      successfully (previously got a 401 with a placeholder key; now connects clean).
- [x] Placed a real negotiation against a live third-party Service (DepegGuard's "Stablecoin Depeg
      Signal", `serviceId 54931089-096a-43b1-812a-ebdc412c58d1`) via `POST /api/verify` — confirms
      `negotiateOrder` works end-to-end against the live network, not just against ourselves.

**Not done / explicitly out of scope for now**
- [ ] Live end-to-end test **not yet confirmed complete** — the DepegGuard negotiation was placed
      but hadn't reached `OrderCreated`/`payOrder`/`OrderCompleted` as of the last check. Need to
      confirm a full negotiate → pay → deliver → score cycle finishes.
- [ ] `benchmark.ts`'s internal timeout (`BENCHMARK_TIMEOUT_MS`) is hardcoded to 5 minutes, shorter
      than some target services' declared SLA (up to 30 min). Needs raising before relying on this
      against arbitrary Store agents.
- [ ] Bulk service *discovery* (list all live services to auto-pick benchmark targets) — the
      documented SDK has no `listServices`/search method, **but** the Store frontend itself calls
      an undocumented public REST endpoint, `GET https://api.croo.network/backend/v1/public/agents/{agentId}`,
      which returns an agent's full service list with real `serviceId`s. Not part of the official
      SDK surface — worth confirming with CROO before depending on it, but useful for a future
      "paste an agent link" UX on `/verify` instead of requiring a raw `serviceId`.
- [ ] In-memory report store (`src/reports.ts`) resets on server restart — fine for a hackathon
      demo, would need a real DB for production.
- [ ] Demo video (max 5 min) and DoraHacks BUIDL filing.

## Next steps, in order

1. Confirm the live DepegGuard test order settles end-to-end (negotiate → pay → deliver → score).
2. Raise `BENCHMARK_TIMEOUT_MS` to comfortably exceed a 30-min target SLA.
3. Run `pnpm run provider` so CredentialMint is online and can accept real buyer orders on the Store.
4. Record the demo video and file the DoraHacks BUIDL.
