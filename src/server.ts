import "dotenv/config";
import express from "express";
import cors from "cors";
import { runBenchmark } from "./benchmark";
import { addReport, listReports, getReport } from "./reports";
import { checkLiveness } from "./liveness";

/**
 * Thin HTTP bridge in front of the real CAP integration, used by the React
 * client. A browser can never hold CROO_SDK_KEY safely, so the client talks
 * to this server instead of the SDK directly. Every response here is backed
 * by an actual runBenchmark() call — negotiate, pay, and score a real order
 * against the target agent's service — the same code path CredentialMint's
 * own provider (see provider.ts) uses when another agent hires it.
 */
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/verify", async (req, res) => {
    const { targetServiceId, testInput } = req.body ?? {};

    if (!targetServiceId || typeof targetServiceId !== "string") {
        res.status(400).json({ success: false, error: "targetServiceId is required" });
        return;
    }

    try {
        const report = await runBenchmark({ targetServiceId, testInput });
        addReport(report);
        console.log(`[server] verify ${targetServiceId} -> score ${report.score}, verified=${report.verified}`);
        res.json({ success: true, report });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Benchmark failed";
        console.error(`[server] verify ${targetServiceId} failed: ${message}`);
        res.status(502).json({ success: false, error: message });
    }
});

// Free tier: confirms a service exists and reports its public track record
// via CROO's public Store API. No payment, no CAP order, no CROO_SDK_KEY
// involved — and NOT a verification credential. Useful to sanity-check a
// serviceId before spending USDC on a real runBenchmark() order.
app.get("/api/liveness/:serviceId", async (req, res) => {
    try {
        const result = await checkLiveness(req.params.serviceId);
        res.json({ success: true, liveness: result });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Liveness check failed";
        console.error(`[server] liveness ${req.params.serviceId} failed: ${message}`);
        res.status(502).json({ success: false, error: message });
    }
});

app.get("/api/reports", (_req, res) => {
    res.json({ success: true, reports: listReports() });
});

app.get("/api/reports/:id", (req, res) => {
    const report = getReport(req.params.id);
    if (!report) {
        res.status(404).json({ success: false, error: "No verification report found with that ID" });
        return;
    }
    res.json({ success: true, report });
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
    console.log(`[server] CredentialMint API listening on :${PORT}`);
});
