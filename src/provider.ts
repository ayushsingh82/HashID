import "dotenv/config";
import { AgentClient, DeliverableType, EventType } from "@croo-network/sdk";
import { cap, sdkKey } from "./config";
import { runBenchmark } from "./benchmark";
import type { VerificationRequest } from "./types";

function parseVerificationRequest(requirementsJson: string): VerificationRequest {
    const parsed = JSON.parse(requirementsJson || "{}");
    if (!parsed.targetServiceId) {
        throw new Error('requirements must include "targetServiceId"');
    }
    return {
        targetServiceId: parsed.targetServiceId,
        testInput: parsed.testInput,
    };
}

/**
 * CredentialMint's provider loop. Sells a "Skill Verification Report"
 * service: on payment, it turns around and runs its own benchmark order
 * against the buyer's targetServiceId (see benchmark.ts), then delivers the
 * resulting credential back to the buyer as a Schema deliverable.
 */
export async function startProvider(): Promise<void> {
    const client = new AgentClient(cap, sdkKey);
    const stream = await client.connectWebSocket();

    stream.on(EventType.NegotiationCreated, async (e) => {
        console.log(`[provider] negotiation received: ${e.negotiation_id}`);
        try {
            const result = await client.acceptNegotiation(e.negotiation_id!);
            console.log(`[provider] order created: ${result.order.orderId}`);
        } catch (err) {
            console.error("[provider] accept error:", err);
        }
    });

    stream.on(EventType.OrderPaid, async (e) => {
        const orderId = e.order_id!;
        console.log(`[provider] order ${orderId} paid, verifying target agent...`);

        try {
            const order = await client.getOrder(orderId);
            const negotiation = await client.getNegotiation(order.negotiationId);
            const request = parseVerificationRequest(negotiation.requirements);

            const report = await runBenchmark(request);

            await client.deliverOrder(orderId, {
                deliverableType: DeliverableType.Schema,
                deliverableSchema: JSON.stringify(report),
            });
            console.log(`[provider] order ${orderId} delivered — score ${report.score}, verified=${report.verified}`);
        } catch (err) {
            console.error(`[provider] failed to fulfil order ${orderId}:`, err);
            await client
                .rejectOrder(orderId, err instanceof Error ? err.message : "Verification failed")
                .catch((rejectErr) => console.error("[provider] reject error:", rejectErr));
        }
    });

    stream.on(EventType.OrderCompleted, (e) => {
        console.log(`[provider] order ${e.order_id} completed and settled`);
    });

    process.on("SIGINT", () => {
        stream.close();
        process.exit(0);
    });

    console.log("[provider] CredentialMint is online, listening for verification requests");
}
