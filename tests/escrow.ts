import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { expect } from "chai"
import { Escrow } from "../target/types/escrow"

describe("EscrowProgram", () => {
    function format(number: any) {
        const formatter = new Intl.NumberFormat('en-US', { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 4 });
        return formatter.format(number / 10**9).replace(/,/g, ' ');
    }

    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.Escrow as Program<Escrow>

    const wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from([76,10,74,25,61,123,57,23,211,5,238,183,175,0,146,101,80,214,240,49,172,31,102,250,87,238,55,114,253,181,112,131,7,104,199,78,190,160,72,0,241,118,42,15,67,30,96,224,207,96,220,68,133,120,67,130,20,105,131,226,33,138,200,231]));
    // const wallet = anchor.web3.Keypair.generate();
    const to = anchor.web3.Keypair.generate();
    const approver = anchor.web3.Keypair.generate();

    it("Escrow creation", async () => {
        const [ senderPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("escrow_sent"), wallet.publicKey.toBuffer()],
            program.programId
        );
        const [ receiverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("escrow_received"), to.publicKey.toBuffer()],
            program.programId
        );
        const [ approverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("escrow_approved"), approver.publicKey.toBuffer()],
            program.programId
        );

        let walletBalance = await provider.connection.getBalance(wallet.publicKey);
        let senderPDABalance = await provider.connection.getBalance(senderPDA);
        let receiverPDABalance = await provider.connection.getBalance(receiverPDA);
        let approverPDABalance = await provider.connection.getBalance(approverPDA);

        console.log("\n\t------- BEFORE TX -------");
        console.log("\tWallet balance: " + format(walletBalance));
        console.log("\tSender PDA balance: " + format(senderPDABalance));
        console.log("\tReceiver PDA balance: " + format(receiverPDABalance));
        console.log("\tApprover PDA balance: " + format(approverPDABalance));

        await program.methods
            .createEscrow(new anchor.BN(10**9), 10, "Initial escrow message")
            .accounts({ sender: wallet.publicKey, receiver: to.publicKey, approver: approver.publicKey })
            .signers([ wallet ])
            .rpc();

        const account = await program.account.senderAccount.fetch(senderPDA);
        expect(account.amount[0].toNumber()).to.equal(10**9);

        await program.methods
            .createEscrow(new anchor.BN(10**9), 10, "Initial escrow message")
            .accounts({ sender: wallet.publicKey, receiver: to.publicKey, approver: approver.publicKey })
            .signers([ wallet ])
            .rpc();

        walletBalance = await provider.connection.getBalance(wallet.publicKey);
        senderPDABalance = await provider.connection.getBalance(senderPDA);
        receiverPDABalance = await provider.connection.getBalance(receiverPDA);
        approverPDABalance = await provider.connection.getBalance(approverPDA);

        console.log("\n\t------- AFTER TX -------");
        console.log("\tWallet balance: " + format(walletBalance));
        console.log("\tSender PDA balance: " + format(senderPDABalance));
        console.log("\tReceiver PDA balance: " + format(receiverPDABalance));
        console.log("\tApprover PDA balance: " + format(approverPDABalance));
    })

    // it("Escrow Approve", async () => {
    //     const [ senderPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_sent"), wallet.publicKey.toBuffer()],
    //         program.programId
    //     );
    //     const [ receiverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_received"), to.publicKey.toBuffer()],
    //         program.programId
    //     );
    //     const [ approverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_approved"), approver.publicKey.toBuffer()],
    //         program.programId
    //     );

    //     await program.methods
    //         .approveEscrow(true, 0)
    //         .accounts({ sender: wallet.publicKey, receiver: to.publicKey, approver: approver.publicKey })
    //         .signers([ approver ])
    //         .rpc();

    //     let walletBalance = await provider.connection.getBalance(wallet.publicKey);
    //     let receiverBalance = await provider.connection.getBalance(to.publicKey);
    //     let approverBalance = await provider.connection.getBalance(approver.publicKey);
    //     let senderPDABalance = await provider.connection.getBalance(senderPDA);
    //     let receiverPDABalance = await provider.connection.getBalance(receiverPDA);
    //     let approverPDABalance = await provider.connection.getBalance(approverPDA);

    //     console.log("\t Receiver PDA address: " + receiverPDA.toString())
    //     console.log("\t Receiver address: " + to.publicKey)

    //     console.log("\n\t------- AFTER APPROVE -------");
    //     console.log("\tWallet balance: " + format(walletBalance));
    //     console.log("\tSender PDA balance: " + format(senderPDABalance));
    //     console.log("\tReceiver PDA balance: " + format(receiverPDABalance));
    //     console.log("\tApprover PDA balance: " + format(approverPDABalance));
    //     console.log("\n\tReceiver balance: " + format(receiverBalance));
    //     console.log("\tApprover balance: " + format(approverBalance));
    // })

    // it("Release funds", async () => {
    //     const [ senderPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_sent"), wallet.publicKey.toBuffer()],
    //         program.programId
    //     );
    //     const [ receiverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_received"), to.publicKey.toBuffer()],
    //         program.programId
    //     );
    //     const [ approverPDA ] = anchor.web3.PublicKey.findProgramAddressSync(
    //         [Buffer.from("escrow_approved"), approver.publicKey.toBuffer()],
    //         program.programId
    //     );

    //     await program.methods
    //         .releaseEscrow(0)
    //         .accounts({ sender: wallet.publicKey, receiver: to.publicKey, approver: approver.publicKey })
    //         .signers([ wallet ])
    //         .rpc();

    //     let walletBalance = await provider.connection.getBalance(wallet.publicKey);
    //     let senderPDABalance = await provider.connection.getBalance(senderPDA);
    //     let receiverPDABalance = await provider.connection.getBalance(receiverPDA);
    //     let approverPDABalance = await provider.connection.getBalance(approverPDA);

    //     console.log("\n\t------- AFTER RELEASE -------");
    //     console.log("\tWallet balance: " + format(walletBalance));
    //     console.log("\tSender PDA balance: " + format(senderPDABalance));
    //     console.log("\tReceiver PDA balance: " + format(receiverPDABalance));
    //     console.log("\tApprover PDA balance: " + format(approverPDABalance));
    // })
})