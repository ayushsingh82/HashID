import "dotenv/config";
import { randomUUID } from "node:crypto";
import { AgentClient, EventType } from "@croo-network/sdk";
import { cap, sdkKey } from "./config";
import { scoreDelivery } from "./scoring";
import type { VerificationRequest, VerificationReport } from "./types";

const BENCHMARK_TIMEOUT_MS = 5 * 60 * 1000;
/** Minimum score (out of 100) a deliverable must reach to count as "verified". */
const VERIFICATION_THRESHOLD = 60;

/**
 * Runs a single benchmark order against a target agent's service and scores
 * the result. Opens its own AgentClient/WebSocket so it can run concurrently
 * with, and independently of, CredentialMint's own provider-side listener.
 */
export async function runBenchmark(request: VerificationRequest): Promise<VerificationReport> {
    const client = new AgentClient(cap, sdkKey);
    const stream = await client.connectWebSocket();
    const startedAt = Date.now();

    try {
        return await new Promise<VerificationReport>((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Benchmark timed out after ${BENCHMARK_TIMEOUT_MS}ms`));
            }, BENCHMARK_TIMEOUT_MS);

            const settle = (fn: () => void) => {
                clearTimeout(timer);
                fn();
            };

            stream.on(EventType.OrderCreated, async (e) => {
                console.log(`[benchmark] order ${e.order_id} created, paying...`);
                try {
                    await client.payOrder(e.order_id!);
                } catch (err) {
                    settle(() => reject(err instanceof Error ? err : new Error(String(err))));
                }
            });

            stream.on(EventType.OrderCompleted, async (e) => {
                try {
                    const delivery = await client.getDelivery(e.order_id!);
                    const latencyMs = Date.now() - startedAt;
                    const result = scoreDelivery(delivery, latencyMs);
                    settle(() =>
                        resolve({
                            id: randomUUID(),
                            targetServiceId: request.targetServiceId,
                            verified: result.score >= VERIFICATION_THRESHOLD,
                            score: result.score,
                            latencyMs,
                            deliverableType: delivery.deliverableType,
                            summary: result.summary,
                            orderId: e.order_id!,
                            verifiedAt: new Date().toISOString(),
                        })
                    );
                } catch (err) {
                    settle(() => reject(err instanceof Error ? err : new Error(String(err))));
                }
            });

            stream.on(EventType.NegotiationRejected, (e) => {
                settle(() => reject(new Error(`Target agent rejected negotiation: ${e.reason ?? "no reason given"}`)));
            });

            stream.on(EventType.NegotiationExpired, () => {
                settle(() => reject(new Error("Negotiation with target agent expired")));
            });

            stream.on(EventType.OrderRejected, (e) => {
                settle(() => reject(new Error(`Target agent rejected the order: ${e.reason ?? "no reason given"}`)));
            });

            stream.on(EventType.OrderExpired, () => {
                settle(() => reject(new Error("Benchmark order expired before delivery")));
            });

            client
                .negotiateOrder({
                    serviceId: request.targetServiceId,
                    requirements: request.testInput ?? "{}",
                })
                .then((neg) => console.log(`[benchmark] negotiation started: ${neg.negotiationId}`))
                .catch((err) => settle(() => reject(err instanceof Error ? err : new Error(String(err)))));
        });
    } finally {
        stream.close();
    }
}

// Standalone runner, mirrors the SDK's requester.ts example — useful for
// manually verifying a single agent from the CLI:
//   CROO_TARGET_SERVICE_ID=<serviceId> pnpm run benchmark
if (import.meta.url === `file://${process.argv[1]}`) {
    const targetServiceId = process.env.CROO_TARGET_SERVICE_ID;
    if (!targetServiceId) {
        console.error("Set CROO_TARGET_SERVICE_ID to the serviceId you want to benchmark.");
        process.exit(1);
    }
    runBenchmark({ targetServiceId })
        .then((report) => {
            console.log(JSON.stringify(report, null, 2));
            process.exit(0);
        })
        .catch((err) => {
            console.error("Benchmark failed:", err);
            process.exit(1);
        });
}
