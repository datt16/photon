import "../styles/globals.css"
import { ChakraProvider, type ThemeConfig } from "@chakra-ui/react"

// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react"
import type { AppProps } from "next/app"

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
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
