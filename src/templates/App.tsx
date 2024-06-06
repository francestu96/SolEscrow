import { Container, Tab, TabList, TabPanel, TabPanels, Tabs, chakra, shouldForwardProp, useColorModeValue } from '@chakra-ui/react';
import NoticeboardEscrows from 'src/elements/NoticeboardEscrows';
import { motion, isValidMotionProp} from 'framer-motion';
import Escrows from 'src/elements/Escrows';
import { FC } from 'react';

const App: FC = () => {
    const paymentsAnimation = { translateX: [400, 0], opacity: [0, 1] };

    const backgroundColor = useColorModeValue("gray.100", "gray.900");

    const ChakraBox = chakra(motion.div, {
        shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
    });
    return (
        <Container maxW="container.xl" minH="65vh" p="5" alignContent="center" justifyContent="center" flexWrap="wrap">
            <ChakraBox animate={paymentsAnimation} transition={{ duration: "1", ease: "easeOut" }}>
                <Tabs isFitted variant='enclosed'>
                    <TabList>
                        <Tab fontSize={["sm", "md"]} _selected={{ color: "main", borderColor: "inherit", borderBottomColor: backgroundColor, backgroundColor: backgroundColor }}>Your Payments</Tab>
                        <Tab fontSize={["sm", "md"]} _selected={{ color: "main", borderColor: "inherit", borderBottomColor: backgroundColor, backgroundColor: backgroundColor }}>Noticeboard</Tab>
                    </TabList>
                    <TabPanels borderWidth="thin" backgroundColor={backgroundColor} minH="60vh" borderRadius="0 0 0.375rem 0.375rem">
                        <TabPanel>
                            <Escrows />
                        </TabPanel>
                        <TabPanel>
                            <NoticeboardEscrows />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </ChakraBox>
        </Container>
    );
};
export default App;
