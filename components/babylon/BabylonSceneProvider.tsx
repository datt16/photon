import {
  EngineOptions,
  SceneOptions,
  Engine,
  Scene,
  Vector3,
  SceneLoader,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import { Input } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import { useRecoilState, useRecoilValue } from "recoil"
import useFile from "../../features/editor/hooks/useFile"

import {
  addCapsule,
  addCube,
  addGround,
} from "../../features/editor/logic/CreateMesh"
import { fileUploadState } from "../../globalStates/atoms/fileUploadState"
import { positionState } from "../../globalStates/atoms/positionState"
import SceneControlPanel, {
  PanelButtonType,
} from "../elements/panel/SceneControlPanel"

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
  // const [position, setPosition] = useRecoilState(positionState)
  const isUploading = useRecoilValue(fileUploadState)
  const reactCanvas = useRef(null)

  const { destURL, handleFiles, fileName } = useFile()

  useEffect(() => {
    console.log("provider", destURL, fileName)
    if (isUploading) return
    if (destURL === undefined) return
    if (scene) {
      SceneLoader.Append(
        // publicフォルダ以外の場合どうするか検討
        destURL,
        fileName,
        scene,
        () => {
          alert("loaded")
        },
        () => {
          console.log("now loading...")
        },
        () => {
          console.warn("読み込めませんでした")
        }
      )
    }
  }, [isUploading, destURL, fileName])

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

  const onClickUid = () => {
    console.log(new Date(), scene?.uid)
  }

  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <Input
        position={"fixed"}
        type="file"
        onChange={(e) => {
          handleFiles(e)
          e.target.value = ""
        }}
        name="FILE"
      />
      {SceneControlPanel({
        data: [
          {
            buttonType: PanelButtonType.section,
            label: "開発用",
          },
          {
            buttonType: PanelButtonType.default,
            label: "show UID",
            onButtonClicked: () => onClickUid,
          },
          {
            buttonType: PanelButtonType.section,
            label: "開発用 - 作成",
          },
          {
            buttonType: PanelButtonType.default,
            label: "CUBE",
            onButtonClicked: () => addCube(scene),
          },
          {
            buttonType: PanelButtonType.default,
            label: "CAPSULE",
            onButtonClicked: () => addCapsule(scene),
          },
          {
            buttonType: PanelButtonType.default,
            label: "GROUND",
            onButtonClicked: () => addGround(scene),
          },
          // {
          //   buttonType: PanelButtonType.vector3,
          //   label: "CUBE2",
          //   state: position,
          //   // as使わない方法あれば考える
          //   onButtonClicked: (pos) => addCube(scene, pos as Vector3),
          //   onStateChanged: setPosition,
          // },
        ],
      })}
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
