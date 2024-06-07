import { chakra, shouldForwardProp, Text, Container, VStack, Box } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';

const Hero = () => {
  const textAnimation = { translateY: [100, 0], opacity: [0, 1] }
  const transition = { duration: "1", ease: "easeInOut" }

  const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  })
  return (
    <Container maxWidth="unset" p="10" zIndex="-1" minH="88vh" display="flex" background="linear-gradient(0.1turn, #9945FF, #14F195);" backgroundSize="cover" justifyContent="center">
        <VStack width={["100%", "80%", "50%"]} justifyContent="center">
            <Box className="animated-hero" backgroundColor="gray.700" p="5" mb="5" borderRadius="3xl" fontFamily="Satoshi-Bold" w={["100%", "100%", "100%", "100%", "60%"]} position="relative">
                <Text textAlign="center" fontSize={["4xl", "6xl", "8xl"]} background="linear-gradient(to right, white, #5d93cf);" fill="transparent" backgroundClip="text">SolEscrow</Text>
            </Box>
            <ChakraBox animate={textAnimation} transition={transition} opacity="0" mb="10" mt={["5", "4", "2", "0"]}>
                <Text fontSize="2xl" color="rgb(23,25,35,0.8)" textAlign="center" fontFamily="Satoshi-Bold" mb="10">&quot;Powering Decentralization, Build Trust&quot;</Text>
                <Text fontSize="xl" color="rgb(23,25,35,0.8)" fontWeight="400" textAlign="center">SolEscrow the best ecosistem for decentralized economies: token sales, staking, token locking as payments, and a user-friendly token trading Bot. Join us and thrive in the decentralized world with SolEscrow</Text>
            </ChakraBox>
        </VStack>
    </Container>
  );
};

export default Hero;
