import { Program, BN } from "@coral-xyz/anchor";
import { VoltrVault } from "../idl/voltr_vault";
import { PublicKey } from "@solana/web3.js";
import { Decimal } from "decimal.js";

// --- Constants for Decimal Conversion ---
const DECIMAL_FRACTIONAL_BYTES = 6;
const DECIMAL_DIVISOR = new Decimal(2).pow(8 * DECIMAL_FRACTIONAL_BYTES);

// --- Set for Specific u128 Decimal Fields ---
const DECIMAL_U128_FIELDS = new Set([
  "vaultHighestAssetPerLpDecimalBitsBefore",
  "vaultHighestAssetPerLpDecimalBitsAfter",
  "amountAssetToWithdrawDecimalBits",
]);

export function convertDecimalBitsToDecimal(value: BN): number {
  const decimalValue = new Decimal(value.toString());
  try {
    return decimalValue.div(DECIMAL_DIVISOR).toNumber();
  } catch (e) {
    console.error(
      `Error converting decimal bits (${value.toString()}) to Decimal number: ${
        e instanceof Error ? e.message : e
      }. Returning NaN.`
    );
    return NaN;
  }
}

function stringifyEventData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle PublicKey first
  if (data instanceof PublicKey) {
    return data.toBase58();
  }

  // Handle Arrays recursively
  if (Array.isArray(data)) {
    return data.map(stringifyEventData);
  }

  // Handle Objects: Check for specific keys AND process recursively
  if (
    typeof data === "object" &&
    !(data instanceof BN) &&
    !(typeof data === "bigint")
  ) {
    const result: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];

        if (DECIMAL_U128_FIELDS.has(key) && value instanceof BN) {
          result[key] = convertDecimalBitsToDecimal(value); // Apply specific conversion
        }
        // Exclude internal padding/reserved fields, then process others recursively
        else if (
          !key.startsWith("padding") &&
          !key.startsWith("_padding") &&
          !key.startsWith("reserved") &&
          !key.startsWith("_reserved")
        ) {
          // Recursively call stringifyEventData for nested properties
          result[key] = stringifyEventData(value);
        }
        // Implicitly skip padding/reserved fields
      }
    }
    return result;
  }

  // Handle BN (u64 or u128 NOT handled above as specific decimal fields)
  if (data instanceof BN) {
    try {
      return data.toNumber();
    } catch (e) {
      console.warn(
        `Warning: BN.toNumber() failed (likely > MAX_SAFE_INTEGER): ${data.toString()}. Falling back to string. Error: ${
          e instanceof Error ? e.message : e
        }`
      );
      // Fallback to string for safety
      return data.toString();
    }
  }

  // Handle native BigInt (convert to string for safety)
  if (typeof data === "bigint") {
    return data.toString();
  }

  return data;
}

// --- Event Listener Functions ---

export function listenToAddAdaptorEvent(program: Program<VoltrVault>): number {
  console.log("Attaching listener for: addAdaptorEvent");
  return program.addEventListener("addAdaptorEvent", (event, slot) => {
    console.log(`\n[Event Received] addAdaptorEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
    // Add custom logic here (e.g., save to DB, send notification)
  });
}

export function listenToCancelRequestWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: cancelRequestWithdrawVaultEvent");
  return program.addEventListener(
    "cancelRequestWithdrawVaultEvent",
    (event, slot) => {
      console.log(
        `\n[Event Received] cancelRequestWithdrawVaultEvent (Slot: ${slot})`
      );
      console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
    }
  );
}

export function listenToDepositStrategyEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: depositStrategyEvent");
  return program.addEventListener("depositStrategyEvent", (event, slot) => {
    console.log(`\n[Event Received] depositStrategyEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToDepositVaultEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: depositVaultEvent");
  return program.addEventListener("depositVaultEvent", (event, slot) => {
    console.log(`\n[Event Received] depositVaultEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToDirectWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: directWithdrawStrategyEvent");
  return program.addEventListener(
    "directWithdrawStrategyEvent",
    (event, slot) => {
      console.log(
        `\n[Event Received] directWithdrawStrategyEvent (Slot: ${slot})`
      );
      console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
    }
  );
}

export function listenToHarvestFeeEvent(program: Program<VoltrVault>): number {
  console.log("Attaching listener for: harvestFeeEvent");
  return program.addEventListener("harvestFeeEvent", (event, slot) => {
    console.log(`\n[Event Received] harvestFeeEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToInitProtocolEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: initProtocolEvent");
  return program.addEventListener("initProtocolEvent", (event, slot) => {
    console.log(`\n[Event Received] initProtocolEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToInitializeDirectWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: initializeDirectWithdrawStrategyEvent");
  return program.addEventListener(
    "initializeDirectWithdrawStrategyEvent",
    (event, slot) => {
      console.log(
        `\n[Event Received] initializeDirectWithdrawStrategyEvent (Slot: ${slot})`
      );
      console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
    }
  );
}

export function listenToInitializeStrategyEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: initializeStrategyEvent");
  return program.addEventListener("initializeStrategyEvent", (event, slot) => {
    console.log(`\n[Event Received] initializeStrategyEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToInitializeVaultEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: initializeVaultEvent");
  return program.addEventListener("initializeVaultEvent", (event, slot) => {
    console.log(`\n[Event Received] initializeVaultEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToRemoveAdaptorEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: removeAdaptorEvent");
  return program.addEventListener("removeAdaptorEvent", (event, slot) => {
    console.log(`\n[Event Received] removeAdaptorEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToRequestWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: requestWithdrawVaultEvent");
  return program.addEventListener(
    "requestWithdrawVaultEvent",
    (event, slot) => {
      console.log(
        `\n[Event Received] requestWithdrawVaultEvent (Slot: ${slot})`
      );
      console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
    }
  );
}

export function listenToUpdateProtocolEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: updateProtocolEvent");
  return program.addEventListener("updateProtocolEvent", (event, slot) => {
    console.log(`\n[Event Received] updateProtocolEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToUpdateVaultEvent(program: Program<VoltrVault>): number {
  console.log("Attaching listener for: updateVaultEvent");
  return program.addEventListener("updateVaultEvent", (event, slot) => {
    console.log(`\n[Event Received] updateVaultEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: withdrawStrategyEvent");
  return program.addEventListener("withdrawStrategyEvent", (event, slot) => {
    console.log(`\n[Event Received] withdrawStrategyEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}

export function listenToWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  console.log("Attaching listener for: withdrawVaultEvent");
  return program.addEventListener("withdrawVaultEvent", (event, slot) => {
    console.log(`\n[Event Received] withdrawVaultEvent (Slot: ${slot})`);
    console.log("Data:", JSON.stringify(stringifyEventData(event), null, 2));
  });
}
