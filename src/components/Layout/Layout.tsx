import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

interface Props {
  children?: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1, user-scalable=0"/>
        <link rel="icon" href="/public/favicon.ico"/>
      </Head>
      <Header/>
      <main className={styles.main}>{children}</main>
      <Footer/>
    </div>
  );
};
