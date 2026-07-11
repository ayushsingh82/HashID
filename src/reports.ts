import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { VerificationReport } from "./types";

/**
 * File-backed store of verification reports produced by real CAP benchmark
 * runs (via runBenchmark). Persisted to data/reports.json so a server
 * restart doesn't lose history — a hackathon-scoped demo store, not a real
 * database. Every entry here came from an actual on-chain settled CAP
 * order; nothing is fabricated.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "reports.json");

function load(): VerificationReport[] {
    if (!existsSync(STORE_PATH)) {
        return [];
    }
    try {
        return JSON.parse(readFileSync(STORE_PATH, "utf-8"));
    } catch {
        return [];
    }
}

function save(reports: VerificationReport[]): void {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }
    writeFileSync(STORE_PATH, JSON.stringify(reports, null, 2));
}

const reports: VerificationReport[] = load();

export function addReport(report: VerificationReport): void {
    reports.unshift(report);
    save(reports);
}

export function listReports(): VerificationReport[] {
    return reports;
}

export function getReport(id: string): VerificationReport | undefined {
    return reports.find((r) => r.id === id);
}
