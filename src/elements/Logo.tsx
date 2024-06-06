import { LinkBox, LinkOverlay, useColorMode } from '@chakra-ui/react';
import Image from 'next/image';

const Logo = () => {
  return (
    <LinkBox>
      <LinkOverlay href="/">
        <Image src={"/logo.png"} height={60} width={60} alt="SolEscrow"/>
      </LinkOverlay>
    </LinkBox>
  );
};

export default Logo;
