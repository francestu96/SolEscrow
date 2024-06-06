import { SolflareWalletAdapter, PhantomWalletAdapter, TrustWalletAdapter, XDEFIWalletAdapter, WalletConnectWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ChakraProvider } from '@chakra-ui/react';
import { clusterApiUrl } from '@solana/web3.js';
import { extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import "../globals.css"

require('@solana/wallet-adapter-react-ui/styles.css');

const MyApp = ({ Component, pageProps }: AppProps) => {
    const config = {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    };
    
    const theme = extendTheme({ config, colors: { "main": "#FF001E" } });
    
    const network = process.env.NEXT_PUBLIC_APP_CHAIN === "mainnet-beta" ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            new WalletConnectWalletAdapter({network, options: { metadata: { name: "SolEscrow", description: "SolEscrow", url: "", icons: [] }}}),
            new XDEFIWalletAdapter()
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ChakraProvider resetCSS theme={theme}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Component {...pageProps} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ChakraProvider>
    );
};

export default MyApp;