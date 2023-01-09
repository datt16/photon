import { Button, Container, FormControl, Input, Text } from "@chakra-ui/react"
import { AuthError } from "@supabase/supabase-js"
import { useState } from "react"
import { supabase } from "../../utils/supabaseClient"

const Auth = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert("メールアドレスが間違っていないか確認してください。")
    } catch (error: any) {
      alert(error.err_description || error.message)
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
