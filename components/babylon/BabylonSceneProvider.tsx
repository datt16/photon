import {
  EngineOptions,
  SceneOptions,
  Engine,
  Scene,
  SceneLoader,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import {
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  HStack,
} from "@chakra-ui/react"
import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons"
import React, { useEffect, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import { useRecoilState } from "recoil"
import useAssetLoad from "../../features/editor/hooks/useAssetLoad"
import { meshListState } from "../../globalStates/atoms/meshListState"

import InputFileButton from "../elements/button/InputFIleButton"
import FloatingControlPanel from "../elements/panel/FloatingControlPanel"
import getMeshData from "../../features/editor/logic/GetMeshData"

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
  const [meshList, setMeshList] = useRecoilState(meshListState)
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
        scene.onNewMeshAddedObservable.add(() => {
          const meshes = scene!.rootNodes
          setMeshList((item) => {
            let value = { ...item }
            const meshData: any = getMeshData(meshes)
            Object.keys(meshData).forEach((key) => {
              value[key] = meshData[key]
            })
            return value
          })
        })
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
      await SceneLoader.AppendAsync(url, undefined, scene, undefined, type)
    }

    if (assetUrl == "") return
    if (scene) {
      Load3dData(scene, assetUrl, assetType)
    }
  }, [assetUrl, assetType])

  useEffect(() => {
    console.log(meshList)
  }, [meshList])

  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <FloatingControlPanel>
        <VStack alignItems="start">
          <HStack mt={2} mx={4}>
            <Text>Inspector</Text>
            <InputFileButton
              name="FILE"
              labelText="インポート"
              onChange={(e) => {
                handleSingle3dFileInput(e)
                e.target.value = ""
              }}
              size="xs"
            >
              <AddIcon />
            </InputFileButton>
          </HStack>
          <Accordion allowMultiple backgroundColor="ButtonFace" w="100%">
            {Object.keys(meshList).map((key) => {
              return (
                <AccordionItem key={key}>
                  <AccordionButton alignContent="center">
                    <PlusSquareIcon />
                    <Text ml={2} color="WindowText">
                      {key}
                    </Text>
                  </AccordionButton>
                  <AccordionPanel></AccordionPanel>
                </AccordionItem>
              )
            })}
          </Accordion>
        </VStack>
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
