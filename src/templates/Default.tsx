import { FC, ReactNode } from 'react';
import Head from 'next/head';
import Header from 'elements/Header';
import Footer from 'elements/Footer';

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
