import { Button, Flex, Switch } from "@chakra-ui/react"
import {
  ArcRotateCamera,
  BoxParticleEmitter,
  Color3,
  DirectionalLight,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PointerEventTypes,
  PointLight,
  Scene,
  StandardMaterial,
  Vector3,
} from "babylonjs"
import { AbstractMesh } from "babylonjs/Meshes/index"
import { it } from "node:test"
import React, { Ref, useState } from "react"
import FakeScene from "./FakeScene"

const UserScene = () => {
  const [SelectedItem, setSelectedItem] = useState<Mesh | null>(null)
  const [selectedOption, setSelectedOption] = useState<any>()
  const [scene, setScene] = useState<Scene>()

  const onSceneReady = (scene: Scene) => {
    setScene(scene)

    new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      scene
    ).attachControl(true)

    const box = MeshBuilder.CreateBox("fake-box", {
      size: 1,
    })
    box.position = new Vector3(1, 0, 0)

    const box1 = MeshBuilder.CreateBox("fake-box-2", {
      size: 1,
    })
    box1.position = new Vector3(-1, 0, 0)
    new HemisphericLight("Light", new Vector3(0, 1, 0), scene)

    scene.onPointerObservable.add((info) => {
      switch (info.type) {
        case PointerEventTypes.POINTERDOWN:
          console.log("DOWN", getPickedMesh(scene))
          break
        case PointerEventTypes.POINTERUP:
          console.log("UP", getPickedMesh(scene))
          break
        // case PointerEventTypes.POINTERMOVE:
        //   console.log("MOVE", getPickedMesh(scene))
        //   break
        case PointerEventTypes.POINTERWHEEL:
          console.log("WHEEL", getPickedMesh(scene))
          break
        case PointerEventTypes.POINTERPICK:
          toggleBoundingBox(scene, getPickedMesh(scene))
          break
        case PointerEventTypes.POINTERTAP:
          console.log("TAP", getPickedMesh(scene))
          break
        case PointerEventTypes.POINTERDOUBLETAP:
          console.log("W-TAP", getPickedMesh(scene))
          break
      }
    })
  }

  const getPickedMesh = (scene: Scene) => {
    const picked = scene.pick(scene.pointerX, scene.pointerY)?.pickedMesh
    return picked ? picked.uniqueId : null
  }

  const toggleBoundingBox = (scene: Scene, meshUniqueId: number | null) => {
    if (meshUniqueId) {
      const ref = scene.getMeshByUniqueId(meshUniqueId)
      if (ref) {
        ref.showBoundingBox = ref.showBoundingBox ? false : true
      }
    }
  }

  const onRender = (scene: Scene) => {
    // 毎フレーム実行される処理
  }

  /**
   *
   * メソッドコーナー : 後で別ファイルでまとめて宣言する
   *
   */

  const getMeshListText = (scene: Scene | undefined): string => {
    let res = ""
    scene?.meshes.map((it) => {
      res += ` ${it.name}`
    })
    return res
  }

  const getLightListText = (scene: Scene | undefined): string => {
    let res = ""
    scene?.lights.map((it) => {
      res += ` ${it.name}`
    })
    return res
  }

  const getCameraListText = (scene: Scene | undefined): string => {
    let res = ""
    scene?.cameras.map((it) => {
      res += ` ${it.name}`
    })
    return res
  }

  const getMaterialsListText = (scene: Scene | undefined): string => {
    let res = ""
    scene?.materials.map((it) => {
      res += ` ${it.name}`
    })
    return res
  }

  /* = = = = = = = = = = = = = = = =
   * メソッドコーナー <ここまで>
   */

  return (
    <div>
      <p>FakeScene</p>
      <Switch
        onChange={() => {
          if (SelectedItem !== null) {
            if (selectedOption) {
              SelectedItem.scaling = new Vector3(1, 1, 1)
              setSelectedOption(false)
            } else {
              SelectedItem.scaling = new Vector3(2, 2, 2)
              setSelectedOption(true)
            }
          }
        }}
      >
        isBig?
      </Switch>
      <Flex>
        <Button
          onClick={() => {
            console.info(getMeshListText(scene))
          }}
        >
          output meshes
        </Button>
        <Button
          onClick={() => {
            console.info(getLightListText(scene))
          }}
        >
          output lights
        </Button>
        <Button
          onClick={() => {
            console.info(getCameraListText(scene))
          }}
        >
          output cameras
        </Button>
        <Button
          onClick={() => {
            console.info(getMaterialsListText(scene))
          }}
        >
          output materials
        </Button>
      </Flex>
      <FakeScene antialias onRender={onRender} onSceneReady={onSceneReady} />
    </div>
  )
}

export default UserScene
