// use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::system_program::{transfer, Transfer};
use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("33CTmeovXMHmqHb45KiaL73m4jVqVQCbzjCm27TFboZx");

#[program]
pub mod escrow {
    use super::*;

    pub fn create_escrow(ctx: Context<CreateEscrow>, amount: u64, approver_perc_fees: u8, message: String, timestamp: u32) -> Result<()> {
        let fees: u64 = amount * (approver_perc_fees as u64) / 100;
        let amount_to_transfer: u64 = sender_pda.amount - fees;

        let sender_pda: &mut Account<SenderAccount> = &mut ctx.accounts.sender_pda;
        sender_pda.status = 0;
        sender_pda.receiver = ctx.accounts.receiver.key();
        sender_pda.approver = ctx.accounts.approver.key();
        sender_pda.amount = amount;
        sender_pda.approver_perc_fees = approver_perc_fees;
        sender_pda.message = message.clone();
        sender_pda.timestamp = timestamp;

        let receiver_pda: &mut Account<ReceiverAccount> = &mut ctx.accounts.receiver_pda;
        receiver_pda.status = 0;
        receiver_pda.sender = ctx.accounts.sender.key();
        receiver_pda.approver = ctx.accounts.approver.key();
        receiver_pda.amount = amount;
        receiver_pda.approver_perc_fees = approver_perc_fees;
        receiver_pda.message = message.clone();
        receiver_pda.timestamp = timestamp;

        let approver_pda: &mut Account<ApproverAccount> = &mut ctx.accounts.approver_pda;
        approver_pda.status = 0;
        approver_pda.sender = ctx.accounts.sender.key();
        approver_pda.receiver = ctx.accounts.receiver.key();
        approver_pda.amount = amount;
        approver_pda.approver_perc_fees = approver_perc_fees;
        approver_pda.message = message.clone();
        approver_pda.timestamp = timestamp;
        
        let escrow_transfer_ix = anchor_lang::solana_program::system_instruction::transfer(&ctx.accounts.sender.key(), &receiver_pda.key(), amount - fees);
        let _ = invoke(&escrow_transfer_ix, &[ ctx.accounts.sender.to_account_info(), receiver_pda.to_account_info() ]);
        
        let approver_transfer_ix = anchor_lang::solana_program::system_instruction::transfer(&ctx.accounts.sender.key(), &approver_pda.key(), fees);
        let _ = invoke(&approver_transfer_ix, &[ ctx.accounts.sender.to_account_info(), approver_pda.to_account_info() ]);
        
        msg!("receiver address: {}", approver_pda.receiver.key());
        msg!("receiver_pda address: {0}, balance: {1}", receiver_pda.key(), receiver_pda.get_lamports());
        
        Ok(())
    }

    pub fn approve_escrow(ctx: Context<ApproveEscrow>, approve: bool) -> Result<()> {
        let sender_pda: &mut Account<SenderAccount> = &mut ctx.accounts.sender_pda;
        let receiver_pda: &mut Account<ReceiverAccount> = &mut ctx.accounts.receiver_pda;
        let approver_pda: &mut Account<ApproverAccount> = &mut ctx.accounts.approver_pda;

        let fees: u64 = sender_pda.amount * (sender_pda.approver_perc_fees as u64) / 100;
        let amount_to_transfer: u64 = sender_pda.amount - fees;
        
        if approve {
            sender_pda.status = 1;
            receiver_pda.status = 1;
            approver_pda.status = 1;

            msg!("receiver_pda address: {0}, balance: {1}", receiver_pda.key(), receiver_pda.get_lamports());
            msg!("receiver address: {}", approver_pda.receiver.key());
            
            msg!("I want to send {0} lamports from {1} to {2}", receiver_pda.amount - fees, receiver_pda.key(), approver_pda.receiver.key());

            let (found_receiver_pda, receiver_pda_bump) = Pubkey::find_program_address(&[b"escrow_received", ctx.accounts.receiver.key().as_ref()], &ctx.program_id);

            msg!("found_receiver_pda address: {0}, receiver_pda_bump: {1}", found_receiver_pda, receiver_pda_bump);

            // The following piece of code returns an error during the transfer() function ----
            // I simply need to transfer SOL from the receiver_pda (funds have been moved here from the previous create_escrow function) to the actual receiver account
            
            let receiver_key: Pubkey = ctx.accounts.receiver.key();
            let receiver_bump_seed: u8 = ctx.bumps.receiver_pda;
            let signer_seeds: &[&[&[u8]]] = &[&[b"escrow_received", receiver_key.as_ref(), &[receiver_bump_seed]]];

            let cpi_context: CpiContext<Transfer> = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: receiver_pda.to_account_info(),
                    to: ctx.accounts.receiver.to_account_info()
                }
            ).with_signer(signer_seeds);

            transfer(cpi_context, sender_pda.amount - fees)?;
            
            // ------------------------------------------------------------------------------------
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(
        init,
        seeds = [b"escrow_sent".as_ref(), sender.key().as_ref()],
        bump,
        payer = sender,
        space = size_of::<SenderAccount>() + 256
    )]
    pub sender_pda: Account<'info, SenderAccount>,

    #[account(
        init,
        seeds = [b"escrow_received".as_ref(), receiver.key().as_ref()],
        bump,
        payer = sender,
        space = size_of::<ReceiverAccount>() + 256
    )]
    pub receiver_pda: Account<'info, ReceiverAccount>,

    #[account(
        init,
        seeds = [b"escrow_approved".as_ref(), approver.key().as_ref()],
        bump,
        payer = sender,
        space = size_of::<ApproverAccount>() + 256
    )]
    pub approver_pda: Account<'info, ApproverAccount>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: safe
    pub receiver: AccountInfo<'info>,
    
    /// CHECK: safe
    pub approver: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveEscrow<'info> {
    #[account(
        seeds = [b"escrow_sent".as_ref(), sender.key().as_ref()],
        bump,
    )]
    pub sender_pda: Account<'info, SenderAccount>,

    #[account(
        mut,
        seeds = [b"escrow_received".as_ref(), receiver.key().as_ref()],
        bump,
    )]
    pub receiver_pda: Account<'info, ReceiverAccount>,

    #[account(
        seeds = [b"escrow_approved".as_ref(), approver.key().as_ref()],
        bump,
    )]
    pub approver_pda: Account<'info, ApproverAccount>,
    
    /// CHECK: safe
    pub sender: AccountInfo<'info>,
    
    /// CHECK: safe
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    
    pub approver: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SenderAccount {
    pub status: u8,
    pub receiver: Pubkey,
    pub approver: Pubkey,
    pub amount: u64,
    pub approver_perc_fees: u8,
    pub message: String,
    pub timestamp: u32,
}

#[account]
pub struct ReceiverAccount {
    pub status: u8,
    pub sender: Pubkey,
    pub approver: Pubkey,
    pub amount: u64,
    pub approver_perc_fees: u8,
    pub message: String,
    pub timestamp: u32,
}

#[account]
pub struct ApproverAccount {
    pub status: u8,
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub approver_perc_fees: u8,
    pub message: String,
    pub timestamp: u32,
}
