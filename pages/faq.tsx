import Default from 'src/templates/Default';
import FAQ from 'src/templates/FAQ';
import { NextPage } from 'next';

const FaqPage: NextPage = () => {

    return (
        <Default pageName="SolEscrow | F.A.Q.">
            <FAQ />
        </Default>
    );
};

export default FaqPage;