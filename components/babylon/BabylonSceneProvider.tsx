import {
  EngineOptions,
  SceneOptions,
  Engine,
  Scene,
  SceneLoader,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import React, { useEffect, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import useAssetLoad from "../../features/editor/hooks/useAssetLoad"

import InputFileButton from "../elements/button/InputFIleButton"
import FloatingControlPanel from "../elements/panel/FloatingControlPanel"

export interface PropTypes {
  antialias?: boolean
  engineOptions?: EngineOptions
  adaptToDeviceRatio?: boolean
  sceneOptions?: SceneOptions
  onRender: (scene: Scene) => void
  onSceneReady: (scene: Scene) => void
}

const BabylonSceneProvider = (props: PropTypes) => {
  const {
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  } = props

  const [scene, setScene] = useState<Scene>()
  const reactCanvas = useRef(null)


  useEffect(() => {
    const { current: canvas } = reactCanvas
    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    )

    if (scene === undefined) {
      const _scene = new Scene(engine, sceneOptions)
      console.log(new Date(), _scene.uid)
      setScene(_scene)
    }

    if (scene) {
      const resize = () => {
        scene.getEngine().resize()
      }

      // windowのイベントリスナにリサイズの処理を追加
      if (window) {
        window.addEventListener("resize", resize)
      }

      // シーンの準備ができたらonSceneReady()で描画を始める
      if (scene.isReady()) {
        onSceneReady(scene)
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene))
      }

      // 以降描画し続けるための処理
      engine.runRenderLoop(() => {
        if (typeof onRender === "function") onRender(scene)
        scene.render()
      })

      // コンポーネントがディスポーズされたとき
      return () => {
        scene.getEngine().dispose()
        if (window) {
          window.removeEventListener("resize", resize)
        }
      }
    }
  }, [reactCanvas, scene])


  const { handleSingle3dFileInput, assetUrl, assetType } = useAssetLoad()
  useEffect(() => {
    const Load3dData = async (scene: Scene, url: string, type: string) => {
      await SceneLoader.AppendAsync(
        url,
        undefined,
        scene,
        undefined,
        type
      )
    }

    if (assetUrl == "") return
    if (scene) {
      Load3dData(scene, assetUrl, assetType)
    }
  }, [assetUrl, assetType])


  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <FloatingControlPanel>
        <InputFileButton
          name="FILE"
          onChange={(e) => {
            handleSingle3dFileInput(e)
            e.target.value = ""
          }}
          size="xs"
        >
          インポート
        </InputFileButton>
      </FloatingControlPanel>
      <canvas
        ref={reactCanvas}
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
        }}
      />
    </Div100vh>
  )
}

export default BabylonSceneProvider
