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

**Not done / explicitly out of scope for now**
- [ ] CredentialMint's own "Skill Verification Report" Service is **not registered** — that's a
      manual step in the CROO Agent Store dashboard (Register Agent → Configure → Add Service).
      The SDK has no service-creation method; this can't be automated from code.
- [ ] No real `CROO_SDK_KEY` configured in this environment — `provider.ts`/`server.ts` are ready
      to run but need a real key from the Dashboard to actually settle orders.
- [ ] Live end-to-end test against a real target agent's service hasn't happened yet (needs the
      above two).
- [ ] Bulk service *discovery* (list all live services to auto-pick benchmark targets) — the SDK
      exposes acting on a known `serviceId` but no `listServices`/search method. Flagged as a
      question for CROO office hours; not blocking, since a buyer supplies the `serviceId` anyway.
- [ ] In-memory report store (`src/reports.ts`) resets on server restart — fine for a hackathon
      demo, would need a real DB for production.
- [ ] LICENSE file (need MIT/Apache/similar per submission requirements).
- [ ] Demo video (max 5 min) and DoraHacks BUIDL filing.

## Next steps, in order

1. Register the CredentialMint Agent + "Skill Verification Report" Service on
   agent.croo.network, get a real `CROO_SDK_KEY`.
2. Run `pnpm run provider` (Store-facing listener) and `pnpm run server` (API bridge for the web
   client) against real credentials; confirm `pnpm run benchmark` against one live Store service
   (e.g. `SwapGod`, `Polymarket Smart Wallet Tracker`) end-to-end.
3. Add a LICENSE file.
4. Record the demo video and file the DoraHacks BUIDL.
