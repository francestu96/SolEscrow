use anchor_lang::prelude::*;

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
