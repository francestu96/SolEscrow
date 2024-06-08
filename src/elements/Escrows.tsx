import { Box, HStack, Input, InputGroup, InputLeftElement, VStack, Image, Heading, useColorMode, Tooltip, Tab, TabList, TabPanel, TabPanels, Tabs, Textarea, useToast, InputRightElement, Link, Button } from '@chakra-ui/react';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { EscrowModel } from 'utils/EscrowModel'
import { FaRegAddressBook } from 'react-icons/fa';
import { BsCurrencyDollar } from 'react-icons/bs';
import { MdContactless } from 'react-icons/md';
import { useEffect, useState } from 'react';
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { MdPercent } from "react-icons/md";
import EscrowList from './EscrowList';
import { Escrow } from 'utils/escrow';
import idl from 'utils/escrow.json'; 
import Filter from './Filter';

const Escrows = () => {
  const toast = useToast();
  const { connection } = useConnection();
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [sentMessages, setSentMessages] = useState<EscrowModel | null>();
  const [receivedMessages, setReceivedMessages] = useState<EscrowModel | null>();
  const [approvedMessages, setApprovedMessages] = useState<EscrowModel | null>();
  const [filteredReceivedMessages, setFilteredReceivedMessages] = useState<EscrowModel | null | undefined>();
  const [filteredSentMessages, setFilteredSentMessages] = useState<EscrowModel | null>();
  const [filteredApprovedMessages, setFilteredApprovedMessages] = useState<EscrowModel | null>();
  const [inputAmount, setInputAmount] = useState<number>();
  const [feeAmount, setFeeAmount] = useState<number>(1);
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [approverAddress, setApproverAddress] = useState<string>(process.env.NEXT_PUBLIC_APPROVER_ADDRESS || "");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [receiverAddressError, setReceiverAddressError] = useState<boolean>();
  const [approverAddressError, setApproverAddressError] = useState<boolean>();
  const [messageError, setMessageError] = useState<boolean>();

  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet!, {});
  const program = new Program<Escrow>(idl as Escrow, provider);

  const refreshEscrows = async () => {
    const [senderPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_sent"), wallet!.publicKey.toBuffer()],
      program.programId
    );
    const [receiverPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_received"), wallet!.publicKey.toBuffer()],
      program.programId
    );
    const [approverPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_approved"), wallet!.publicKey.toBuffer()],
      program.programId
    );

    const sent = await program.account.senderAccount.fetchNullable(senderPDA);
    const received = await program.account.receiverAccount.fetchNullable(receiverPDA);
    const approved = await program.account.approverAccount.fetchNullable(approverPDA);

    setSentMessages(sent);
    setReceivedMessages(received);
    setApprovedMessages(approved);
    setFilteredSentMessages(sent);
    setFilteredReceivedMessages(received);
    setFilteredApprovedMessages(approved);

    setIsLoading(false);
  }

  useEffect(() => {
    if (wallet) {
      refreshEscrows();
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const verifyInputs = () => {
    if(!inputAmount){
      toast({description: "Missing amount", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(!receiverAddress){
      setReceiverAddressError(true);
      toast({description: "Missing address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(receiverAddress.toLowerCase() == wallet?.publicKey.toString().toLowerCase()){
      setReceiverAddressError(true);
      toast({description: "Cannot enter your own address!", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(!approverAddress){
      setApproverAddressError(true);
      toast({description: "Missing address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(!inputMessage){
      setMessageError(true);
      toast({description: "Missing message", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/gm.test(receiverAddress)){
      setReceiverAddressError(true);
      toast({description: "Invalid recipient address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }
    if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/gm.test(approverAddress)){
      setApproverAddressError(true);
      toast({description: "Invalid recipient address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return false;
    }

    return true;
  }

  const createEscrow = async () => {
    if(verifyInputs()){
      setIsButtonLoading(true);

      try{
        const tx = await program.methods
          .createEscrow(new anchor.BN(inputAmount! * 10**9), feeAmount, inputMessage)
          .accounts({ sender: wallet!.publicKey, receiver: new PublicKey(receiverAddress), approver: new PublicKey(approverAddress) })
          .transaction();

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = wallet!.publicKey;

        const signedTx = await wallet!.signTransaction(tx);
        const txId = await connection.sendRawTransaction(signedTx.serialize());
        
        await connection.confirmTransaction({
          blockhash: blockhash, 
          lastValidBlockHeight: lastValidBlockHeight,
          signature: txId
        });

        toast({description: "Transaction success", status: 'success', position: "bottom-right", isClosable: true, duration: 3000});

        setIsButtonLoading(false);
        setIsLoading(true);
        await refreshEscrows();
      }
      catch (err: any){
        setIsButtonLoading(false);
        if(!err.message.includes("User rejected the request")){
          console.log(err);
          toast({description: "Transaction rejected, check your SOL balance and retry", status: 'error', position: "bottom-right", isClosable: true, duration: 3000});
        }
        else{
          toast({description: "Transaction refused by the user", status: 'error', position: "bottom-right", isClosable: true, duration: 3000});
        }
      }
    }
  }

  return (
    <Box textAlign="center" marginBottom={6}>
      { wallet ? (  
          <VStack width="full">
            <VStack width="inherit" mb="10">
              <HStack width="inherit" justify="space-between">
                <HStack width="49.7%">
                    <InputGroup width="85%">
                        <InputLeftElement pointerEvents='none'>
                            <BsCurrencyDollar/>
                        </InputLeftElement>
                        <Input value={inputAmount} onChange={(e) => setInputAmount(parseFloat(e.target.value))} placeholder="ETH to send" type="number" backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
                    </InputGroup>
                    <Tooltip label="Approver fee" hasArrow placement="top">
                        <InputGroup width="15%">
                            <InputLeftElement pointerEvents='none'>
                                <MdPercent/>
                            </InputLeftElement>
                            <Input value={feeAmount} onChange={(e) => setFeeAmount(parseFloat(e.target.value))} placeholder="Fee" type="number" backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
                        </InputGroup>
                    </Tooltip>
                </HStack>
                <Button isLoading={isButtonLoading} onClick={createEscrow} leftIcon={<MdContactless size="28"/>} style={{width: "20%", fontSize: "lg", maxHeight: "2.5rem", color: colorMode == "dark" ? "#171923" : "white", backgroundColor: colorMode == "dark" ? "white" : "#171923"}}>
                  Pay
                </Button>
              </HStack>
              <HStack w="full">
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <FaRegAddressBook/>
                    </InputLeftElement>
                    <Input value={receiverAddress} onChange={(e) => {setReceiverAddressError(false); setReceiverAddress(e.target.value)}} placeholder="Receiver address" borderColor={receiverAddressError ? "red" : undefined} backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
                </InputGroup>
                <Tooltip label="Default SolEscrow approve team address" hasArrow>
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <FaRegAddressBook/>
                        </InputLeftElement>
                        <Input value={approverAddress} onChange={(e) => {setApproverAddressError(false); setApproverAddress(e.target.value)}} placeholder="Approver address" borderColor={approverAddressError ? "red" : undefined} backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
                        <InputRightElement>
                            <Link target="_blank" href="/faq#certifier_info">
                                <AiOutlineQuestionCircle/>
                            </Link>
                        </InputRightElement>
                    </InputGroup>
                </Tooltip>
              </HStack>
              <Textarea value={inputMessage} onChange={(e) => {setMessageError(false); setInputMessage(e.target.value)}} placeholder="Payment conditions to be verfied..." borderColor={messageError ? "red" : undefined} backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
            </VStack>

            <Filter received={receivedMessages} sent={sentMessages} approved={approvedMessages} setFilteredReceived={setFilteredReceivedMessages} setFilteredSent={setFilteredSentMessages} setFilteredApproved={setFilteredApprovedMessages}/>
            <Tabs width="inherit">
              <TabList>
                <Tab _selected={{color: "main", borderColor: "main"}}>Received</Tab>
                <Tab _selected={{color: "main", borderColor: "main"}}>Sent</Tab>
                {
                    filteredApprovedMessages && (
                        <Tab _selected={{color: "main", borderColor: "main"}}>Approve</Tab>
                    )
                }
              </TabList>
              <TabPanels>
                <TabPanel>
                  {
                    isLoading ? (
                      <Box animation="pulse 2s infinite">
                        {Array.from({ length: 12 }, (_, i) => (
                          <Box width="100%" height="200px" backgroundColor="gray.700" rounded="xl" mt="5" key={i}>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <EscrowList escrows={filteredReceivedMessages} sent={false} approved={false} web3button={false} releaseButton={false} wallet={wallet} program={program}/>
                    )
                  }
                </TabPanel>
                <TabPanel>
                  {
                    isLoading ? (
                      <Box animation="pulse 2s infinite">
                        {Array.from({ length: 12 }, (_, i) => (
                          <Box width="100%" height="200px" backgroundColor="gray.700" rounded="xl" mt="5" key={i}>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <EscrowList escrows={filteredSentMessages} sent={true} approved={false} web3button={false} releaseButton={true} wallet={wallet} program={program}/>
                    )
                  }
                </TabPanel>
                {
                    filteredApprovedMessages && (
                        <TabPanel>
                            {
                                isLoading ? (
                                <Box animation="pulse 2s infinite">
                                    {Array.from({ length: 12 }, (_, i) => (
                                    <Box width="100%" height="200px" backgroundColor="gray.700" rounded="xl" mt="5" key={i}>
                                    </Box>
                                    ))}
                                </Box>
                                ) : (
                                <EscrowList escrows={filteredApprovedMessages || []} sent={false} approved={true} web3button={true} releaseButton={false} wallet={wallet!} program={program}/>
                                )
                            }
                        </TabPanel>
                    )
                }
              </TabPanels>
            </Tabs>
          </VStack>    
        ) : ( 
          <VStack gap="10" p="10">
            <Heading fontFamily="Satoshi-Bold">Connect your Wallet</Heading>
            <Image src={ "connect-" + colorMode + ".gif" } width="50px" alt="connect"/>
          </VStack>
        )
      }
    </Box>
  );
};

export default Escrows;
