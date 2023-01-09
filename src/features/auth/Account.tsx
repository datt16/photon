import { Container, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { supabase } from "../../utils/supabaseClient"

const Account = ({ session }: { session: any }) => {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  type UserProfile = {
    id: number
    username: string
    website: string
    // avatar_url: string
  }

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = await supabase.auth.getUser()
      const { data, error, status } = await supabase
        .from<string, UserProfile>("profiles")
        .select("username, website")
        .eq("id", user.data.user?.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        // setAvatarUrl(data.avatar_url)
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
  }, [session])

  return (
    <Container>
      <Text>{username}</Text>
    </Container>
  )
}

export default Account
