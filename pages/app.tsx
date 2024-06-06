import type { NextPage } from 'next';
import App from 'templates/App';
import Default from 'templates/Default';

const AppPage: NextPage = () => {
  return (
    <Default pageName="SolEscrow | APP">
      <App/>
    </Default>
  );
};

export default AppPage;