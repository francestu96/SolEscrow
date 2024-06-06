import Tokenomics from 'src/elements/Tokenomics';
import Roadmap from 'src/elements/Roadmap';
import { VStack } from '@chakra-ui/react';
import About from 'src/elements/About';
import Hero from 'src/elements/Hero';
import Buy from 'src/elements/Buy';
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
