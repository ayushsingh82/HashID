import type { VerificationReport } from "./types";

/**
 * In-memory store of verification reports produced by real CAP benchmark
 * runs (via runBenchmark). Resets on server restart — a hackathon-scoped
 * demo store, not a database. Every entry here came from an actual on-chain
 * settled CAP order; nothing is fabricated.
 */
const reports: VerificationReport[] = [];

export function addReport(report: VerificationReport): void {
    reports.unshift(report);
}

export function listReports(): VerificationReport[] {
    return reports;
}

export function getReport(id: string): VerificationReport | undefined {
    return reports.find((r) => r.id === id);
}
