import { Box, Button, HStack, Heading, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, VStack, useColorMode, useToast } from '@chakra-ui/react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { FaRegFaceMehBlank } from 'react-icons/fa6';
import { AiOutlineSearch } from 'react-icons/ai';
import { EscrowModel } from 'utils/EscrowModel'
import EscrowList from 'elements/EscrowList';
import { PublicKey } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import { Program } from '@coral-xyz/anchor';
import { Escrow } from 'utils/escrow';
import idl from 'utils/escrow.json'; 
import { useState } from 'react';
import Filter from './Filter';

const NoticeboardEscrows = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { connection } = useConnection();
  const [inputAddress, setInputAddress] = useState<string>("");
  const [addressError, setAddressError] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeached, setHasSearched] = useState(false);
  const [sentMessages, setSentMessages] = useState<EscrowModel | null>();
  const [receivedMessages, setReceivedMessages] = useState<EscrowModel | null>();
  const [approvedMessages, setApprovedMessages] = useState<EscrowModel | null>();
  const [filteredReceivedMessages, setFilteredReceivedMessages] = useState<EscrowModel | null>();
  const [filteredSentMessages, setFilteredSentMessages] = useState<EscrowModel | null>();
  const [filteredApprovedMessages, setFilteredApprovedMessages] = useState<EscrowModel | null>();

  const wallet = useAnchorWallet();
  const provider = new anchor.AnchorProvider(connection, wallet!, {});
  const program = new Program<Escrow>(idl as Escrow, provider);

  const search = async () => {
    if(!inputAddress){
      setAddressError(true);
      toast({description: "Missing address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return;
    }
    if(!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/gm.test(inputAddress)){
      setAddressError(true);
      toast({description: "Invalid recipient address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    try{
      const [senderPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow_sent"), new PublicKey(inputAddress).toBuffer()],
        program.programId
      );
      const [receiverPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow_received"), new PublicKey(inputAddress).toBuffer()],
        program.programId
      );
      const [approverPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("escrow_approved"), new PublicKey(inputAddress).toBuffer()],
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
    catch (err: any){
      setIsLoading(false);
      toast({description: err.toString(), status: 'error', position: "top", isClosable: true, duration: 3000});
    }

  }
  
  return (
    <VStack width="full">
      <VStack width="inherit">
        <HStack width="inherit" justify="space-between">
          <InputGroup width="74%">
            <InputLeftElement pointerEvents='none'>
              <AiOutlineSearch/>
            </InputLeftElement>
            <Input value={inputAddress} onChange={(e) => {setAddressError(false); setInputAddress(e.target.value)}} placeholder="Find address escrows" borderColor={addressError ? "red" : undefined} backgroundColor={colorMode == "dark" ? "gray.800" : "white"}/>
          </InputGroup>
          <Button isLoading={isLoading} rightIcon={<AiOutlineSearch />} backgroundColor={"main"} w="24%" fontSize={["xs", "sm", "md", "md"]} onClick={search}>Search</Button>
        </HStack>
      </VStack>

      { hasSeached ? (
          <VStack mt="10" w="full">
            <Filter received={receivedMessages} sent={sentMessages} approved={approvedMessages} setFilteredReceived={setFilteredReceivedMessages} setFilteredSent={setFilteredSentMessages} setFilteredApproved={setFilteredApprovedMessages}/>

            <Tabs width="inherit">
              <TabList>
                <Tab _selected={{color: "main", borderColor: "main"}}>Received</Tab>
                <Tab _selected={{color: "main", borderColor: "main"}}>Sent</Tab>
                <Tab _selected={{color: "main", borderColor: "main"}}>Approved</Tab>
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
                      <EscrowList escrows={filteredReceivedMessages} sent={false} approved={false} web3button={false} releaseButton={false} wallet={wallet!} program={program}/>
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
                      <EscrowList escrows={filteredSentMessages} sent={true} approved={false} web3button={false} releaseButton={false} wallet={wallet} program={program}/>
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
                      <EscrowList escrows={filteredApprovedMessages} sent={false} approved={true} web3button={false} releaseButton={false} wallet={wallet} program={program}/>
                    )
                  }
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        ) : (
          <VStack gap="5" m="10">
            <Heading fontFamily="Satoshi-Bold" fontSize={["2xl", "3xl", "3xl", "3xl"]}>no search done yet</Heading>
            <FaRegFaceMehBlank size={70}/>
          </VStack>
        )
      }
    </VStack>    
  );
};

export default NoticeboardEscrows;

