use crate::states::{SenderAccount, ReceiverAccount, ApproverAccount};
use anchor_lang::prelude::*;
use std::mem::size_of;

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(
        init_if_needed,
        seeds = [b"escrow_sent".as_ref(), sender.key().as_ref()],
        bump,
        payer = sender,
        space = (size_of::<SenderAccount>() + 256) * 10
    )]
    pub sender_pda: Box<Account<'info, SenderAccount>>,

    #[account(
        init_if_needed,
        seeds = [b"escrow_received".as_ref(), receiver.key().as_ref()],
        bump,
        payer = sender,
        space = (size_of::<ReceiverAccount>() + 256) * 10
    )]
    pub receiver_pda: Box<Account<'info, ReceiverAccount>>,

    #[account(
        init_if_needed,
        seeds = [b"escrow_approved".as_ref(), approver.key().as_ref()],
        bump,
        payer = sender,
        space = (size_of::<ApproverAccount>() + 256) * 10
    )]
    pub approver_pda: Box<Account<'info, ApproverAccount>>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    /// CHECK: safe
    pub receiver: AccountInfo<'info>,
    
    /// CHECK: safe
    pub approver: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}
