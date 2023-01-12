import { SupabaseClient } from "@supabase/supabase-js"
import { useUserStore } from "../../../libs/UserStore"

const useProfile = (supabase: SupabaseClient) => {
  const { handleLogin } = useUserStore()

  const getProfile = async (uid: string) => {
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", uid)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        handleLogin({
          uid: uid,
          avatarImageUrl: data.avatar_url,
          userName: data.username,
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // alert(error.message)
    }
  }

  return { getProfile }
}

export default useProfile
