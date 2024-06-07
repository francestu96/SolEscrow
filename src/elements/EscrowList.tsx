import { Box, Card, CardBody, CardFooter, Button, CardHeader, HStack, Link, Spinner, Stack, Text, Tooltip, VStack, useColorMode, useToast } from "@chakra-ui/react";
import { AnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { EscrowModel } from "utils/EscrowModel";
import { PiProhibitInset } from "react-icons/pi";
import { BN, Program } from "@coral-xyz/anchor";
import { FaEthereum } from "react-icons/fa";
import { PublicKey } from '@solana/web3.js';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Countdown from "react-countdown";
import { Escrow } from "utils/escrow";
import { useState } from "react";

const EscrowList = ({ escrows, sent, approved, web3button, releaseButton, wallet, program }: { escrows: EscrowModel | null | undefined, sent: boolean, approved: boolean, web3button: boolean, releaseButton: boolean, wallet: AnchorWallet, program: Program<Escrow> }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { connection } = useConnection();
  const [isApproveLoadingIndex, setIsApproveLoadingIndex] = useState(-1);
  const [isDenyLoadingIndex, setIsDenyLoadingIndex] = useState(-1);
  const [isReleaseLoadingIndex, setIsReleaseLoadingIndex] = useState(-1);

  const approveEscrow = async (approve: boolean, index: number, escrowSender: PublicKey, escrowReceiver: PublicKey, status: Buffer) => {
    if (approve){
        setIsApproveLoadingIndex(index);
    }
    else {
      setIsDenyLoadingIndex(index);  
    }

    try {
      const tx = await program.methods
        .approveEscrow(approve, index)
        .accounts({ sender: escrowSender, receiver: escrowReceiver, approver: wallet.publicKey })
        .transaction();

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      const signedTx = await wallet.signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());

      await connection.confirmTransaction({
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
        signature: txId
      });

      toast({ description: "Transaction success", status: 'success', position: "bottom-right", isClosable: true, duration: 3000 });

      status[index] = approve ? 1 : 2;

      setIsApproveLoadingIndex(-1);
      setIsDenyLoadingIndex(-1);
    }
    catch (err: any) {
      setIsApproveLoadingIndex(-1);
      setIsDenyLoadingIndex(-1);

      console.log(err);
      toast({ description: "Transaction rejected", status: 'error', position: "bottom-right", isClosable: true, duration: 3000 });
    }
  }

  const releaseEscrow = async (index: number, escrowReceiver: PublicKey, escrowApprover: PublicKey, status: Buffer) => {
    setIsReleaseLoadingIndex(index);

    try {
      const tx = await program.methods
        .releaseEscrow(index)
        .accounts({ sender: wallet.publicKey, receiver: escrowReceiver, approver: escrowApprover })
        .transaction();

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      const signedTx = await wallet.signTransaction(tx);
      const txId = await connection.sendRawTransaction(signedTx.serialize());

      await connection.confirmTransaction({
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
        signature: txId
      });

      toast({ description: "Transaction success", status: 'success', position: "bottom-right", isClosable: true, duration: 3000 });

      status[index] = 3;

      setIsReleaseLoadingIndex(-1);
    }
    catch (err: any) {
      setIsReleaseLoadingIndex(-1);

      console.log(err);
      toast({ description: "Transaction rejected", status: 'error', position: "bottom-right", isClosable: true, duration: 3000 });
    }
  }

  const checkReleaseTime = (timestamp: BN) => {
    const delta = (Date.now() / 1000) - timestamp.toNumber();

    if (delta > (parseInt(process.env.NEXT_PUBLIC_RELEASE_TIME ? process.env.NEXT_PUBLIC_RELEASE_TIME : "0"))){
      return 0;
    }
    return delta;
  }

  return (
    <>
      {!escrows ? (
        <Text fontFamily="satoshi-bold" fontSize="lg" align="center">No Escrows Found</Text>
      ) : (
        escrows.amount.map((amount: BN, index: number) => (
          <Card mt="5" key={index} borderWidth="thin" borderColor={escrows.status[index] === 1 ? "limegreen" : (escrows.status[index] === 2 ? "main" : "inherit")}>
            <CardHeader py="2">
              {sent ? (
                <Stack direction={["column", "column", "row", "row"]} justifyContent="space-between">
                  <HStack p="2" color="limegreen" display={escrows.status[index] === 1 ? "flex" : "none"}>
                    <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">APPROVED</Text>
                    <FaCheck />
                  </HStack>
                  <HStack p="2" color="main" display={escrows.status[index] === 2 ? "flex" : "none"}>
                    <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">DENIED</Text>
                    <ImCross />
                  </HStack>
                  <HStack p="2" color="orange.300" display={escrows.status[index] === 0 && amount && amount.toNumber() > 0 ? "flex" : "none"}>
                    <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">Waiting for verification</Text>
                    <Spinner speed="2s" ml="2" />
                  </HStack>
                  <VStack alignItems="end">
                    <HStack fontSize={["3xs", "2xs", "xs", "sm"]}>
                      <Text>To:</Text>
                      <Box backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" p="2">
                        <Text>{escrows.receiver![index].toString()}</Text>
                      </Box>
                    </HStack>
                    <HStack fontSize={["3xs", "2xs", "xs", "sm"]}>
                      <Text>Approver:</Text>
                      <Box backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" p="2">
                        <Text>{escrows.approver![index].toString()}</Text>
                      </Box>
                    </HStack>
                  </VStack>
                </Stack>
              ) : (
                <Stack direction={["column", "column", "row", "row"]} justifyContent="space-between">
                  <HStack>
                    <HStack display={web3button && escrows.status[index] === 0 ? "flex" : "none"}>
                      <Button isLoading={isApproveLoadingIndex === index} style={{ padding: "0", minWidth: "unset", background: "transparent" }} onClick={() => approveEscrow(true, index, escrows.sender![index], escrows.receiver![index], escrows.status)}>
                        <Tooltip hasArrow label='Approve' bg='gray.300' color='black' placement="top">
                          <span>
                            <AiOutlineCheckCircle style={{ color: "lime", fontSize: "35px" }} />
                          </span>
                        </Tooltip>
                      </Button>
                      <Button isLoading={isDenyLoadingIndex === index} style={{ padding: "0", minWidth: "unset", background: "transparent" }} onClick={() => approveEscrow(false, index, escrows.sender![index], escrows.receiver![index], escrows.status)}>
                        <Tooltip hasArrow label='Deny' bg='gray.300' color='black' placement="top">
                          <span>
                            <PiProhibitInset style={{ color: "red", fontSize: "37px" }} />
                          </span>
                        </Tooltip>
                      </Button>
                      {/* <Web3Button
                        contractAddress={process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || ""}
                        contractAbi={ESCROW_ABI}
                        style={{ padding: "0", minWidth: "unset", background: "transparent" }}
                        onError={(e) => {
                          if (e.message.includes("Certifier address not valid for this payment")) {
                            toast({ description: "Certifier address not valid for this payment", status: 'error', position: "top", isClosable: true, duration: 3000 });
                          }
                          else {
                            toast({ description: "Transaction rejected", status: 'error', position: "bottom-right", isClosable: true, duration: 3000 });
                            console.log(e);
                          }
                        }}
                        onSuccess={() => { escrow.approved = false; setRefresh(!refresh) }}
                        action={async (contract) => await contract.call("certify", ["0x" + escrow.topics[1].substring(26), "0x" + escrow.topics[2].substring(26), escrow.escrowCounter, true])}
                      >
                        <Tooltip hasArrow label='Approve' bg='gray.300' color='black' placement="top">
                          <span>
                            <AiOutlineCheckCircle className="icons" style={{ color: "#FF001E" }} />
                          </span>
                        </Tooltip>
                      </Web3Button>
                      <Web3Button
                        contractAddress={process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || ""}
                        contractAbi={ESCROW_ABI}
                        style={{ padding: "0", minWidth: "unset", background: "transparent" }}
                        onError={(e) => {
                          if (e.message.includes("Certifier address not valid for this payment")) {
                            toast({ description: "Certifier address not valid for this payment", status: 'error', position: "top", isClosable: true, duration: 3000 });
                          }
                          else {
                            toast({ description: "Transaction rejected", status: 'error', position: "bottom-right", isClosable: true, duration: 3000 });
                            console.log(e);
                          }
                        }}
                        onSuccess={() => { escrow.approved = true; setRefresh(!refresh) }}
                        action={async (contract) => await contract.call("certify", ["0x" + escrow.topics[1].substring(26), "0x" + escrow.topics[2].substring(26), escrow.escrowCounter, false])}
                      >
                        <Tooltip hasArrow label='Deny' bg='gray.300' color='black' placement="top">
                          <span>
                            <PiProhibitInset className="icons" style={{ color: "#C53030" }} />
                          </span>
                        </Tooltip>
                      </Web3Button>                     */}
                    </HStack>
                    <HStack p="2" color="limegreen" display={escrows.status[index] === 1 ? "flex" : "none"}>
                      <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">APPROVED</Text>
                      <FaCheck />
                    </HStack>
                    <HStack p="2" color="main" display={escrows.status[index] === 2 ? "flex" : "none"}>
                      <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">DENIED</Text>
                      <ImCross />
                    </HStack>
                    <HStack p="2" color="orange.300" display={escrows.status[index] === 0 && !web3button ? "flex" : "none"}>
                      <Text fontSize={["xs", "xs", "sm", "md"]} fontWeight="bold">Waiting for verification</Text>
                      <Spinner speed="2s" ml="2" />
                    </HStack>
                  </HStack>
                  <VStack alignItems="end">
                    <HStack fontSize={["3xs", "2xs", "xs", "sm"]}>
                      <Text>From:</Text>
                      <Box backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" p="2">
                        <Text>{escrows.sender ? escrows.sender[index].toString() : wallet.publicKey.toString()}</Text>
                      </Box>
                    </HStack>
                    {
                      approved ? (
                        <HStack fontSize={["3xs", "2xs", "xs", "sm"]}>
                          <Text>Approver:</Text>
                          <Box backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" p="2">
                            <Text>{escrows.approver ? escrows.approver[index].toString() : wallet.publicKey.toString()}</Text>
                          </Box>
                        </HStack>
                      ) : (
                        <HStack fontSize={["3xs", "2xs", "xs", "sm"]}>
                          <Text>Approver:</Text>
                          <Box backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" p="2">
                            <Text>{escrows.approver ? escrows.approver[index].toString() : wallet.publicKey.toString()}</Text>
                          </Box>
                        </HStack>
                      )
                    }
                  </VStack>
                </Stack>
              )
              }

            </CardHeader>
            <CardBody backgroundColor={colorMode == "dark" ? "gray.800" : "gray.200"} rounded="lg" mx="5">
              {
                sent ? (
                  <HStack justifyContent="space-between" flexWrap="wrap" overflow="auto">
                    <Tooltip hasArrow label='Amount with fees' bg='gray.300' color='black' placement="top">
                      <Box w={["40%", "30%", "20%", "10%"]} backgroundColor={colorMode == "dark" ? "gray.900" : "gray.100"} rounded="lg" p="2">
                        <Text fontSize={["xs", "sm", "md", "md"]} ><b>SOL:</b> {(amount.toNumber() / 10**9)}</Text>
                      </Box>
                    </Tooltip>
                    <Text fontSize={["xs", "sm", "md", "md"]} whiteSpace="pre">{escrows.message[index]}</Text>
                  </HStack>
                ) : (
                  <HStack justifyContent="space-between" flexWrap="wrap" overflow="auto">
                    <Text fontSize={["xs", "sm", "md", "md"]} whiteSpace="pre">{escrows.message[index]}</Text>
                    <Tooltip hasArrow label='Amount with fees' bg='gray.300' color='black' placement="top">
                      <Box w={["40%", "30%", "20%", "10%"]} backgroundColor={colorMode == "dark" ? "gray.900" : "gray.100"} rounded="lg" p="2">
                        <Text fontSize={["xs", "sm", "md", "md"]} ><b>SOL:</b> {(amount.toNumber() / 10**9)}</Text>
                      </Box>
                    </Tooltip>
                  </HStack>
                )
              }
            </CardBody>
            <CardFooter color="gray.400" fontSize={["3xs", "2xs", "xs", "sm"]}>
              <HStack width="100%" alignItems="end">
                <HStack fontSize={["3xs", "2xs", "xs", "xs"]} py="2" width="100%" justifyContent={"space-between"}>
                  {/* <Link isExternal color="main" href={process.env.NEXT_PUBLIC_CHAIN_SCAN_URL + "/" + escrow.transactionHash}>
                    <ExternalLinkIcon style={{ color: colorMode == "dark" ? "white" : "black" }} mr="1" />
                    {escrow.transactionHash.substring(0, 26)}...
                  </Link> */}
                  <Text>
                    {new Date(escrows.timestamp[index].toNumber() * 1000).toLocaleDateString(undefined, { hour: "2-digit", minute: "2-digit", hourCycle: "h24" })}
                  </Text>
                </HStack>
                {sent && escrows.status[index] === 0 && releaseButton &&
                  (
                    <Button
                      onClick={() => releaseEscrow(index, escrows.receiver![index], escrows.approver![index], escrows.status)}
                      _disabled={{backgroundColor: checkReleaseTime(escrows.timestamp[index]) != 0 ? "#C53030" : (colorMode == "dark" ? "lawngreen" : "green"), cursor: "not-allowed"}}
                      isDisabled={checkReleaseTime(escrows.timestamp[index]) != 0} 
                      isLoading={isReleaseLoadingIndex === index}
                      style = {{ fontSize: "inherit", maxWidth: "50%", maxHeight: "2.5rem", color: colorMode == "dark" ? "#171923" : "white", backgroundColor: checkReleaseTime(escrows.timestamp[index]) != 0 ? "#C53030" : (colorMode == "dark" ? "lawngreen" : "green") }}
                    >
                      <HStack justifyContent="space-between" width={checkReleaseTime(escrows.timestamp[index]) == 0 ? "80%" : "100%"} px="2">
                        {
                          checkReleaseTime(escrows.timestamp[index]) == 0
                            ? <Text fontSize="md">Release</Text>
                            : (
                              checkReleaseTime(escrows.timestamp[index]) ? (
                                <VStack gap="1">
                                  <Text>Release in</Text>
                                  <Countdown date={new Date(new Date().getTime() + checkReleaseTime(escrows.timestamp[index]) * 1000)} />
                                </VStack>
                              ) : <Text>Please reload</Text>
                            )
                        }
                        <FaEthereum size={"30"} style={{ color: colorMode == "dark" ? "#171923" : "white" }} />
                      </HStack>
                    </Button>
                    // <Web3Button
                    //   contractAddress={process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || ""}
                    //   contractAbi={ESCROW_ABI}
                    //   isDisabled={Number(escrow.redeemTime) != 0}
                    //   style={{ fontSize: "inherit", maxWidth: "50%", maxHeight: "2.5rem", color: colorMode == "dark" ? "#171923" : "white", backgroundColor: Number(escrow.redeemTime) != 0 ? "#C53030" : (colorMode == "dark" ? "lawngreen" : "green") }}
                    //   onError={(e) => {
                    //     if (e.message.includes("Release time")) {
                    //       toast({ description: "Release time still in progress...", status: 'error', position: "top", isClosable: true, duration: 3000 });
                    //     }
                    //     else {
                    //       toast({ description: "Transaction rejected", status: 'error', position: "bottom-right", isClosable: true, duration: 3000 });
                    //       console.log(e);
                    //     }
                    //   }}
                    //   onSuccess={() => { escrow.approved = true; setRefresh(!refresh) }}
                    //   action={async (contract) => await contract.call("releaseFunds", ["0x" + escrow.topics[2].substring(26), escrow.escrowCounter])}
                    // >
                    //   <HStack justifyContent="space-between" width={Number(escrow.redeemTime) == 0 ? "80%" : "100%"} px="2">
                    //     {
                    //       Number(escrow.redeemTime) == 0
                    //         ? <Text fontSize="md">Release</Text>
                    //         : (
                    //           Number(escrow.redeemTime) ? (
                    //             <VStack gap="1">
                    //               <Text>Release in</Text>
                    //               <Countdown date={new Date(new Date().getTime() + Number(escrow.redeemTime) * 1000)} />
                    //             </VStack>
                    //           ) : <Text>Please reload</Text>
                    //         )
                    //     }
                    //     <FaEthereum size={"20"} style={{ color: colorMode == "dark" ? "#171923" : "white" }} />
                    //   </HStack>
                    // </Web3Button>
                  )
                }
              </HStack>
            </CardFooter>
          </Card>
        ))
      )}
    </>
  );
};

export default EscrowList;
