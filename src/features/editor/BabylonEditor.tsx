import {
  Engine,
  Scene,
  SceneLoader,
  GizmoManager,
  Nullable,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import {
  VStack,
  Text,
  HStack,
  ButtonGroup,
  Button,
  StackDivider,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import React, { useEffect, useMemo, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import { useRecoilState } from "recoil"
import useAssetLoad from "./hooks/useAssetLoad"
import { meshListState } from "../../globalStates/atoms/meshListState"

import InputFileButton from "./components/elements/button/InputFIleButton"
import FloatingControlPanel from "./components/elements/panel/FloatingControlPanel"
import getMeshData from "./babylonLogic/GetMeshData"
import { SceneMeshData } from "photon-babylon"
import { onEditorRendered, onEditorReady } from "./babylonLogic/Common"
import Inspector from "./components/layouts/inspector/Inspector"
import { pickModeState } from "../../globalStates/atoms/selectModeState"
import { SceneObservable } from "./babylonLogic/SceneObservables"
import { useAnnotateStore } from "../../libs/AnnotateStore"
import AnnotationItem from "./components/layouts/annotation/AnnotationItem"

const BabylonEditor = () => {
  // EditorScene eventListener
  const onRender = onEditorRendered
  const onSceneReady = onEditorReady

  // Engine config
  const antialias = true
  const engineOptions = undefined
  const adaptToDeviceRatio = true
  const sceneOptions = undefined

  // Canvas state
  const renderCanvas = useRef<Nullable<HTMLCanvasElement>>(null)
  const [canvasReady, setCanvasReady] = useState(false)

  // 3D scene state
  const [gizmoManager, setGizmoManager] = useState<GizmoManager>()
  const [meshList, setMeshList] = useRecoilState(meshListState)
  const [pickMode, setPickMode] = useRecoilState(pickModeState)
  const [isSceneReady, setIsSceneReady] = useState(false)

  // Babylon Engine & Scene variable
  const engine = useMemo((): Engine | undefined => {
    if (canvasReady) {
      return new Engine(
        renderCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      )
    }
    return undefined
  }, [adaptToDeviceRatio, antialias, canvasReady, engineOptions])
  const scene = useMemo((): Scene | undefined => {
    if (engine) {
      return new Scene(engine, sceneOptions)
    }
    return undefined
  }, [engine, sceneOptions])

  // EditorScene common setup
  useEffect(() => {
    if (engine && scene) {
      engine.runRenderLoop(() => {
        if (typeof onRender === "function") onRender(scene)
        scene.render()
      })

      const resize = () => {
        scene.getEngine().resize()
      }
      if (window) {
        window.addEventListener("resize", resize)
      }

      const _gizmoManager = new GizmoManager(scene)
      setGizmoManager(_gizmoManager)

      scene.onNewMeshAddedObservable.add(() => {
        const meshes = scene.rootNodes
        setMeshList((item) => {
          const value = { ...item }
          const meshData: SceneMeshData = getMeshData(meshes)
          Object.keys(meshData).forEach((key) => {
            value[key] = meshData[key]
          })
          return value
        })
      })
      onSceneReady(scene, _gizmoManager)
      setIsSceneReady(true)
      return () => {
        if (window) {
          window.removeEventListener("resize", resize)
        }
        scene.dispose()
        setIsSceneReady(false)
      }
    }
  }, [renderCanvas, scene, engine, onRender, onSceneReady, setMeshList])

  // EditorScene import feature logic
  const { handleSingle3dFileInput, assetUrl, assetType } = useAssetLoad()
  useEffect(() => {
    const Load3dData = async (scene: Scene, url: string, type: string) => {
      await SceneLoader.AppendAsync(url, undefined, scene, undefined, type)
    }
    if (assetUrl == "") return
    if (scene) {
      Load3dData(scene, assetUrl, assetType).then(() => {
        // do nothing | ファイル読み込み後の振る舞い
      })
    }
  }, [assetUrl, assetType, scene])

  const sceneObservable = useMemo<SceneObservable | undefined>(() => {
    if (scene && gizmoManager && isSceneReady) {
      return new SceneObservable(scene, gizmoManager)
    } else undefined
  }, [gizmoManager, isSceneReady, scene])

  // ステートによってobserverの有無を切り替えたい
  useEffect(() => {
    if (sceneObservable && scene && gizmoManager) {
      if (pickMode == "gizmo") {
        scene.onPointerObservable.removeCallback(
          sceneObservable.onAddAnnotateObserver
        )
        scene.onPointerObservable.add(sceneObservable.onPickMeshObserver)
      } else if (pickMode == "annotate") {
        scene.onPointerObservable.removeCallback(
          sceneObservable.onPickMeshObserver
        )
        scene.onPointerObservable.add(sceneObservable.onAddAnnotateObserver)
      }
    }
  }, [gizmoManager, pickMode, scene, sceneObservable])

  const { annotations, appendItem } = useAnnotateStore()

  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <FloatingControlPanel>
        <HStack>
          <VStack
            alignItems="start"
            maxH="90vh"
            border={"solid 1px"}
            borderColor="white"
            borderRadius="lg"
          >
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

            <Inspector
              meshList={meshList}
              scene={scene}
              onClickMeshItem={(meshItem) => {
                const id = meshItem.uid
                const target = scene?.getMeshByUniqueId(id)
                if (target) gizmoManager?.attachToMesh(target)
              }}
              onClickNodeItem={(nodeItem) => {
                const id = nodeItem.uid
                const target = scene?.getTransformNodeByUniqueId(id)
                if (target) gizmoManager?.attachToNode(target)
              }}
            />
          </VStack>

          <VStack>
            <ButtonGroup>
              <Button
                colorScheme={pickMode == "gizmo" ? "blue" : "gray"}
                onClick={() => setPickMode("gizmo")}
              >
                Move
              </Button>
              <Button
                colorScheme={pickMode == "annotate" ? "blue" : "gray"}
                onClick={() => setPickMode("annotate")}
              >
                Memo
              </Button>
            </ButtonGroup>
          </VStack>
        </HStack>
      </FloatingControlPanel>
      <FloatingControlPanel position="right">
        <HStack>
          <VStack alignItems="start" maxW="300px" spacing={0}>
            <HStack py={2} px={4}>
              <Text>注釈</Text>
              <Button
                size={"xs"}
                onClick={() => {
                  appendItem({
                    title: "追加された注釈",
                    description: "これは追加された注釈です。",
                    index: 2,
                    uniqueId: 222,
                    userName: "@datt16",
                  })
                }}
              >
                <AddIcon />
              </Button>
            </HStack>

            <VStack
              maxH="90vh"
              overflow={"auto"}
              overflowX={"hidden"}
              spacing={0}
              divider={<StackDivider />}
            >
              {annotations.map((v, i) => (
                <AnnotationItem
                  key={v.uniqueId + i}
                  index={v.index}
                  title={v.title}
                  user={v.userName}
                  description={v.description}
                />
              ))}
            </VStack>
          </VStack>
        </HStack>
      </FloatingControlPanel>

      <canvas
        ref={(view) => {
          renderCanvas.current = view
          setCanvasReady(true)
        }}
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
        }}
      />
    </Div100vh>
  )
}

export default BabylonEditor
