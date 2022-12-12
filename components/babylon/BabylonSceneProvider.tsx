import {
  EngineOptions,
  SceneOptions,
  Engine,
  Scene,
  SceneLoader,
  GizmoManager,
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
  AccordionIcon,
} from "@chakra-ui/react"
import { AddIcon, ChevronRightIcon, PlusSquareIcon } from "@chakra-ui/icons"
import React, { useEffect, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import { useRecoilState } from "recoil"
import useAssetLoad from "../../features/editor/hooks/useAssetLoad"
import { meshListState } from "../../globalStates/atoms/meshListState"

import InputFileButton from "../elements/button/InputFIleButton"
import FloatingControlPanel from "../elements/panel/FloatingControlPanel"
import getMeshData from "../../features/editor/logic/GetMeshData"
import InspectorPanelIcon from "../elements/icon/InspectorPanelIcon"

export interface PropTypes {
  antialias?: boolean
  engineOptions?: EngineOptions
  adaptToDeviceRatio?: boolean
  sceneOptions?: SceneOptions
  onRender: (scene: Scene) => void
  onSceneReady: (scene: Scene, gizmoManager: GizmoManager) => void
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

  // useGizmoManger
  const [gizmoManager, setGizmoManager] = useState<GizmoManager>()
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
      setScene(_scene)
    }

    if (scene) {
      const _gizmoManager = new GizmoManager(scene)
      const resize = () => {
        scene.getEngine().resize()
      }

      // windowのイベントリスナにリサイズの処理を追加
      if (window) {
        window.addEventListener("resize", resize)
      }

      // シーンの準備ができたらonSceneReady()で描画を始める
      if (scene.isReady()) {
        setGizmoManager(_gizmoManager)

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
        onSceneReady(scene, _gizmoManager)
      } else {
        scene.onReadyObservable.addOnce((scene) =>
          onSceneReady(scene, _gizmoManager)
        )
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
              return meshList[key].isInspectorVisible ? (
                <AccordionItem key={key + meshList[key].name}>
                  <AccordionButton alignContent="center">
                    <AccordionIcon />
                    <Text ml={2} color="WindowText">
                      {key}
                    </Text>
                  </AccordionButton>
                  {meshList[key].child ? (
                    <AccordionPanel>
                      {meshList[key].child.map((meshItem) =>
                        meshItem.isInspectorVisible ? (
                          <AccordionItem key={meshItem.name + meshItem.uid}>
                            <AccordionButton
                              alignContent="center"
                              onClick={() => {
                                const id = meshItem.uid
                                const target = scene?.getMeshByUniqueId(id)
                                if (target) gizmoManager?.attachToMesh(target)
                                console.log(scene?.rootNodes)
                              }}
                            >
                              <InspectorPanelIcon meshType={meshItem.type} />
                              <Text ml={2} color="WindowText">
                                {meshItem.name}
                              </Text>
                            </AccordionButton>
                          </AccordionItem>
                        ) : (
                          <></>
                        )
                      )}
                    </AccordionPanel>
                  ) : null}
                </AccordionItem>
              ) : (
                <></>
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
