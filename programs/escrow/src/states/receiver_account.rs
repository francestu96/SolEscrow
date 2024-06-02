use anchor_lang::prelude::*;

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