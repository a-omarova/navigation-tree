import Head from 'next/head'
import React, { Suspense, useEffect, useState } from 'react'
import { DataType } from '@/types'
import { NavigationBar } from '@/components/NavigationBar/NavigationBar'
import axios from 'axios'

export default function Home() {
  const [data, setData] = useState<DataType | null>(null)

  useEffect(() => {
    axios.get("http://localhost:3000/api/data")
      .then(function (response) {
        setTimeout(() => {
          setData(response.data)
        }, 5000)
      });

  }, [data])

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Example of navigation tree bar"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Suspense fallback={<h2>🌀 Loading...</h2>}>
        <NavigationBar data={data}/>
      </Suspense>
    </>
  )
}
