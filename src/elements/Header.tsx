import { Box, Flex, HStack, IconButton, useColorModeValue, VStack, useDisclosure, Slide, Text } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import ColorModeButton from './ColorModeButton';
import AppConfig from '../../app.config';
import { ISubNav } from './SubNav';
import dynamic from 'next/dynamic';
import NavItem from './NavItem';
import React from 'react';
import Logo from './Logo';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const NAV_LINKS: ISubNav[] = [
  { label: "Home", href: "/" },
  { label: "App", href: "/app" },
  { label: "Buy", href: "/#buy" },
  {
    label: "About",
    href: "#",
    children: [
      {
        label: "Discover SolEscrow",
        subLabel: "What is SolEscrow",
        href: "/#about",
        logo: "/about.svg"
      },
      {
        label: "Tokenomics",
        subLabel: "Our token economics",
        href: "/#tokenomics",
        logo: "/tokenomics.svg"
      },
      {
        label: "Roadmap",
        subLabel: "Look at our future",
        href: "/#roadmap",
        logo: "/roadmap.svg"
      },
      {
        label: "F.A.Q.",
        subLabel: "frequently Asked Questions",
        href: "/faq",
        logo: "/faq.svg"
      },
      {
        label: "Whitepaper",
        subLabel: "Read our whitepaper",
        href_blank: "https://solescrow.gitbook.io",
        logo: "/whitepaper.svg"
      }
    ]
  },
  {
    label: "Community",
    href: "#",
    children: [
      {
        label: "Telegram",
        subLabel: "Follow us on Telegram",
        href_blank: AppConfig.telegramURL,
        logo: "/telegram.png",
      },
      {
        label: "Twitter",
        subLabel: "Follow us on Twitter",
        href_blank: AppConfig.twitterULR,
        logo: "/twitter.webp",
      }
    ]
  }
];

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box borderBottom="1px" borderBottomColor="chakra-border-color" py="5" px={["5", "10", "15", "20"]} bgColor={useColorModeValue('white', 'gray.900')}>
      <Flex align="center" justify="space-between" display={['none', 'none', 'flex','flex']}>
        <HStack gap="3">
          <Logo/>
          <Text fontSize="2xl" fontFamily="Satoshi-Bold">SolEscrow</Text>
        </HStack>
        <HStack gap={'15px'} position="absolute" left="50%" zIndex="10" transform="translate(-50%, 0%)">
          {NAV_LINKS.map((link) => (
            <NavItem key={`link-${link.label}`} {...link} />
          ))}
        </HStack>
        <HStack gap={'10px'}>
          <WalletMultiButtonDynamic style={{height: "2.5rem"}}/>
          <ColorModeButton />
        </HStack>
      </Flex>
      <Flex align="center" justify="space-between" display={['flex', 'flex', 'none','none']}>
        <HStack gap="3">
          <Logo/>
          <Text fontSize="xl" fontFamily="Satoshi-Bold">SolEscrow</Text>
        </HStack>
        <IconButton aria-label="Open Menu" size="lg" mr={2} icon={<HamburgerIcon/>} onClick={onToggle}/>
      </Flex>    

      <Slide in={isOpen} transition={{"enter": {duration: 0.5}, "exit": {duration: 0.5}}} style={{ zIndex: 10 }}>
        <Flex w='100vw' bgColor={useColorModeValue('white', 'gray.800')} h="100vh" flexDir="column">
          <Flex justify="flex-end">
          <IconButton mt={2} mr={2} aria-label="Open Menu" size="lg" icon={<CloseIcon/>}onClick={onToggle}/>
        </Flex>
          <VStack gap={'15px'}>
            <HStack gap={'10px'}>
              <WalletMultiButtonDynamic style={{height: "2.5rem"}}/>
              <ColorModeButton />
            </HStack>
            {NAV_LINKS.map((link) => (
              <NavItem key={`link-${link.label}`} {...link} />
            ))}
          </VStack>
        </Flex>   
      </Slide> 
    </Box>
  );
};

export default Header;
