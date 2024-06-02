use crate::states::{ReceiverAccount, SenderAccount, ApproverAccount};
use anchor_lang::prelude::*;
use std::mem::size_of;

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
