import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { VoltrVault } from "../idl/voltr_vault"; // Import the TS IDL type
import * as idl from "../idl/voltr_vault"; // Import the JSON IDL
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
if (!SOLANA_RPC_URL) {
  throw new Error("SOLANA_RPC_URL is not defined in the .env file");
}

// --- Configuration ---
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

// --- Setup Anchor Provider ---
// We need a Wallet instance, but for listeners, signing isn't required.
// Using a dummy keypair is OK.
const dummyWallet: Wallet = {
  payer: Keypair.generate(), // Dummy keypair
  publicKey: Keypair.generate().publicKey, // Dummy public key
  signTransaction: async (tx) => {
    throw new Error("Dummy wallet cannot sign");
  },
  signAllTransactions: async (txs) => {
    throw new Error("Dummy wallet cannot sign");
  },
};

const provider = new AnchorProvider(connection, dummyWallet, {
  preflightCommitment: "confirmed",
  commitment: "confirmed",
});

// Set the provider as the default
anchor.setProvider(provider);

// --- Create Program Instance ---
// Use the imported IDL types for type safety
const program = new Program<VoltrVault>(idl as VoltrVault, provider);

console.log(`Connected to cluster: ${connection.rpcEndpoint}`);
console.log(`Listening to program: ${program.programId.toBase58()}`);

export { program, provider, connection };
