import "../styles/globals.css"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import Head from "next/head"

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Project Photon</title>
      </Head>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </div>
  )
}

export default MyApp
