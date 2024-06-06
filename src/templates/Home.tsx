import { VStack } from '@chakra-ui/react';
import About from 'elements/About';
import Buy from 'elements/Buy';
import Hero from 'elements/Hero';
import Roadmap from 'elements/Roadmap';
import Tokenomics from 'elements/Tokenomics';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <VStack gap="0">
      <Hero/>
      <About/>
      <Tokenomics/>
      <Buy/>
      <Roadmap/>
    </VStack>
  );
};

export default Home;
