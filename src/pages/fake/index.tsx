import { useSession } from "@supabase/auth-helpers-react"
import Account from "../../features/auth/Account"
import Auth from "../../features/auth/Auth"

const Page = () => {
  const session = useSession()

  return <>{!session ? <Auth /> : <Account />}</>
}

export default Page
