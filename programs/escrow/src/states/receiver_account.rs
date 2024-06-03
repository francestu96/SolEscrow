use anchor_lang::prelude::*;

#[account]
pub struct ReceiverAccount {
    pub status: Vec<u8>,
    pub sender: Vec<Pubkey>,
    pub approver: Vec<Pubkey>,
    pub amount: Vec<u64>,
    pub approver_perc_fees: Vec<u8>,
    pub message: Vec<String>,
    pub timestamp: Vec<i64>,
}