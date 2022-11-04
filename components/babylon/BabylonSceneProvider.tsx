import { EngineOptions, SceneOptions } from "@babylonjs/core"
import { Button, VStack, Text, Divider } from "@chakra-ui/react"
import { Engine, Scene, Vector3 } from "babylonjs"
import React, { createContext, useEffect, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import {
  addCapsule,
  addCube,
  addGround,
} from "../../features/editor/logic/CreateMesh"
import AddButtonWithControl, {
  position,
} from "../elements/button/AddButtonWithPosition"

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
  const [position, setPosition] = useState<position>({ x: 0, y: 0, z: 0 })
  const reactCanvas = useRef(null)

  // あとで適当にモジュール化
  const SceneControlPanel = (scene: Scene | undefined) => {
    return scene ? (
      <VStack
        mt={"1rem"}
        ml={"1rem"}
        alignItems={"start"}
        p="6px"
        display="flex"
        borderRadius="lg"
        border={"1px solid"}
        borderColor={"whiteAlpha.400"}
        position="fixed"
        zIndex={100}
      >
        <Text fontSize={"xs"} color={"whiteAlpha.900"}>
          開発用
        </Text>
        <Button size="xs" onClick={() => onClickUid()}>
          SHOW UID
        </Button>
        <Divider />
        <Text fontSize={"xs"} color={"whiteAlpha.900"}>
          [Dev]CREATE
        </Text>
        <Button size="xs" onClick={() => addCube(scene, new Vector3(0, 3, 0))}>
          CUBE
        </Button>
        <Button
          size="xs"
          onClick={() => addCapsule(scene, new Vector3(3, 0, 0))}
        >
          CAPSULE
        </Button>
        <Button
          size="xs"
          onClick={() => addGround(scene, new Vector3(0, 0, 0), 10, 10)}
        >
          Ground
        </Button>
        {AddButtonWithControl("CUBE", position, setPosition, (pos) => {
          addCube(scene, pos)
          console.log(position)
        })}
      </VStack>
    ) : (
      <></>
    )
  }

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
      {SceneControlPanel(scene)}
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
