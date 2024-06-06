import { Box, Card, CardBody, CardFooter, Button, CardHeader, HStack, Link, Spinner, Stack, Text, Tooltip, VStack, useColorMode, useToast } from "@chakra-ui/react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Escrow } from "../../target/types/escrow";
import { PiProhibitInset } from "react-icons/pi";
import { EscrowModel } from "utils/EscrowModel";
import { BN, Program } from "@coral-xyz/anchor";
import { FaEthereum } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Countdown from "react-countdown";
import { useState } from "react";

const EscrowList = ({ escrows, sent, approved, web3button, releaseButton, wallet, program }: { escrows: EscrowModel | null | undefined, sent: boolean, approved: boolean, web3button: boolean, releaseButton: boolean, wallet: AnchorWallet, program: Program<Escrow> }) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [refresh, setRefresh] = useState<boolean>(false);

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
              <VStack width="100%" alignItems="end">
                {sent && escrows.status[index] === 0 && releaseButton &&
                  (
                    <Button></Button>
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
                <HStack fontSize={["3xs", "2xs", "xs", "xs"]} py="2" width="100%" justifyContent={"space-between"}>
                  {/* <Link isExternal color="main" href={process.env.NEXT_PUBLIC_CHAIN_SCAN_URL + "/" + escrow.transactionHash}>
                    <ExternalLinkIcon style={{ color: colorMode == "dark" ? "white" : "black" }} mr="1" />
                    {escrow.transactionHash.substring(0, 26)}...
                  </Link> */}
                  <Text>
                    {new Date(escrows.timestamp[index].toNumber() * 1000).toLocaleDateString(undefined, { hour: "2-digit", minute: "2-digit", hourCycle: "h24" })}
                  </Text>
                </HStack>
              </VStack>
            </CardFooter>
          </Card>
        ))
      )}
    </>
  );
};

export default EscrowList;
