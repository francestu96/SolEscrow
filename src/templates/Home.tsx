import Tokenomics from 'elements/Tokenomics';
import { VStack } from '@chakra-ui/react';
import Roadmap from 'elements/Roadmap';
import About from 'elements/About';
import Hero from 'elements/Hero';
import Buy from 'elements/Buy';
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
