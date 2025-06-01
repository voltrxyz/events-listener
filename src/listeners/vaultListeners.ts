import { Program, BN } from "@coral-xyz/anchor";
import { VoltrVault } from "../idl/voltr_vault";
import { PublicKey } from "@solana/web3.js";
import { Decimal } from "decimal.js";
import pino from "pino";

// --- Pino Logger Setup ---
const logger = pino({
  level: process.env.LOG_LEVEL || "info", // Default to 'info', configurable
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});

// --- Constants for Decimal Conversion ---
const FIXED_POINT_FRACTIONAL_BITS = 48;
const FIXED_POINT_DIVISOR = new Decimal(2).pow(FIXED_POINT_FRACTIONAL_BITS);

// --- Set for Specific u128 Decimal Fields ---
const FIXED_POINT_U128_FIELDS = new Set([
  "vaultHighestAssetPerLpDecimalBitsBefore",
  "vaultHighestAssetPerLpDecimalBitsAfter",
  "amountAssetToWithdrawDecimalBits",
]);

export function convertFixedPointToDecimal(value: BN): number | string {
  const decimalValue = new Decimal(value.toString());
  try {
    // Perform the division to get the actual decimal value
    return decimalValue.div(FIXED_POINT_DIVISOR).toNumber();
  } catch (e) {
    logger.warn(
      `Error converting fixed-point BN (${value.toString()}) to Decimal.js number. Returning as string. Error: ${
        e instanceof Error ? e.message : e
      }`
    );
    return value.toString(); // Fallback to string if conversion to number fails (e.g. too large/small)
  }
}

function preprocessEventDataForLogging(
  data: any,
  programId: string,
  eventName: string,
  slot: number
): any {
  const processed: { [key: string]: any } = {
    timestamp: new Date().toISOString(), // ISO8601 timestamp
    level: "info", // Default log level for events
    programId: programId,
    eventName: eventName,
    slot: slot,
    // ... other global context if needed
  };

  function transform(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (obj instanceof PublicKey) {
      return obj.toBase58();
    }

    if (Array.isArray(obj)) {
      return obj.map(transform);
    }

    if (obj instanceof BN) {
      // Standard BN to number/string conversion (for u64 etc.)
      try {
        return obj.toNumber(); // May throw for very large BNs
      } catch (e) {
        // logger.trace(`BN ${obj.toString()} too large for number, converting to string.`);
        return obj.toString();
      }
    }

    if (typeof obj === "bigint") {
      return obj.toString();
    }

    if (typeof obj === "object") {
      const result: { [key: string]: any } = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];

          // Skip internal Anchor event fields if they exist and are not needed
          if (key === "discriminator" || key === "programId") continue;

          // Skip our own added global fields if they somehow appear nested
          if (
            key === "timestamp" ||
            key === "level" ||
            key === "eventName" ||
            key === "slot"
          )
            continue;

          // Specific conversion for U80F48 fixed-point fields
          if (FIXED_POINT_U128_FIELDS.has(key) && value instanceof BN) {
            result[key] = convertFixedPointToDecimal(value);
          }
          // Exclude internal padding/reserved fields
          else if (
            !key.startsWith("padding") &&
            !key.startsWith("_padding") &&
            !key.startsWith("reserved") &&
            !key.startsWith("_reserved")
          ) {
            result[key] = transform(value);
          }
        }
      }
      return result;
    }
    return obj;
  }

  processed.eventData = transform(data);
  return processed;
}

// --- Event Listener Functions (Example for one, apply to all) ---

export function listenToAddAdaptorEvent(program: Program<VoltrVault>): number {
  const eventName = "addAdaptorEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
    // Add custom logic here (e.g., save to DB, send notification - though often done by log shipper)
  });
}

export function listenToCancelRequestWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "cancelRequestWithdrawVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToCloseStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "closeStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToDepositStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "depositStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToDepositVaultEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "depositVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToDirectWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "directWithdrawStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToHarvestFeeEvent(program: Program<VoltrVault>): number {
  const eventName = "harvestFeeEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToInitProtocolEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "initProtocolEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToInitializeDirectWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "initializeDirectWithdrawStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToInitializeStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "initializeStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToInitializeVaultEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "initializeVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToRemoveAdaptorEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "removeAdaptorEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToRequestWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "requestWithdrawVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToUpdateProtocolEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "updateProtocolEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToUpdateVaultEvent(program: Program<VoltrVault>): number {
  const eventName = "updateVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToWithdrawStrategyEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "withdrawStrategyEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}

export function listenToWithdrawVaultEvent(
  program: Program<VoltrVault>
): number {
  const eventName = "withdrawVaultEvent";
  logger.info(`Attaching listener for: ${eventName}`);
  return program.addEventListener(eventName, (eventData, slot) => {
    const logEntry = preprocessEventDataForLogging(
      eventData,
      program.programId.toBase58(),
      eventName,
      slot
    );
    logger.info(logEntry, `${eventName} received`);
  });
}
