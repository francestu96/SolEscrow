use anchor_lang::prelude::*;

#[error_code]
pub enum Errors {
    #[msg("Release time not expired yet")]
    RelaseTime,

    #[msg("Only owner can call this function")]
    NotOwner
}