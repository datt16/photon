import { Button, Container, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useUserStore } from "../../libs/UserStore"

const Account = () => {
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(true)
  const { uid, userName, avatarImageUrl } = useUserStore()

  useEffect(() => {
    if (uid) setLoading(false)
  }, [uid])

  return (
    <Container>
      {!loading ? (
        <>
          <Text>{uid}</Text>
          <Text>{userName}</Text>
          <Text>{avatarImageUrl}</Text>
          <Button onClick={() => supabase.auth.signOut()}>ログアウト</Button>
        </>
      ) : (
        <>読み込み中</>
      )}
    </Container>
  )
}

export default Account
