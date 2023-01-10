import { SupabaseClient } from "@supabase/auth-helpers-react"

const useCloud = (client: SupabaseClient) => {
  const upload = async (file: File, onComplete?: () => void) => {
    // TODO: ログイン情報の状態管理
    const uid = ""

    // TODO: シーンファイル名称の状態管理
    const sceneName = ""

    client.storage
      .from("scenes")
      .upload(`${uid}/${sceneName}`, file)
      .then(() => {
        if (onComplete) onComplete()
      })
      .catch((reason) => alert(reason))
  }

  const download = async (onComplete?: () => void) => {
    // TODO: ログイン情報の状態管理
    const uid = ""

    // TODO: シーンファイル名称の状態管理
    const sceneName = ""

    client.storage
      .from("scenes")
      .download(`${uid}/${sceneName}`)
      .then(() => {
        if (onComplete) onComplete()
      })
      .catch((reason) => alert(reason))
  }
  return { upload, download }
}

export default useCloud
