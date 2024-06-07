import React from 'react';
import { Box, Text, HStack, VStack, Flex, useBreakpointValue } from '@chakra-ui/react';

const milestones = [
    {
        id: 1,
        date: '2024, Q2',
        title: 'Sale Lab Creation',
        description: `Deployment of all suite components in the following order: Guarantee Fund, Token Locker, LP Locker and Launchpad.`
    },
    {
        id: 2,
        date: '2024, Q3',
        title: 'Payment Lab Creation',
        description: `Release of one of our most innovative services, and the creation of our Lock As Payment platform, which will grant access to all other services for free.`
    },
    {
        id: 3,
        date: '2024, Q4',
        title: 'Staking Lab Creation',
        description: 'Release of our application for creating staking of your token. Following the release, we will utilize our own application to enable staking of the $FOXAI token.'
    }
    ,
    {
        id: 4,
        date: '2025, Q1',
        title: 'Trading Bot',
        description: 'Release of our trading bot, both in standard and premium versions. The release will first be available as a web app and later extended as Telegram bot.'
    }
];

const Roadmap = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const isDesktop = useBreakpointValue({ base: false, md: true });

    return (
        <VStack width="full" id="roadmap" p="10" backgroundImage="/roadmap-bg.png" backgroundPosition="center" backgroundSize="cover" gap="0">
            <Text fontSize="4xl" fontFamily="Satoshi-Bold" mb={18} textAlign="center">Roadmap</Text>
            {
                milestones.map((milestone) => (
                    <Flex width="75%" key={milestone.id} mb="10px">
                        {isDesktop && milestone.id % 2 === 0 && (
                            <>
                                <EmptyCard />
                                <LineWithDot />
                                <Card {...milestone} />
                            </>
                        )}

                        {isMobile && (
                            <>
                                <LineWithDot />
                                <Card {...milestone} />
                            </>
                        )}

                        {/* Desktop view(right card) */}
                        {isDesktop && milestone.id % 2 !== 0 && (
                            <>
                                <Card {...milestone} />
                                <LineWithDot isLeft={true}/>
                                <EmptyCard />
                            </>
                        )}
                    </Flex>
                ))
            }
        </VStack>
    );
};

interface CardProps {
    id: number;
    title: string;
    description: string;
    date: string;
}

const Card = ({ id, title, description, date }: CardProps) => {
    const isEvenId = id % 2 == 0;
    let borderWidthValue = isEvenId ? '15px 15px 15px 0' : '15px 0 15px 15px';
    let leftValue = isEvenId ? '-15px' : 'unset';
    let rightValue = isEvenId ? 'unset' : '-15px';

    const isMobile = useBreakpointValue({ base: true, md: false });
    if (isMobile) {
        leftValue = '-15px';
        rightValue = 'unset';
        borderWidthValue = '15px 15px 15px 0';
    }

    return (
        <HStack
            borderWidth="thin"
            flex={1}
            p={{ base: 3, sm: 6 }}
            bg={'gray.800'}
            spacing={5}
            rounded="lg"
            alignItems="center"
            pos="relative"
            _before={{
                content: `""`,
                w: '0',
                h: '0',
                borderColor: `transparent rgb(132 95 239)`,
                borderStyle: 'solid',
                borderWidth: borderWidthValue,
                position: 'absolute',
                left: leftValue,
                right: rightValue,
                display: 'block'
            }}
            _hover={{ boxShadow: "0px 0px 25px 1px rgba(255,255,255,0.5);", cursor: "pointer"}}            
        >
            <Box>
                <Text fontSize="lg" color="main">
                    {date}
                </Text>

                <VStack spacing={2} mb={3} textAlign="left" color="white">
                    <Text fontSize="2xl" lineHeight={1.2} fontWeight="bold" w="100%">{title}</Text>
                    <Text fontSize="md">{description}</Text>
                </VStack>
            </Box>
        </HStack>
    );
};

const LineWithDot = ({isLeft}: any) => {
    return (
        <Flex pos="relative" alignItems="center" mr={{ base: isLeft ? "43px": "40px", md: isLeft ? "43px": "40px" }} ml={{ base: '0', md: '40px' }}>
            <Text as="span" position="absolute" left="45%" height="calc(100% + 10px)" border="1px solid" borderColor={'gray.700'} top="0px" mr="2px"></Text>
            <Box pos="relative" p="10px">
                <Box
                    pos="absolute"
                    top="0"
                    left="0"
                    bottom="0"
                    right="0"
                    width="100%"
                    height="100%"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center center"
                    bg={'main'}
                    borderRadius="100px"
                    backgroundImage="none"
                    opacity={1}
                ></Box>
            </Box>
        </Flex>
    );
};

const EmptyCard = () => {
    return <Box flex={{ base: 0, md: 1 }} p={{ base: 0, md: 6 }} bg="transparent"></Box>;
};

export default Roadmap;