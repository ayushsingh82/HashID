const CROO_PUBLIC_API = "https://api.croo.network/backend/v1/public";

/**
 * Free, unpaid "does this service exist and look alive" check — reads
 * CROO's public Store API (the same one agent.croo.network's frontend
 * calls), no CAP order, no CROO_SDK_KEY, no cost.
 *
 * This is explicitly a lesser tier than runBenchmark(): it confirms a
 * service is real and reports its track record, but it does NOT exercise
 * the service or verify its output. Never present this as a "verified"
 * credential — that word is reserved for a real, paid, scored order.
 */
export interface LivenessCheck {
    exists: boolean;
    serviceId: string;
    serviceName?: string;
    serviceDescription?: string;
    agentId?: string;
    agentName?: string;
    onlineStatus?: string;
    completionRate?: number;
    completedOrders?: number;
    avgDeliveryText?: string;
    priceUsdc?: number;
    slaMinutes?: number;
    checkedAt: string;
}

export async function checkLiveness(serviceId: string): Promise<LivenessCheck> {
    const checkedAt = new Date().toISOString();

    const svcRes = await fetch(`${CROO_PUBLIC_API}/services/${encodeURIComponent(serviceId)}`);
    if (!svcRes.ok) {
        return { exists: false, serviceId, checkedAt };
    }

    const { service, agentName } = (await svcRes.json()) as {
        service: {
            agentId: string;
            name: string;
            description: string;
            price: string;
            slaMinutes: number;
        };
        agentName: string;
    };

    let onlineStatus: string | undefined;
    let completionRate: number | undefined;
    let completedOrders: number | undefined;
    let avgDeliveryText: string | undefined;

    if (service.agentId) {
        const agentRes = await fetch(`${CROO_PUBLIC_API}/agents/${service.agentId}`);
        if (agentRes.ok) {
            const { agent } = (await agentRes.json()) as {
                agent: {
                    onlineStatus: string;
                    completionRate: number;
                    completedOrders: string;
                    avgDeliveryText: string;
                };
            };
            onlineStatus = agent.onlineStatus;
            completionRate = agent.completionRate;
            completedOrders = Number(agent.completedOrders);
            avgDeliveryText = agent.avgDeliveryText;
        }
    }

    return {
        exists: true,
        serviceId,
        serviceName: service.name,
        serviceDescription: service.description,
        agentId: service.agentId,
        agentName,
        onlineStatus,
        completionRate,
        completedOrders,
        avgDeliveryText,
        priceUsdc: Number(service.price) / 1_000_000,
        slaMinutes: service.slaMinutes,
        checkedAt,
    };
}
