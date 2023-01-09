import { useSession } from "@supabase/auth-helpers-react"
import Account from "../../features/auth/Account"
import Auth from "../../features/auth/Auth"

const Page = () => {
  const session = useSession()
  console.log("session-user", session)

  return <>{!session ? <Auth /> : <Account session={session} />}</>
}

export default Page
