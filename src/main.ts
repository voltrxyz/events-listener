import { program } from "./config/anchor";
import * as vaultListeners from "./listeners/vaultListeners";

async function main() {
  console.log("Starting Voltr Vault event listener...");

  const listenerIds: number[] = [];

  try {
    // Attach all listeners defined in vaultListeners.ts
    listenerIds.push(vaultListeners.listenToAddAdaptorEvent(program));
    listenerIds.push(
      vaultListeners.listenToCancelRequestWithdrawVaultEvent(program)
    );
    listenerIds.push(vaultListeners.listenToCloseStrategyEvent(program));
    listenerIds.push(vaultListeners.listenToDepositStrategyEvent(program));
    listenerIds.push(vaultListeners.listenToDepositVaultEvent(program));
    listenerIds.push(
      vaultListeners.listenToDirectWithdrawStrategyEvent(program)
    );
    listenerIds.push(vaultListeners.listenToHarvestFeeEvent(program));
    listenerIds.push(vaultListeners.listenToInitProtocolEvent(program));
    listenerIds.push(
      vaultListeners.listenToInitializeDirectWithdrawStrategyEvent(program)
    );
    listenerIds.push(vaultListeners.listenToInitializeStrategyEvent(program));
    listenerIds.push(vaultListeners.listenToInitializeVaultEvent(program));
    listenerIds.push(vaultListeners.listenToRemoveAdaptorEvent(program));
    listenerIds.push(vaultListeners.listenToRequestWithdrawVaultEvent(program));
    listenerIds.push(vaultListeners.listenToUpdateProtocolEvent(program));
    listenerIds.push(vaultListeners.listenToUpdateVaultEvent(program));
    listenerIds.push(vaultListeners.listenToWithdrawStrategyEvent(program));
    listenerIds.push(vaultListeners.listenToWithdrawVaultEvent(program));

    console.log("\nAll listeners attached. Waiting for events...");
    console.log("Press Ctrl+C to stop the listener.");

    // Keep the process running
    await new Promise(() => {});
  } catch (error) {
    console.error("Error starting listeners:", error);
  } finally {
    // Basic cleanup
    console.log("Removing listeners...");
    for (const id of listenerIds) {
      try {
        await program.removeEventListener(id);
      } catch (removeError) {
        console.error(`Failed to remove listener ${id}:`, removeError);
      }
    }
    console.log("Listeners removed.");
  }
}

main().catch((err) => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("\nCaught interrupt signal (Ctrl+C). Shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nCaught termination signal. Shutting down...");
  process.exit(0);
});
