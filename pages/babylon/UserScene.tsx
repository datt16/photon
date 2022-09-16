import { Button, Flex, Switch } from "@chakra-ui/react"
import {
  ArcRotateCamera,
  BoxParticleEmitter,
  DirectionalLight,
  Mesh,
  MeshBuilder,
  PointLight,
  Scene,
  Vector3,
} from "babylonjs"
import { AbstractMesh } from "babylonjs/Meshes/index"
import React, { Ref, useState } from "react"
import FakeScene from "./FakeScene"

const UserScene = () => {
  const [SelectedItem, setSelectedItem] = useState<Mesh | null>(null)
  const [selectedOption, setSelectedOption] = useState<any>()
  const [scene, setScene] = useState<Scene>()

  const onSceneReady = (scene: Scene, canvas: Ref<HTMLCanvasElement>) => {
    setScene(scene)
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      scene
    )

    MeshBuilder.CreateBox("fake-box", {
      size: 1,
    })

    new DirectionalLight("PointLight", new Vector3(0, -1, 0), scene)
    camera.attachControl(canvas, true)
  }

  const onRender = (scene: Scene) => {
    // console.log(scene.pointerX)
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
      <FakeScene onRender={onRender} onSceneReady={onSceneReady} />
    </div>
  )
}

export default UserScene
