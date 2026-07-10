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
- [x] Found and fixed: `benchmark.ts` sent raw plain text as `requirements`, but CAP requires
      `requirements` to be syntactically valid JSON regardless of the target's requirementType.
      Fixed via `toRequirementsJson()` — passes JSON through, wraps plain text as a JSON string.
- [x] Found and fixed: `benchmark.ts`'s internal timeout was 5 minutes, shorter than some target
      services' declared SLA (VERIS goes up to 60 min). Raised to 75 minutes.
- [x] Found and fixed a real Dashboard misconfiguration: CredentialMint's own Service had
      Requirements/Deliverable saved as free `text` (with my explanation text pasted in as
      content) instead of `schema` with real fields. Now both are Schema-typed and match
      `VerificationRequest`/`VerificationReport` in `src/types.ts` exactly — documented in the
      README's new "Skill Verification Report Service schema" section.
- [x] Discovered CROO's public (undocumented) Store API: `GET .../public/services/{serviceId}` and
      `GET .../public/agents/{agentId}` return real service/agent data with no auth needed — used
      to resolve 7 real agents' serviceIds into `data/test-agents.json` (SwapGod, remifi, VERIS,
      AdPilot, OpsPilot, SwapCat, Polymind) for testing against.
- [x] Added a free "liveness check" tier (`src/liveness.ts`, `GET /api/liveness/:serviceId`) —
      confirms a service exists and shows its public track record via the same public API, no
      payment, no CAP order. Explicitly kept separate from real paid verification reports so the
      two are never confused in the UI or the data model.
- [x] `pnpm run provider` is running; confirmed via the public API that CredentialMint shows
      `onlineStatus: "online"` on the Store.

**Not done / explicitly out of scope for now**
- [ ] **Blocked on funding**: CredentialMint's AA wallet (`0xd5fBf47c380BAa1c3277876DE9957860F0f7366F`)
      has $0 USDC, so `negotiateOrder` fails at the payment step — Base's paymaster needs *some*
      USDC balance to sponsor gas (`PIMLICO_ERROR: sender has no balance of the token for ERC20
      sponsorship`). Waiting on a small USDC (Base) deposit to that address before a real
      negotiate → pay → deliver → score cycle can complete.
- [ ] Once funded: re-run the live test against remifi's "USDC Split Policy"
      (`d9295193-b39c-4d52-adf1-264216ddd82a`, avg delivery < 1min — best first candidate), then
      try a few more of the 7 saved agents in `data/test-agents.json` to prove it works across
      different requirement types (text vs. schema) and agents, not just one.
- [ ] `testInput` on the live Service's Requirements schema is saved as `required: true`; should be
      optional. Not blocking, just doesn't match the intended design.
- [ ] Bulk service *discovery* (list all live services to auto-pick benchmark targets) — the
      documented SDK has no `listServices`/search method; the public API above covers this in
      practice but isn't part of the official SDK surface — worth confirming with CROO before
      depending on it long-term.
- [ ] In-memory report store (`src/reports.ts`) resets on server restart — fine for a hackathon
      demo, would need a real DB for production.
- [ ] **Deploy the provider + API bridge to a persistent host** (Railway, Render, Fly.io, a cheap
      VPS, etc.) instead of running locally. `onlineStatus` is tied directly to the WebSocket
      connection staying open — the moment this laptop's dev session stops, CredentialMint flips
      back to `offline` on the Store. Needed if the listing has to stay live/discoverable outside
      active work sessions (e.g. for judges checking independently).
- [ ] Demo video (max 5 min) and DoraHacks BUIDL filing.

## Next steps, in order

1. Fund `0xd5fBf47c380BAa1c3277876DE9957860F0f7366F` with a small amount of USDC on Base.
2. Retry the real end-to-end test against remifi, then a few more of the 7 saved agents.
3. Deploy the provider + API bridge to a persistent host (Railway/Render/Fly.io/VPS) so
   CredentialMint stays online without a laptop dev session running.
4. Record the demo video and file the DoraHacks BUIDL.
