import { Button, Container, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react"

const Account = ({ session }: { session: Session }) => {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = await supabase.auth.getUser()
      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", user.data.user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <Container>
      {!loading ? (
        <>
          <Text>{username}</Text>
          <Text>{website}</Text>
          <Text>{avatar_url}</Text>
          <Button onClick={() => supabase.auth.signOut()}>ログアウト</Button>
        </>
      ) : (
        <>loading...</>
      )}
    </Container>
  )
}

export default Account
