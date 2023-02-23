import Head from 'next/head'
import React from 'react'
import { NavBar } from '@/components/NavBar/NavBar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Example of navigation tree bar"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <h1 className="visually-hidden">Navigation tree bar </h1>
      <NavBar/>
    </>
  )
}
