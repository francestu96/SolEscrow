import { chakra, shouldForwardProp, VStack,Text, Image, Heading, Center, Stack, Button, Link } from '@chakra-ui/react';
import { motion, isValidMotionProp, useInView } from 'framer-motion';
import { useRef } from 'react';
import dynamic from "next/dynamic";
import { FaBookOpen } from "react-icons/fa";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const textAnimation = { translateY: [100, 0], opacity: [0, 1] };
  const logoAnimation = { opacity: [0, 1], filter: ["blur(12px)", "blur(0px)"] };

  const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
  });
  return (
    <Center backgroundColor="gray.900" minH="90vh" width="full" id="about" p="10">
      <VStack width="80%">
        <Heading fontFamily="Satoshi-Bold" color="white">
          Something about <Text color="main" as="span">SolEscrow</Text>
        </Heading>
        <Stack ref={ref} direction={["column", "column", "column", "row"]} px={["0", "3", "7", "10"]} gap={["10", "10", "10", "0"]}>
          <VStack width={["100%", "100%", "100%", "50%"]} gap="5" alignItems="start">
            <ChakraBox animate={isInView ? textAnimation : 'none' } transition={{ duration: "1", ease: "easeInOut" }} opacity="0" p={["0", "3", "7", "10"]}>
                <Text fontSize="xl" color="gray.400" mb="4"><Text as="span" fontWeight="bold" color="white">SolEscrow</Text> is the result of dedicated teamwork driven by passion and the goal of creating an ecosystem that encompasses key services for the development of decentralized economies. We offer <Text as="span" fontWeight="bold" color="white">tools designed to facilitate the sale of decentralized tokens</Text>, aiming to establish a complex network of services accessible through token purchases.</Text>
                <Text fontSize="xl" color="gray.400" mb="4">Furthermore, we provide services usable by existing tokens. Our <Text as="span" fontWeight="bold" color="white">StakingLab</Text> allows building a staking platform, while <Text as="span" fontWeight="bold" color="white">PaymentLab</Text> allows the creation of a service payment platform through token locking.</Text>
                <Text fontSize="xl" color="gray.400" mb="8">Finally, we offer a tool for <Text as="span" fontWeight="bold" color="white">trading tokens</Text> present on the market, equipped with powerful features and supported by <Text as="span" fontWeight="bold" color="white">AI</Text>. All our services are accessible at competitive prices, also thanks to the fact that we ourselves will use our tools. Therefore, all services offered by <Text as="span" fontWeight="bold" color="white">SolEscrow</Text> can be paid for using the token locking formula, without the need to spend any tokens but simply <Text as="span" fontWeight="bold" color="white">by locking them</Text> for a certain period of time.</Text>
                <Center>
                    <Link target="_blank" href="https://solescrow.gitbook.io">
                        <Button backgroundColor="main" leftIcon={<FaBookOpen />}>Read our Whitepaper</Button>
                    </Link>
                </Center>
            </ChakraBox>
          </VStack>
          <ChakraBox width={["100%", "100%", "100%", "50%"]} display="flex" justifyContent="center" alignContent="center" flexWrap="wrap" animate={isInView ? logoAnimation : 'none' } transition={{ duration: "2", ease: "easeInOut" }} opacity="0">
            <Image src="/tokenomics_img.svg" p={["0", "5", "10", "20"]} alt="SolEscrow" objectFit="contain"/>
          </ChakraBox>
        </Stack>
      </VStack>
    </Center>
  );
};

export default About;