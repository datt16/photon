import {
  Engine,
  Scene,
  SceneLoader,
  GizmoManager,
  Nullable,
} from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import "@babylonjs/loaders/OBJ"
import { VStack, Text, HStack } from "@chakra-ui/react"
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
import {
  onEditorRendered,
  onEditorReady,
} from "./babylonLogic/Common"
import Inspector from "./components/layouts/inspector/Inspector"

const BabylonSceneProvider = () => {
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
      return () => {
        if (window) {
          window.removeEventListener("resize", resize)
        }
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

  return (
    <Div100vh
      style={{
        overflow: "hidden",
      }}
    >
      <FloatingControlPanel>
        <VStack alignItems="start" maxH="90vh">
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

export default BabylonSceneProvider
