import { Scene, SceneSerializer } from "@babylonjs/core"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createHash } from "crypto"
import { useAnnotateStore } from "../../../libs/AnnotateStore"
import { useUserStore } from "../../../libs/UserStore"
import { Database } from "../../../types/db/schema"

// TODO: 切り出し
const Scene2Babylon = (scene: Scene, fileName: string): File => {
  const serializedScene = SceneSerializer.Serialize(scene)
  const json = JSON.stringify(serializedScene)
  return new File([json], `${fileName}.babylon`, { type: "octet/stream" })
}

const useCloud = (scene?: Scene) => {
  const client = useSupabaseClient<Database>()
  const { uid } = useUserStore()
  const { annotations } = useAnnotateStore()

  const upload = async () => {
    if (!scene) {
      alert("シーンが初期化されていないため、操作を行えません。")
      return
    }

    if (!uid) {
      alert("ログインしていないため、操作が行えません。")
      return
    }

    // TODO: シーンファイル名称の状態管理
    const sceneName = "untitled-1"
    const fileName = createHash("sha1").update(sceneName).digest("hex")

    const file = Scene2Babylon(scene, fileName)

    // TODO: パスが重複しないようにする
    // TODO: 既にファイルがあった場合にupload()ではなくupdate()を呼ぶようにする
    const { data: storageData, error: storageUploadError } =
      await client.storage
        .from("scenes")
        .upload(`${uid}/${sceneName}/${file.name}`, file)

    if (storageUploadError) {
      console.error(storageUploadError.message)
      return
    }

    const { error: insertError } = await client
      .from("scenes")
      .insert([
        {
          owner_id: uid,
          name: sceneName,
          annotation_dataset: JSON.stringify(annotations),
          scene_file_url: storageData.path,
        },
      ])
      .single()

    if (storageUploadError) {
      console.error(insertError?.message)
      return
    }
  }

  const download = async (sceneId: string) => {
    if (!scene) {
      alert("シーンが初期化されていないため、操作を行えません。")
      return
    }

    if (!uid) {
      alert("ログインしていないため、操作が行えません。")
      return
    }

    // シーン情報の行取得
    const { data: sceneData, error: rowFetchError } = await client
      .from("scenes")
      .select("*")
      .match({
        id: sceneId,
      })
      .single()
    if (!sceneData?.scene_file_url) return

    if (rowFetchError) console.error(rowFetchError)

    // シーンファイル本体の取得
    const { data: sceneFile, error: fileFetchError } = await client.storage
      .from("scenes")
      .download(sceneData?.scene_file_url)

    if (!sceneFile) return
    if (fileFetchError) console.error(fileFetchError)

    // TODO: ダウンロードしたファイルのハンドリング
    // - sceneDataはZustandのStoreへ転送
    // - sceneFileはsceneのAppendAsyncで読み込み
    console.log(sceneData, sceneFile.type)
    alert("Data Fetched")
  }

  return { upload, download }
}

export default useCloud
