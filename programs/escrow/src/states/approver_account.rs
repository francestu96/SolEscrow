use anchor_lang::prelude::*;

#[account]
pub struct ApproverAccount {
    pub status: Vec<u8>,
    pub sender: Vec<Pubkey>,
    pub receiver: Vec<Pubkey>,
    pub amount: Vec<u64>,
    pub approver_perc_fees: Vec<u8>,
    pub message: Vec<String>,
    pub timestamp: Vec<i64>,
}
