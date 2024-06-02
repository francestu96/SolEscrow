use anchor_lang::system_program::{transfer, Transfer};
use anchor_lang::prelude::*;

mod contexts;
use contexts::*;

mod states;
use states::*;

declare_id!("33CTmeovXMHmqHb45KiaL73m4jVqVQCbzjCm27TFboZx");

#[program]
pub mod escrow {
    use super::*;

    pub fn create_escrow(ctx: Context<CreateEscrow>, amount: u64, approver_perc_fees: u8, message: String, timestamp: u32) -> Result<()> {
        let fees: u64 = amount * (approver_perc_fees as u64) / 100;

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

        let escrow_cpi_context: CpiContext<Transfer> = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            Transfer {
                from: ctx.accounts.sender.to_account_info(),
                to: receiver_pda.to_account_info(),
            });
        transfer(escrow_cpi_context, amount - fees)?;

        let approver_cpi_context: CpiContext<Transfer> = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            Transfer {
                from: ctx.accounts.sender.to_account_info(),
                to: approver_pda.to_account_info(),
            });
        transfer(approver_cpi_context, fees)?;
        
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

            receiver_pda.sub_lamports(amount_to_transfer)?;
            ctx.accounts.receiver.add_lamports(amount_to_transfer)?;

            approver_pda.sub_lamports(fees)?;
            ctx.accounts.approver.add_lamports(fees)?;
        }

        Ok(())
    }
}
