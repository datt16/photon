import { ArcRotateCamera, MeshBuilder, Scene, Vector3 } from "babylonjs"
import React from "react"
import FakeScene from "./FakeScene"

const UserScene = () => {
  const onSceneReady = (scene: Scene) => {
    new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      scene
    )

    MeshBuilder.CreateBox(
      "box",
      {
        width: 1,
        height: 1,
      },
      scene
    )
  }

  return (
    <div>
      <p>FakeScene</p>
      <FakeScene onRender={() => {}} onSceneReady={onSceneReady} />
    </div>
  )
}

export default UserScene
