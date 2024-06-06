import { NextPage } from 'next';
import Default from 'templates/Default';
import FAQ from 'templates/FAQ';

const FaqPage: NextPage = () => {

    return (
        <Default pageName="SolEscrow | F.A.Q.">
            <FAQ />
        </Default>
    );
};

export default FaqPage;