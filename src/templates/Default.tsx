import Header from 'src/elements/Header';
import Footer from 'src/elements/Footer';
import { FC, ReactNode } from 'react';
import Head from 'next/head';

const Default: FC<{ children: ReactNode; pageName: string }> = ({ children, pageName }) => (
  <>
    <Head>
      <title>{`${pageName}`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header/>
      {children}
    <Footer/>
  </>
);

export default Default;
