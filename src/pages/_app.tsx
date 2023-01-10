import "../styles/globals.css"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react"
import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import Head from "next/head"
import { useState } from "react"
import { Database } from "../types/db/schema"
import { useUserStore } from "../libs/UserStore"

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
}

const theme = extendTheme({ colors })

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  )

  const { handleLogin, handleLogout } = useUserStore()

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) {
      handleLogin(session.user.id)
    } else {
      handleLogout()
    }
  })

  return (
    <div>
      <Head>
        <title>Project Photon</title>
      </Head>
      <RecoilRoot>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </SessionContextProvider>
      </RecoilRoot>
    </div>
  )
}

export default MyApp
