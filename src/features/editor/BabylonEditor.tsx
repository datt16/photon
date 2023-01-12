import {
  Engine,
  Scene,
  SceneLoader,
  GizmoManager,
  Nullable,
  ArcRotateCamera,
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
  Icon,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import React, { useEffect, useMemo, useRef, useState } from "react"
import Div100vh from "react-div-100vh"
import { useRecoilState } from "recoil"
import useAssetLoad from "./hooks/useAssetLoad"

import InputFileButton from "./components/elements/button/InputFIleButton"
import FloatingControlPanel from "./components/elements/panel/FloatingControlPanel"
import getMeshData from "./babylonLogic/GetMeshData"
import { onEditorRendered, onEditorReady } from "./babylonLogic/Common"
import Inspector from "./components/layouts/inspector/Inspector"
import { pickModeState } from "../../globalStates/atoms/selectModeState"
import { SceneObservable } from "./babylonLogic/SceneObservables"
import { useAnnotateStore } from "../../libs/AnnotateStore"
import AnnotationItem from "./components/layouts/annotation/AnnotationItem"
import { useEditorStore } from "../../libs/EditorStore"
import AnnotationEditor from "./components/layouts/annotation/AnnotationEditor"
import useExport from "./hooks/useExport"
import { MdSaveAlt } from "react-icons/md"
import useCloud from "./hooks/useCloud"
import { BsCloud } from "react-icons/bs"

const BabylonEditor = () => {
  const { annotations, isEditing } = useAnnotateStore()
  const {
    currentPickedPoint,
    setPoint,
    setPointWindow,
    setPointerMeshUid,
    pointerMeshUid,
  } = useEditorStore()

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
  const { meshList, setMeshList } = useEditorStore()
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
        if (typeof onRender === "function") onRender(scene, engine)
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
        setMeshList( getMeshData(meshes))
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
      // await SceneLoader.AppendAsync(url, undefined, scene, undefined, type)
      SceneLoader.Load(
        url,
        undefined,
        scene.getEngine(),
        undefined,
        undefined,
        (error) => {
          console.warn(error)
        },
        type
      )
    }
    if (assetUrl == "") return
    if (scene) {
      Load3dData(scene, assetUrl, assetType).then(() => {
        // do nothing | ファイル読み込み後の振る舞い
      })
    }
  }, [assetUrl, assetType, scene])

  // Export feature logic
  const { exportAnnotations, exportSceneAsBabylon, exportSceneAsGltf } =
    useExport(scene)

  // EditorScene Annotation feature logic
  const [isAnnotationEditorOpen, setIsAnnotationEditorOpen] = useState(false)

  const sceneObservable = useMemo<SceneObservable | undefined>(() => {
    if (scene && gizmoManager && isSceneReady) {
      return new SceneObservable(scene, gizmoManager, (args) => {
        setPointerMeshUid(args.pointObjectUid)
        // 注釈入力欄出す
        setPoint(args.pickedPointOnScene)
        setPointWindow(args.pickedPointOnEditor)
        setIsAnnotationEditorOpen(true)
      })
    } else undefined
  }, [
    gizmoManager,
    isSceneReady,
    scene,
    setPoint,
    setPointWindow,
    setPointerMeshUid,
  ])

  // EditorScene Observable : 色々なイベントの機能が実装されてる
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

  const { upload, download } = useCloud(scene)

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
              <Button
                size="xs"
                onClick={() => download("c8e83149-2e74-44cc-b7ec-6e2175c6e058")}
              >
                <Icon as={() => <BsCloud />}></Icon>
              </Button>
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
                size={"sm"}
                onClick={() => {
                  exportAnnotations()
                }}
              >
                <Icon size={"sm"} as={MdSaveAlt} />
              </Button>
              <Button
                size={"sm"}
                onClick={() => {
                  exportSceneAsBabylon()
                }}
              >
                <Icon size={"sm"} as={MdSaveAlt} />
              </Button>
              <Button
                size={"sm"}
                onClick={() => {
                  exportSceneAsGltf()
                }}
              >
                GLTF
              </Button>
              <Button
                size={"sm"}
                onClick={() => {
                  upload()
                }}
              >
                CLOUD
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
                  onClick={() => {
                    const camera = scene?.cameras[0] as ArcRotateCamera
                    if (v.targetPosition && camera?.position) {
                      camera.position = v.targetPosition
                    }
                    camera.radius += 4
                  }}
                />
              ))}
            </VStack>
          </VStack>
        </HStack>
      </FloatingControlPanel>

      <AnnotationEditor
        isEditorOpen={isAnnotationEditorOpen}
        setIsEditorOpen={setIsAnnotationEditorOpen}
        onCanceled={() => {
          if (pointerMeshUid)
            scene?.getMeshByUniqueId(pointerMeshUid)?.dispose()
        }}
      />

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
        onClick={() => {
          if (!isEditing) setIsAnnotationEditorOpen(false)
        }}
      />

      <HStack
        position="fixed"
        width={"100vw"}
        bottom={0}
        zIndex={100}
        background={"Background"}
      >
        <Text fontSize={"xs"}>
          {currentPickedPoint?.toString() ?? "何も選択されていません。"}
        </Text>
      </HStack>
    </Div100vh>
  )
}

export default BabylonEditor
