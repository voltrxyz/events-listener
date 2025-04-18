## Event Handling & Customization

- **Event Definitions:** All events emitted by the Voltr Vault program are defined in the IDL (`src/idl/`). The TypeScript types (`VoltrVault` in `src/idl/voltr_vault.ts`) provide type safety.
- **Listeners:** The `src/listeners/vaultListeners.ts` file contains individual functions (`listenToXxxEvent`) for each event type defined in the IDL.
- **Data Conversion:** The `stringifyEventData` function in `vaultListeners.ts` handles the conversion of event data for logging:
  - `PublicKey` objects are converted to their Base58 string representation.
  - `BN` objects (representing `u64` or standard `u128`) are attempted to be converted to JavaScript `number` using `.toNumber()`. If this fails (e.g., value exceeds `Number.MAX_SAFE_INTEGER`), it falls back to a string representation using `.toString()`.
  - Specific `u128` fields identified in the `DECIMAL_U128_FIELDS` set are treated as fixed-point decimals and converted using `decimal.js` via the `convertDecimalBitsToDecimal` function.
- **Adding Custom Logic:** To perform actions when an event is received (e.g., save to a database, send a notification, update a UI), modify the callback function within the corresponding `program.addEventListener(...)` call inside `src/listeners/vaultListeners.ts`.

  ```typescript
  // Example in src/listeners/vaultListeners.ts
  export function listenToDepositVaultEvent(
    program: Program<VoltrVault>
  ): number {
    console.log("Attaching listener for: depositVaultEvent");
    return program.addEventListener("depositVaultEvent", (event, slot) => {
      console.log(`\n[Event Received] depositVaultEvent (Slot: ${slot})`);
      const processedData = stringifyEventData(event); // Get processed data
      console.log("Data:", JSON.stringify(processedData, null, 2));

      // --- ADD YOUR CUSTOM LOGIC HERE ---
      // e.g., databaseService.saveDeposit(processedData.vault, processedData.user, processedData.vaultAssetTotalValueAfter);
      // e.g., notificationService.sendAlert(`Deposit processed for user ${processedData.user}`);
      // ----------------------------------
    });
  }
  ```

## Important Notes

- **Precision:** Be aware that converting large `u64` and `u128` values (especially those _not_ handled by the specific decimal conversion) to standard JavaScript numbers using `.toNumber()` can lead to **loss of precision** if the value exceeds `Number.MAX_SAFE_INTEGER` (approximately 9 quadrillion). For critical calculations or storage, consider using the string representation (`.toString()`) or keeping the `BN` / `Decimal` objects.
- **RPC Node:** The reliability and latency of event listening depend heavily on the performance and stability of your chosen Solana RPC node.
