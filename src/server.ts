import "dotenv/config";
import express from "express";
import cors from "cors";
import { runBenchmark } from "./benchmark";
import { addReport, listReports, getReport } from "./reports";

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
        res.json({ success: true, report });
    } catch (err) {
        res.status(502).json({
            success: false,
            error: err instanceof Error ? err.message : "Benchmark failed",
        });
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
