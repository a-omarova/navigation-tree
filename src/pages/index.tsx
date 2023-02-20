import Head from 'next/head'
import React, { Suspense } from 'react'
import { NavBar } from '@/components/NavigationBar/NavBar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Example of navigation tree bar"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Suspense fallback={<h2>🌀 Loading...</h2>}>
        <NavBar />
      </Suspense>
    </>
  )
}
