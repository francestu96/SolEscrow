use anchor_lang::system_program::{transfer, Transfer};
use anchor_lang::prelude::*;

mod errors;
use errors::Errors;

mod contexts;
use contexts::*;

mod states;
use states::*;

declare_id!("33CTmeovXMHmqHb45KiaL73m4jVqVQCbzjCm27TFboZx");

const OWNER: &str = "VvXCAgwD5hpAs2Mwne5zoCxjD13f1e9exvpquNtF1e6";

#[program]
pub mod escrow {
    use super::*;

    static mut RELEASE_TIME: u32 = 604800;

    pub fn create_escrow(ctx: Context<CreateEscrow>, amount: u64, approver_perc_fees: u8, message: String) -> Result<()> {
        let fees: u64 = amount * (approver_perc_fees as u64) / 100;

        let sender_pda: &mut Account<SenderAccount> = &mut ctx.accounts.sender_pda;
        sender_pda.status.push(0);
        sender_pda.receiver.push(ctx.accounts.receiver.key());
        sender_pda.approver.push(ctx.accounts.approver.key());
        sender_pda.amount.push(amount);
        sender_pda.approver_perc_fees.push(approver_perc_fees);
        sender_pda.message.push(message.clone());
        sender_pda.timestamp.push(Clock::get()?.unix_timestamp);

        let receiver_pda: &mut Account<ReceiverAccount> = &mut ctx.accounts.receiver_pda;
        receiver_pda.status.push(0);
        receiver_pda.sender.push(ctx.accounts.sender.key());
        receiver_pda.approver.push(ctx.accounts.approver.key());
        receiver_pda.amount.push(amount);
        receiver_pda.approver_perc_fees.push(approver_perc_fees);
        receiver_pda.message.push(message.clone());
        receiver_pda.timestamp.push(Clock::get()?.unix_timestamp);

        let approver_pda: &mut Account<ApproverAccount> = &mut ctx.accounts.approver_pda;
        approver_pda.status.push(0);
        approver_pda.sender.push(ctx.accounts.sender.key());
        approver_pda.receiver.push(ctx.accounts.receiver.key());
        approver_pda.amount.push(amount);
        approver_pda.approver_perc_fees.push(approver_perc_fees);
        approver_pda.message.push(message.clone());
        approver_pda.timestamp.push(Clock::get()?.unix_timestamp);

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
        
        Ok(())
    }

    pub fn approve_escrow(ctx: Context<ApproveEscrow>, approve: bool, escrow_i: u8) -> Result<()> {
        let sender_pda: &mut Account<SenderAccount> = &mut ctx.accounts.sender_pda;
        let receiver_pda: &mut Account<ReceiverAccount> = &mut ctx.accounts.receiver_pda;
        let approver_pda: &mut Account<ApproverAccount> = &mut ctx.accounts.approver_pda;

        let fees: u64 = sender_pda.amount[escrow_i as usize] * (sender_pda.approver_perc_fees[escrow_i as usize] as u64) / 100;
        let amount_to_transfer: u64 = sender_pda.amount[escrow_i as usize] - fees;
        
        if approve {
            sender_pda.status[escrow_i as usize] = 1;
            receiver_pda.status[escrow_i as usize] = 1;
            approver_pda.status[escrow_i as usize] = 1;

            receiver_pda.sub_lamports(amount_to_transfer)?;
            ctx.accounts.receiver.add_lamports(amount_to_transfer)?;

            approver_pda.sub_lamports(fees)?;
            ctx.accounts.approver.add_lamports(fees)?;
        }
        else {
            sender_pda.status[escrow_i as usize] = 2;
            receiver_pda.status[escrow_i as usize] = 2;
            approver_pda.status[escrow_i as usize] = 2;

            receiver_pda.sub_lamports(amount_to_transfer)?;
            ctx.accounts.sender.add_lamports(amount_to_transfer)?;

            approver_pda.sub_lamports(fees)?;
            ctx.accounts.approver.add_lamports(fees)?;
        }

        Ok(())
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>, escrow_i: u8) -> Result<()> {
        let sender_pda: &mut Account<SenderAccount> = &mut ctx.accounts.sender_pda;
        let receiver_pda: &mut Account<ReceiverAccount> = &mut ctx.accounts.receiver_pda;
        let approver_pda: &mut Account<ApproverAccount> = &mut ctx.accounts.approver_pda;

        let fees: u64 = sender_pda.amount[escrow_i as usize] * (sender_pda.approver_perc_fees[escrow_i as usize] as u64) / 100;
        let amount_to_transfer: u64 = sender_pda.amount[escrow_i as usize] - fees;
        
        unsafe {
            if ((Clock::get()?.unix_timestamp - sender_pda.timestamp[escrow_i as usize]) as u32) < RELEASE_TIME {
                return err!(Errors::RelaseTime);
            }
        }

        receiver_pda.sub_lamports(amount_to_transfer)?;
        ctx.accounts.sender.add_lamports(amount_to_transfer)?;

        approver_pda.sub_lamports(fees)?;
        ctx.accounts.sender.add_lamports(fees)?;

        Ok(())
    }

    #[access_control(check(&ctx))]
    pub fn set_release_time(ctx: Context<OnlyOwner>, release_time: u32) -> Result<()> {
        unsafe {
            RELEASE_TIME = release_time;
        }
        Ok(())
    }
}

fn check(ctx: &Context<OnlyOwner>) -> Result<()> {
    // Check if signer === owner
    require_keys_eq!(
        ctx.accounts.signer_account.key(),
        OWNER.parse::<Pubkey>().unwrap(),
        Errors::NotOwner
    );

    Ok(())
}