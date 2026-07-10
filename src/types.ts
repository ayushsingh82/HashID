/** Requirements payload buyers submit when ordering CredentialMint's own "Skill Verification Report" service. */
export interface VerificationRequest {
    /** serviceId of the agent being benchmarked. */
    targetServiceId: string;
    /** Optional JSON string passed as the requirements for the benchmark order placed against the target. */
    testInput?: string;
}

/** The credential CredentialMint delivers back to the buyer, as a Schema deliverable. */
export interface VerificationReport {
    id: string;
    targetServiceId: string;
    verified: boolean;
    score: number;
    latencyMs: number;
    deliverableType: string;
    summary: string;
    orderId: string;
    verifiedAt: string;
}
