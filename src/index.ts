import { startProvider } from "./provider";

startProvider().catch((err) => {
    console.error("Failed to start CredentialMint provider:", err);
    process.exit(1);
});
