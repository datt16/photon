import { SceneSerializer, Scene } from "@babylonjs/core"
import { GLTF2Export } from "@babylonjs/serializers/glTF"
import { useAnnotateStore } from "../../../libs/AnnotateStore"

const useExport = (scene?: Scene) => {
  const annotations = useAnnotateStore((state) => state.annotations)

  const exportAnnotations = () => {
    const json = JSON.stringify(annotations)
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([json], { type: "text/json" }))
    a.download = "annotations.json"

    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const exportSceneAsBabylon = () => {
    if (scene) {
      const serializedScene = SceneSerializer.Serialize(scene)
      const json = JSON.stringify(serializedScene)
      const a = document.createElement("a")
      a.href = URL.createObjectURL(new Blob([json], { type: "octet/stream" }))
      a.download = "scene.babylon"

      a.style.display = "none"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      console.warn("エクスポート可能なシーンが存在しません。")
    }
  }

  const exportSceneAsGltf = () => {
    if (scene) {
      GLTF2Export.GLTFAsync(scene, "scene").then((gltf) => {
        // .binファイルもダウンロードされるっぽい
        gltf.downloadFiles()
      })
    } else {
      console.warn("エクスポート可能なシーンが存在しません。")
    }
  }

  // TODO: GLB, STL, OBJ

  return {
    exportAnnotations,
    exportSceneAsBabylon,
    exportSceneAsGltf,
  }
}

export default useExport
