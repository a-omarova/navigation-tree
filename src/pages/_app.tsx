import { Layout } from '@/components/Layout/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ColorSchemeProvider } from '@/context/colorScheme.context'

export default function App({Component, pageProps}: AppProps) {
  return (
    <ColorSchemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorSchemeProvider>

  )
}
