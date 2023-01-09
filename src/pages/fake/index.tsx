import { Button, Text } from "@chakra-ui/react"
import { ChangeEventHandler, useEffect, useState } from "react"
import Account from "../../features/auth/Account"
import Auth from "../../features/auth/Auth"

import useFileHandler from "../../features/experimental/hooks/useFileHandler"
import { supabase } from "../../utils/supabaseClient"

const Page = () => {
  const [session, setSession] = useState(null)
  useEffect(() => {
    setSession(supabase.auth.getSession())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <>{session ? <Auth /> : <Account session={session} />}</>
}

export default Page
