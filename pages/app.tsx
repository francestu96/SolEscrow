import Default from 'src/templates/Default';
import type { NextPage } from 'next';
import App from 'src/templates/App';

const AppPage: NextPage = () => {
  return (
    <Default pageName="SolEscrow | APP">
      <App/>
    </Default>
  );
};

export default AppPage;