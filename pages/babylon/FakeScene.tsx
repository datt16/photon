import {
  ArcRotateCamera,
  Engine,
  EngineOptions,
  Scene,
  SceneOptions,
  Vector3,
} from "babylonjs"
import React, { Ref, useEffect, useRef, useState } from "react"

export interface IFakeSceneProps {
  antialias?: boolean
  engineOptions?: EngineOptions
  adaptToDeviceRatio?: boolean
  sceneOptions?: SceneOptions
  onRender: (scene: Scene) => void
  onSceneReady: (scene: Scene) => void
}

const FakeScene: React.FC<IFakeSceneProps> = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}) => {
  const reactCanvas = useRef(null)

  useEffect(() => {
    const { current: canvas } = reactCanvas

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio
    )
    const scene = new Scene(engine, sceneOptions)
    if (scene.isReady()) {
      onSceneReady(scene)
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene))
    }

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

    return () => {
      scene.getEngine().dispose()

      if (window) {
        window.removeEventListener("resize", resize)
      }
    }
  }, [reactCanvas])
  return (
    <canvas
      style={{ width: "100%", height: "100%" }}
      ref={reactCanvas}
      {...rest}
    />
  )
}

export default FakeScene
