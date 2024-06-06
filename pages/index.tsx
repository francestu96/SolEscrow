import Default from 'templates/Default';
import type { NextPage } from 'next';
import Home from 'templates/Home';

const HomePage: NextPage = () => {
  return (
    <Default pageName="SolEscrow | Home">
      <Home/>
    </Default>
  );
};

export default HomePage;