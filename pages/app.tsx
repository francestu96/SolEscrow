import Default from 'templates/Default';
import type { NextPage } from 'next';
import App from 'templates/App';

const AppPage: NextPage = () => {
  return (
    <Default pageName="SolEscrow | APP">
      <App/>
    </Default>
  );
};

export default AppPage;