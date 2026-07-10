import "dotenv/config";
import type { Config } from "@croo-network/sdk";

function required(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const cap: Config = {
    baseURL: required("CROO_API_URL"),
    wsURL: process.env.CROO_WS_URL,
    rpcURL: process.env.BASE_RPC_URL || undefined,
};

export const sdkKey = required("CROO_SDK_KEY");
