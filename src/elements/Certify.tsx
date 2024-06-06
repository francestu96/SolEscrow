import { Box, Heading, Image, VStack, useColorMode } from '@chakra-ui/react';
import { GiRocketFlight } from 'react-icons/gi';

const Certify = () => {
//   const address = useAddress();
  const address = false;
  const { colorMode } = useColorMode();
  
  return (
    <Box textAlign="center" marginBottom={6}>
      { address ? (  
        <VStack gap="5" m="10">
          <Heading fontFamily="Satoshi-Bold" fontSize={["2xl", "3xl", "3xl", "3xl"]}>Cooming soon! Stay tuned</Heading>
          <GiRocketFlight size={70}/>
        </VStack>
        ) : ( 
          <VStack gap="10" p="10">
            <Heading fontFamily="Satoshi-Bold">Connect your Wallet</Heading>
            <Image src={ "connect-" + colorMode + ".gif" } width="50px" alt="connect"/>
          </VStack>
        )
      }
    </Box>
  )
};

export default Certify;

