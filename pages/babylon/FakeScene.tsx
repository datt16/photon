import { Engine, EngineOptions, Scene, SceneOptions } from "babylonjs"
import React, { useEffect, useRef, useState } from "react"

export interface IFakeSceneProps {
  antialias?: boolean
  engineOptions?: EngineOptions
  adaptToDeviceRatio?: boolean
  sceneOptions?: SceneOptions
  onRender: (scene: Scene) => void
  onSceneReady: (scene: Scene) => void
}

const DefaultFakeScenePropValue: IFakeSceneProps = {
  antialias: false,
  engineOptions: {},
  adaptToDeviceRatio: false,
  sceneOptions: {},
  onRender: (scene: Scene) => {
    return scene
  },
  onSceneReady: (scene: Scene) => {
    console.log("Hello")
    return scene
  },
}

const FakeScene: React.FC<IFakeSceneProps> = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
}) => {
  const reactCanvas = useRef(null)

  const [loaded, setLoaded] = useState(false)
  const [scene, setScene] = useState<Scene | null>(null)

  useEffect(() => {
    if (window) {
      const resize = () => {
        scene?.getEngine().resize()
      }
      window.addEventListener("resize", resize)

      return () => {
        window.removeEventListener("resize", resize)
      }
    }
  }, [scene])

  useEffect(() => {
    if (!loaded) {
      setLoaded(true)
      const engine = new Engine(
        reactCanvas.current,
        antialias,
        engineOptions,
        adaptToDeviceRatio
      )
      const scene = new Scene(engine, sceneOptions)
      setScene(scene)
      if (scene.isReady()) {
        onSceneReady(scene)
      } else {
        scene.onReadyObservable.addOnce((scene) => onSceneReady(scene))
      }

      engine.runRenderLoop(() => {
        if (typeof onRender === "function") {
          onRender(scene)
        }
        scene.render()
      })
    }

    return () => {
      if (scene !== null) {
        scene.dispose()
      }
    }
  }, [reactCanvas])

  return (
    <div>
      <canvas style={{ width: "100%", height: "100%" }} ref={reactCanvas} />
    </div>
  )
}

export default FakeScene
