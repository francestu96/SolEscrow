use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct OnlyOwner<'info> {
    pub signer_account: Signer<'info>,
}