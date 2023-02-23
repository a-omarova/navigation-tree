import React, { ReactNode } from 'react'
import Head from 'next/head'
import { Header } from '../Header/Header'
import styles from './Layout.module.css'
import { StoreProvider } from '@/context/store.context'

interface Props {
  children?: ReactNode;
}

export const Layout: React.FC<Props> = ({children}) => {
  return (
    <div className={styles.layout}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1, user-scalable=0"/>
        <link rel="icon" href="/public/favicon.ico"/>
      </Head>
      <Header/>
      <StoreProvider>
        <main className={styles.main}>{children}</main>
      </StoreProvider>
    </div>
  )
}
