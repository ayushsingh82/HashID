/**
 * Thin HTTP client for CredentialMint's API bridge (see /src/server.ts).
 *
 * Every response here is backed by a real @croo-network/sdk call on the
 * server: negotiate -> pay -> benchmark the target agent's service -> score
 * the actual delivery. The browser never touches CROO_SDK_KEY directly —
 * that credential only ever lives server-side.
 */
/**
 * Parses a fetch Response as JSON, translating a non-JSON body (e.g. the dev
 * proxy's plain-text "Proxy error: ..." when the API server is momentarily
 * down/restarting) into a readable error instead of a raw SyntaxError.
 */
async function parseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('CredentialMint API is unreachable (server may be restarting) — try again in a few seconds.');
  }
}

class CredentialMintService {
  async requestVerification({ targetServiceId, testInput }) {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetServiceId, testInput }),
      });
      const data = await parseJson(res);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verification request failed' };
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message || 'Failed to reach the CredentialMint API' };
    }
  }

  async getVerificationReport(reportId) {
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(reportId)}`);
      const data = await parseJson(res);
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to retrieve verification report' };
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message || 'Failed to reach the CredentialMint API' };
    }
  }

  async listReports() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      return data.success ? data.reports : [];
    } catch {
      return [];
    }
  }
}

const credentialMintService = new CredentialMintService();
export default credentialMintService;
