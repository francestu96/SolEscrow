use crate::states::{SenderAccount, ReceiverAccount, ApproverAccount};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
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
        mut,
        seeds = [b"escrow_approved".as_ref(), approver.key().as_ref()],
        bump,
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