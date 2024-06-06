/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/escrow.json`.
 */
export type Escrow = {
  "address": "3pRPkw3RvV5LVAynwbx6pnZKgt1e5GvD7q3wQPM7XKSU",
  "metadata": {
    "name": "escrow",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveEscrow",
      "discriminator": [
        79,
        143,
        76,
        129,
        122,
        177,
        12,
        122
      ],
      "accounts": [
        {
          "name": "senderPda",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "receiverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "approverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  97,
                  112,
                  112,
                  114,
                  111,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "approver"
              }
            ]
          }
        },
        {
          "name": "sender"
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "approver",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "approve",
          "type": "bool"
        },
        {
          "name": "escrowI",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createEscrow",
      "discriminator": [
        253,
        215,
        165,
        116,
        36,
        108,
        68,
        80
      ],
      "accounts": [
        {
          "name": "senderPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "receiverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "approverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  97,
                  112,
                  112,
                  114,
                  111,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "approver"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver"
        },
        {
          "name": "approver"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "approverPercFees",
          "type": "u8"
        },
        {
          "name": "message",
          "type": "string"
        }
      ]
    },
    {
      "name": "releaseEscrow",
      "discriminator": [
        146,
        253,
        129,
        233,
        20,
        145,
        181,
        206
      ],
      "accounts": [
        {
          "name": "senderPda",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  115,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "sender"
              }
            ]
          }
        },
        {
          "name": "receiverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "receiver"
              }
            ]
          }
        },
        {
          "name": "approverPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  115,
                  99,
                  114,
                  111,
                  119,
                  95,
                  97,
                  112,
                  112,
                  114,
                  111,
                  118,
                  101,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "approver"
              }
            ]
          }
        },
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "receiver"
        },
        {
          "name": "approver"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "escrowI",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "approverAccount",
      "discriminator": [
        213,
        126,
        187,
        132,
        24,
        187,
        54,
        125
      ]
    },
    {
      "name": "receiverAccount",
      "discriminator": [
        46,
        137,
        8,
        58,
        14,
        87,
        218,
        17
      ]
    },
    {
      "name": "senderAccount",
      "discriminator": [
        20,
        78,
        121,
        82,
        139,
        53,
        146,
        24
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "relaseTime",
      "msg": "Release time not expired yet"
    }
  ],
  "types": [
    {
      "name": "approverAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": "bytes"
          },
          {
            "name": "sender",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "receiver",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "amount",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "approverPercFees",
            "type": "bytes"
          },
          {
            "name": "message",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "timestamp",
            "type": {
              "vec": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "receiverAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": "bytes"
          },
          {
            "name": "sender",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "approver",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "amount",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "approverPercFees",
            "type": "bytes"
          },
          {
            "name": "message",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "timestamp",
            "type": {
              "vec": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "senderAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "status",
            "type": "bytes"
          },
          {
            "name": "receiver",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "approver",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "amount",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "approverPercFees",
            "type": "bytes"
          },
          {
            "name": "message",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "timestamp",
            "type": {
              "vec": "i64"
            }
          }
        ]
      }
    }
  ]
};
