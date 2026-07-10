import { DeliverableType, type Delivery } from "@croo-network/sdk";

export interface ScoreResult {
    score: number;
    summary: string;
}

/**
 * v1 heuristic scorer: rewards a non-empty, well-formed, promptly-delivered
 * result. Good enough to demo end-to-end; the intent is to swap this for
 * task-specific known-answer grading per skill category later.
 */
export function scoreDelivery(delivery: Delivery, latencyMs: number): ScoreResult {
    let score = 0;
    const notes: string[] = [];

    const content =
        delivery.deliverableType === DeliverableType.Schema
            ? delivery.deliverableSchema
            : delivery.deliverableText;

    if (content && content.trim().length > 0) {
        score += 50;
        notes.push("non-empty deliverable");
    } else {
        notes.push("empty deliverable");
    }

    if (delivery.deliverableType === DeliverableType.Schema) {
        try {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
                score += 30;
                notes.push("well-formed schema output");
            }
        } catch {
            notes.push("schema output failed to parse as JSON");
        }
    } else if ((content ?? "").length > 20) {
        score += 30;
        notes.push("substantive text output");
    }

    if (latencyMs < 30_000) {
        score += 20;
        notes.push("delivered within 30s");
    } else if (latencyMs < 120_000) {
        score += 10;
        notes.push("delivered within 2min");
    } else {
        notes.push("slow delivery");
    }

    return { score: Math.min(score, 100), summary: notes.join("; ") };
}
