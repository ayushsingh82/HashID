# CredentialMint — Web Client

React frontend for CredentialMint. See the [root README](../README.md) for the full project
description, architecture, and CAP integration details.

## Getting Started

```bash
npm install
npm start
```

Requires the API bridge running on `:4000` (`pnpm run server` from the repo root) — requests to
`/api/*` are proxied there in development (see the `proxy` field in `package.json`).

## Structure

- `src/pages/` — Home, VerificationProcess ("Verify an Agent"), VerificationResult, Dashboard
- `src/context/CredentialMintContext.jsx` — thin state wrapper around the service layer
- `src/services/CredentialMintService.js` — fetch client for the Express API bridge
- `src/components/icons.jsx` — custom SVG icon set and brand mark

## License

MIT — see the [root LICENSE](../LICENSE).
