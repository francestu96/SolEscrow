import * as anchor from "@coral-xyz/anchor";

export type EscrowModel = {
    status: Buffer;
    sender?: anchor.web3.PublicKey[];
    receiver?: anchor.web3.PublicKey[];
    approver?: anchor.web3.PublicKey[];
    amount: anchor.BN[];
    approverPercFees: Buffer;
    message: string[];
    timestamp: anchor.BN[];
};