import { Button, Container, FormControl, Input, Text } from "@chakra-ui/react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"

const Auth = () => {
  const client = useSupabaseClient()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await client.auth.signInWithOtp({ email })
      if (error) throw error
      alert("マジックリンクを送付しました！メールボックスを確認してください！")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // alert(error.err_description || error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Container>
        <Text fontSize={"x-large"}>ログイン</Text>
        <Text fontSize={"medium"}>
          入力したメールアドレスにマジックリンクを送付してログインします。
        </Text>
        <FormControl>
          <Input
            type={"email"}
            required
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            disabled={loading}
          >
            <span>{loading ? "読み込み中..." : "マジックリンクを送る"}</span>
          </Button>
        </FormControl>
      </Container>
    </>
  )
}

export default Auth
