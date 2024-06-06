import { Box, Button, HStack, Heading, Input, InputGroup, InputLeftElement, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, VStack, useColorMode, useToast } from '@chakra-ui/react';
import { AiOutlineSearch } from 'react-icons/ai';
import EscrowList from 'elements/EscrowList';
import { useState } from 'react';
import { FaRegFaceMehBlank } from 'react-icons/fa6';
import { EscrowModel } from 'utils/EscrowModel'
import Filter from './Filter';
import { getEscrowTxs } from 'utils/getEscrowTxs';

const NoticeboardEscrows = () => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [inputAddress, setInputAddress] = useState<string>("");
  const [addressError, setAddressError] = useState<boolean>();
  const [certifyMessages, setCertifyMessages] = useState<EscrowModel[]>();
  const [filteredCertifyMessages, setFilteredCertifyMessages] = useState<EscrowModel[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeached, setHasSearched] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<EscrowModel[]>();
  const [sentMessages, setSentMessages] = useState<EscrowModel[]>();
  const [filteredReceivedMessages, setFilteredReceivedMessages] = useState<EscrowModel[]>();
  const [filteredSentMessages, setFilteredSentMessages] = useState<EscrowModel[]>();

  const search = async () => {
    if(!inputAddress){
      setAddressError(true);
      toast({description: "Missing address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return;
    }
    if(!/^0x[a-fA-F0-9]{40}$/gm.test(inputAddress)){
      setAddressError(true);
      toast({description: "Invalid recipient address", status: 'error', position: "top", isClosable: true, duration: 3000})
      return;
    }

    setHasSearched(true)
    setIsLoading(true);
    try{
      const escrows = await getEscrowTxs(inputAddress);
      
      let received = escrows.filter((x: EscrowModel) => x.data && parseInt(x.topics[2]) == parseInt(inputAddress));
      let sent = escrows.filter((x: EscrowModel) => x.data && parseInt(x.topics[1]) == parseInt(inputAddress));
      let certify = escrows.filter((x: EscrowModel) => x.data && parseInt(x.topics[3]) == parseInt(inputAddress));

      setReceivedMessages(received);
      setSentMessages(sent);
      setCertifyMessages(certify);
      setFilteredReceivedMessages(received);
      setFilteredSentMessages(sent);
      setFilteredCertifyMessages(certify);
      
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
          <Button rightIcon={<AiOutlineSearch />} backgroundColor={"main"} w="24%" fontSize={["xs", "sm", "md", "md"]} onClick={search}>Search</Button>
        </HStack>
      </VStack>

      { hasSeached ? (
          <VStack mt="10" w="full">
            <Filter received={receivedMessages || []} sent={sentMessages || []} certify={certifyMessages || []} setFilteredReceived={setFilteredReceivedMessages} setFilteredSent={setFilteredSentMessages} setFilteredCertify={setFilteredCertifyMessages}/>

            <Tabs width="inherit">
              <TabList>
                <Tab _selected={{color: "main", borderColor: "main"}}>Received</Tab>
                <Tab _selected={{color: "main", borderColor: "main"}}>Sent</Tab>
                <Tab _selected={{color: "main", borderColor: "main"}}>Certify</Tab>
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
                      <EscrowList escrows={filteredReceivedMessages || []} sent={false} web3button={false} releaseButton={false}/>
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
                      <EscrowList escrows={filteredSentMessages || []} sent={true} web3button={false} releaseButton={false}/>
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
                      <EscrowList escrows={filteredCertifyMessages || []} sent={false} web3button={false} releaseButton={false}/>
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

