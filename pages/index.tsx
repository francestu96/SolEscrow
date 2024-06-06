import Default from 'src/templates/Default';
import Home from 'src/templates/Home';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Default pageName="SolEscrow | Home">
      <Home/>
    </Default>
  );
};

export default HomePage;