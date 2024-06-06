import { Flex, Stack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import AppConfig from '../../app.config'

const Buy = () => {
    const frameH = useBreakpointValue({
        base: "100vh",
        md: "80vh",
        lg: "100%"
    });

    return (
        <VStack id="buy" width="full" backgroundColor="gray.900">
            <Text fontSize="4xl" fontFamily="Satoshi-Bold" px="10" pt="10">Buy & Chart</Text>
            {
                AppConfig.tokenAddress ? (
                    <Stack width="full" pb="10" direction={["column", "row"]} px={["0", "5", "10", "20"]}>
                        <Flex flex="20" height="80vh" alignItems={"center"}>
                            <iframe src={"https://app.uniswap.org/#/swap?theme=dark&inputCurrency=ETH&exactField=input&exactAmount=1&outputCurrency=" + AppConfig.tokenAddress} style={{ "width": "100%", "height": frameH, "borderRadius": "0.75rem" }} />
                        </Flex>
                        <Flex flex="70" width="full" height="80vh" borderRadius={"xl"} transform={"translateZ(0px)"} overflow={"hidden"}>
                            <iframe src={"https://dexscreener.com/ethereum/" + AppConfig.tokenAddress + "?embed=1&theme=dark&trades=0"} style={{ "width": "100%", "height": "inherit" }}></iframe>
                        </Flex>
                    </Stack>
                ) : (
                    <VStack width="100%">
                        <Text fontSize="xl" color="gray">(waiting for the launch)</Text>
                        <Stack width="full" pb="10" direction={["column", "row"]} px={["0", "5", "10", "20"]}>
                            <Flex flex="70" width="full" height="80vh" borderRadius={"xl"} transform={"translateZ(0px)"} overflow={"hidden"}>
                                <iframe src="https://dexscreener.com/ethereum?embed=1&theme=dark" style={{ "width": "100%", "height": "inherit" }}></iframe>
                            </Flex>
                        </Stack>
                    </VStack>
                )
            }
        </VStack>
    );
};

export default Buy;