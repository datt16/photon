import {
  ArcRotateCamera,
  DirectionalLight,
  MeshBuilder,
  PointLight,
  Scene,
  Vector3,
} from "babylonjs"
import React, { Ref } from "react"
import FakeScene from "./FakeScene"

const UserScene = () => {
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
  }

  return (
    <div>
      <p>FakeScene</p>
      <button>Hello</button>
      <FakeScene onRender={() => {}} onSceneReady={onSceneReady} />
    </div>
  )
}

export default UserScene
