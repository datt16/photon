import { Scene, SceneLoader, SceneSerializer } from "@babylonjs/core"
import { GLTF2Export } from "@babylonjs/serializers"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { createHash } from "crypto"
import { useAnnotateStore } from "../../../libs/AnnotateStore"
import { useEditorStore } from "../../../libs/EditorStore"
import { useUserStore } from "../../../libs/UserStore"
import { Database } from "../../../types/db/schema"

// TODO: 切り出し
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const scene2Babylon = (scene: Scene, fileName: string): File => {
  const serializedScene = SceneSerializer.Serialize(scene)
  const json = JSON.stringify(serializedScene)
  return new File([json], `${fileName}.babylon`, { type: "octet/stream" })
}

const scene2glb = async (scene: Scene, fileName: string) => {
  const data = await GLTF2Export.GLBAsync(scene, fileName)
  return new File([data.glTFFiles[`${fileName}.glb`]], `${fileName}.glb`, {
    type: "model/gltf-binary",
  })
}

const disposeAllObjects = (scene: Scene) => {
  scene.meshes.forEach((v) => v.dispose())
}

const useCloud = (scene?: Scene) => {
  const client = useSupabaseClient<Database>()
  const { uid } = useUserStore()
  const { annotations, setAll: loadAnnotations } = useAnnotateStore()
  const {
    setRemoteData: loadSceneOptions,
    sceneName,
    remoteSceneId,
    ownerId,
    cloudFilePath,
    cloudFileExists,
  } = useEditorStore()

  const upload = async () => {
    if (!scene) {
      alert("シーンが初期化されていないため、操作を行えません。")
      return
    }

    if (!uid) {
      alert("ログインしていないため、操作が行えません。")
      return
    }

    const fileName = createHash("sha1").update(sceneName).digest("hex")
    // const file = scene2Babylon(scene, fileName)

    const file = await scene2glb(scene, fileName)

    if (cloudFileExists) {
      // ファイルが既にアップロードされている場合
      const { data: storageData, error: storageUploadError } =
        await client.storage
          .from("scenes")
          .update(cloudFilePath as string, file)

      if (storageUploadError) {
        console.error(storageUploadError.message)
        return
      }

      const { error: insertError } = await client
        .from("scenes")
        .update({
          owner_id: ownerId,
          name: sceneName,
          annotation_dataset: JSON.stringify(annotations),
          scene_file_url: storageData.path,
        })
        .eq("id", remoteSceneId)

      if (storageUploadError) {
        console.error(insertError?.message)
        return
      }
    } else {
      const { data: storageData, error: storageUploadError } =
        await client.storage
          .from("scenes")
          .upload(`${uid}/${sceneName}/${file.name}`, file)

      if (storageUploadError) {
        console.error(storageUploadError.message)
        return
      }

      const { data, error: insertError } = await client
        .from("scenes")
        .insert([
          {
            owner_id: uid,
            name: sceneName,
            annotation_dataset: JSON.stringify(annotations),
            scene_file_url: storageData.path,
          },
        ])
        .select()

      if (storageUploadError) {
        console.error(insertError?.message)
        return
      }

      if (data) {
        loadSceneOptions({
          sceneName: data[0].name,
          remoteSceneId: data[0].id,
          ownerId: data[0].owner_id,
          cloudFilePath: data[0].scene_file_url as string,
        })
      }
    }
    alert("保存しました")
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

    loadSceneOptions({
      sceneName: sceneData.name,
      remoteSceneId: sceneData.id,
      ownerId: sceneData.owner_id,
      cloudFilePath: sceneData.scene_file_url,
    })

    loadAnnotations(JSON.parse(sceneData.annotation_dataset as string))

    disposeAllObjects(scene)

    await SceneLoader.AppendAsync(
      URL.createObjectURL(sceneFile),
      undefined,
      scene,
      undefined,
      "." + sceneData.scene_file_url.split(".").pop()
    )
    alert("Data Fetched")
  }

  return { upload, download }
}

export default useCloud
