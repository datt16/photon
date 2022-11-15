import {
  EngineOptions,
  SceneOptions,
  Engine,
  Scene,
  Vector3,
  SceneLoader,
  WebGPUEngine,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import { Button, Input } from "@chakra-ui/react"
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
import InputFIleButton from "../elements/button/InputFIleButton"
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

    if (canvas === null) return
    const engine = new WebGPUEngine(canvas, {})

    // const engine = new Engine(
    //   canvas,
    //   antialias,
    //   engineOptions,
    //   adaptToDeviceRatio
    // )

    const initEngine = async () => {
      await engine.initAsync()
      engine.snapshotRendering = true
      if (scene === undefined) {
        const _scene = new Scene(engine, sceneOptions)
        console.log(new Date(), _scene.uid)
        setScene(_scene)
      }

      if (scene) {
        // 以降描画し続けるための処理
        scene.getEngine().runRenderLoop(() => {
          if (typeof onRender === "function") onRender(scene)
          scene.render()
        })
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

        // コンポーネントがディスポーズされたとき
        return () => {
          scene.getEngine().dispose()
          if (window) {
            window.removeEventListener("resize", resize)
          }
        }
      }
    }

    initEngine()
  }, [reactCanvas, scene])

  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <FloatingControlPanel>
        <InputFIleButton
          name="FILE"
          onChange={(e) => {
            handleFiles(e)
            e.target.value = ""
          }}
          size="xs"
        >
          インポート
        </InputFIleButton>
        <Button
          onClick={() => {
            console.log("debug", scene?.meshes)
          }}
        >
          Make
        </Button>
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
