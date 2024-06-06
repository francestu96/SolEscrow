import { chakra, shouldForwardProp, VStack,Text, Image, Heading, Center, Stack, Box, AspectRatio, List, ListIcon, ListItem, useColorModeValue, Link, useColorMode, SimpleGrid, HStack } from '@chakra-ui/react';
import { motion, isValidMotionProp, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import CountUp from 'react-countup';
import { GoDotFill } from "react-icons/go";
import AppConfig from '../../app.config'

const Tokenomics = () => {
  const ref = useRef(null);
  const { colorMode } = useColorMode();
  const color = useColorModeValue('gray.700', 'gray.400');
  const isInView = useInView(ref, { once: true });
  const textAnimation = { translateY: [100, 0], opacity: [0, 1] };

  const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });
  return (
    <Center width="full" id="tokenomics" p="10" backgroundImage="/roadmap-bg.png" backgroundPosition="center" backgroundSize="cover">
        <VStack maxW="container.xl">
            <Heading fontFamily="Satoshi-Bold">
                <Text color="main" as="span">SolEscrow</Text> Tokenomics
            </Heading>
            <Stack ref={ref} direction={["column", "row"]} alignItems="center" gap="20" >
                <SimpleGrid columns={2}>
                    <ChakraBox animate={isInView ? { translateX: [-200, 0], opacity: [0, 1] } : 'none'} transition={{ duration: "1.5", ease: "easeInOut", delay: "0.5" }} opacity="0">
                        <VStack borderBottom="1px solid #FF001E" borderRight="1px solid #FF001E" pr="10" pb="10">
                            <Text fontFamily="Satoshi-bold" color="main" fontSize={["2xl", "4xl"]}><CountUp useEasing={false} end={100} duration={5} start={50} suffix=" M"/></Text>
                            <Text color="gray.500" fontWeight="bold" fontSize="lg">Supply</Text>
                        </VStack>
                    </ChakraBox>
                    <ChakraBox animate={isInView ? { translateX: [-200, 0], opacity: [0, 1] } : 'none'} transition={{ duration: "1.5", ease: "easeInOut" }} opacity="0">
                        <VStack borderBottom="1px solid #FF001E" pl="10" pb="10">
                            <Text fontFamily="Satoshi-bold" color="main" fontSize={["2xl", "4xl"]}>Locked</Text>
                            <Text color="gray.500" fontWeight="bold" fontSize="lg">Liquidity</Text>
                        </VStack>
                    </ChakraBox>
                    <ChakraBox animate={isInView ? { translateX: [-200, 0], opacity: [0, 1] } : 'none'} transition={{ duration: "1.5", ease: "easeInOut", delay: "0.6"}} opacity="0">
                        <VStack borderRight="1px solid #FF001E" pr="10" pt="10">
                            <Text fontFamily="Satoshi-bold" color="main" fontSize={["2xl", "4xl"]}>Renounced</Text>
                            <Text color="gray.500" fontWeight="bold" fontSize="lg">Contract Ownership</Text>
                        </VStack>
                    </ChakraBox>
                    <ChakraBox animate={isInView ? { translateX: [-200, 0], opacity: [0, 1] } : 'none'} transition={{ duration: "1.5", ease: "easeInOut", delay: "0.8" }} opacity="0">
                        <VStack pl="10" pt="10">
                            <Text fontFamily="Satoshi-bold" color="main" fontSize={["2xl", "4xl"]}>5/5</Text>
                            <Text color="gray.500" fontWeight="bold" fontSize="lg">Fees</Text>
                        </VStack>
                    </ChakraBox>
                </SimpleGrid>
                <VStack width={["100%", "100%", "100%", "50%"]} gap="5" alignItems="start">
                    <ChakraBox animate={isInView ? textAnimation : 'none' } transition={{ duration: "1", ease: "easeInOut" }} opacity="0" p={["0", "3", "7", "10"]}>
                        <Text fontSize="xl" fontWeight="bold" mb="4">$FOXAI will have tax aimed at fostering continuous development and effective marketing to ensure the project&apos;s growth and success.</Text>
                        <Text fontSize="xl" mb="4" color={color}>The taxes will be allocated as follow:</Text>
                        <List spacing={3} mb="4" color={color} fontSize={"xl"}>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color="main" />
                                <Text as="span" fontWeight="bold" color={colorMode == "dark" ? "white" : "black"}>Marketing (3%):</Text> This portion of the transaction tax is directed towards ongoing marketing efforts, crucial for building awareness and driving adoption of the SolEscrow ecosystem .
                            </ListItem>
                            <ListItem>
                                <ListIcon as={MdCheckCircle} color="main" />
                                <Text as="span" fontWeight="bold" color={colorMode == "dark" ? "white" : "black"}>Future Developments (2%):</Text> The remaining tax is allocated to funding the development of all platform functionalities, as well as ongoing updates to remain at the forefront of the decentralized sector, establishing itself as a key development hub.
                            </ListItem>
                        </List>
                        <Text fontSize={["xs", "md", "lg", "xl"]} textAlign={"center"} color="white" fontWeight="bold">CA: {AppConfig.tokenAddress ? AppConfig.tokenAddress : "coming-soon!"}</Text>
                    </ChakraBox>
                </VStack>
            </Stack>
            <Stack mt="4" justifyContent="space-around" width="full" direction={["column", "row"]}>
                <Link href={"https://dexscreener.com/ethereum/" + (AppConfig.tokenAddress ? AppConfig.tokenAddress : "coming-soon!")} target="_blank">
                    <Image src={"/DEXScreener.png"} height={14} width={48} alt="DEXScreener logo"/>
                </Link>
                <Link href={"https://www.dextools.io/app/en/ether/pair-explorer/" + (AppConfig.tokenAddress ? AppConfig.tokenAddress : "coming-soon!")} target="_blank" display="flex" flexWrap="wrap" justifyContent="center">
                    <Image src={colorMode == "dark" ? "/DEXTools_dark.png" : "/DEXTools_light.png"} height={10} width={40} alt="DexTools logo"/>
                </Link>
                <Link href={"https://birdeye.so/token/" + (AppConfig.tokenAddress ? AppConfig.tokenAddress : "coming-soon!") + "?chain=ethereum"} target="_blank" display="flex" flexWrap="wrap" justifyContent="end">
                    <Image src={"/BirdEye.png"} height={10} width={40} alt="BirdEye logo"/>
                </Link>
            </Stack>
            <VStack maxW="container.xl" mt="10">
                <Heading size="lg" fontFamily="Satoshi-Bold" mb="5">
                    Fees Allocation Breakdown
                </Heading>
                <Image src={"/pie.png"} width={["70%", "50%", "30%"]} alt="Pie"/>
                <Stack direction={["column", "row"]} alignItems="start" gap="10">
                    <VStack width={["100%", "100%", "100%", "25%"]} alignItems="start">
                        <HStack color="main">
                            <GoDotFill size="36"/>
                            <Heading size="md">70%</Heading>
                        </HStack>
                        <Heading size="md" fontFamily="Satoshi-Bold" color={colorMode == "dark" ? "white" : "black"}>Liquidity Pool</Heading>
                        <Text>The lion&apos;s share of the supply, ensuring robust liquidity in the market and fostering a healthy trading environment for <Text as="span" fontWeight="bold">$FOXAI</Text>.</Text>
                    </VStack>
                    <VStack width={["100%", "100%", "100%", "25%"]} alignItems="start">
                        <HStack color="main">
                            <GoDotFill size="36"/>
                            <Heading size="md">20%</Heading>
                        </HStack>
                        <Heading size="md" fontFamily="Satoshi-Bold" color={colorMode == "dark" ? "white" : "black"}>Staking Pool</Heading>
                        <Text>Dedicated to ensuring funds for staking rewards, which will be available through our platform, these funds will be sufficient to cover a period of 5 years of returns.</Text>
                    </VStack>
                    <VStack width={["100%", "100%", "100%", "25%"]} alignItems="start">
                        <HStack color="main">
                            <GoDotFill size="36"/>
                            <Heading size="md">5%</Heading>
                        </HStack>
                        <Heading size="md" fontFamily="Satoshi-Bold" color={colorMode == "dark" ? "white" : "black"}>KOLs and Marketing</Heading>
                        <Text>Allocated for strategic partnerships with Key Opinion Leaders and comprehensive marketing initiatives to boost the platform&apos;s visibility and adoption.</Text>
                    </VStack>
                    <VStack width={["100%", "100%", "100%", "25%"]} alignItems="start">
                        <HStack color="main">
                            <GoDotFill size="36"/>
                            <Heading size="md">5%</Heading>
                        </HStack>
                        <Heading size="md" fontFamily="Satoshi-Bold" color={colorMode == "dark" ? "white" : "black"}>Team and Development</Heading>
                        <Text>Reserved to support the core team and future advancements of the <Text as="span" fontWeight="bold">$FOXAI</Text> platform, this allocation funds innovation, platform enhancements, and operational needs.</Text>
                    </VStack>
                </Stack>
            </VStack>
        </VStack>
    </Center>
  );
};

export default Tokenomics;