import { Switch } from "@chakra-ui/react"
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
import React, { Ref, useState } from "react"
import FakeScene from "./FakeScene"

const UserScene = () => {
  const [SelectedItem, setSelectedItem] = useState<Mesh | null>(null)
  const [selectedOption, setSelectedOption] = useState<any>()
  const onSceneReady = (scene: Scene, canvas: Ref<HTMLCanvasElement>) => {
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      scene
    )

    const box = MeshBuilder.CreateBox(
      "box",
      {
        width: 1,
        height: 1,
      },
      scene
    )
    new DirectionalLight("PointLight", new Vector3(0, -1, 0), scene)
    camera.setTarget(box.position)
    camera.attachControl(canvas, true)

    setSelectedItem(box)
  }

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
      <FakeScene onRender={() => {}} onSceneReady={onSceneReady} />
    </div>
  )
}

export default UserScene
