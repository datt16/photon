import { Engine, GizmoManager, Ground, Plane, Scene, SceneEventArgs, useBeforeRender, useClick, useHover } from "react-babylonjs"
import React, { Ref, useRef, useState } from "react"
import { Nullable } from "babylonjs"
import { Mesh, Vector3, Color3, Scene as BabylonScene, AbstractMesh, BoundingBoxGizmo, UtilityLayerRenderer, Observable } from "@babylonjs/core"
import { GridMaterial } from "babylonjs-materials"

interface SpinningBoxProps {
  name: string,
  position: Vector3,
  color: Color3,
  hoveredColor: Color3
}

const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)

const onSceneMount = (props: SceneEventArgs) => {
  const scene = props.scene
  const leftBox = props.scene.getMeshByName('left')
  console.log(scene.meshes)
  console.log(scene.cameras)
}

const SpinningBox = (props: SpinningBoxProps) => {
  const boxRef = useRef<Nullable<Mesh>>(null)
  const [clicked, setClicked] = useState(false)
  useClick(() => setClicked((clicked) => !clicked), boxRef)

  const [hovered, setHovered] = useState(false)
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    boxRef
  )

  const rpm = 5
  useBeforeRender((scene) => {
    if (boxRef.current) {
      var deltaTimeInMillis = scene.getEngine().getDeltaTime()
      boxRef.current.rotation.y += (rpm / 60) * Math.PI * 10 * (deltaTimeInMillis / 1000)
    }
  })

  return (
    <box
      name={props.name}
      ref={boxRef}
      size={2}
      position={props.position}
      scaling={clicked ? BiggerScale : DefaultScale}
    >
      <standardMaterial
        name={`${props.name}-mat`}
        diffuseColor={hovered ? props.hoveredColor : props.color}
        specularColor={Color3.Black()}
      />
    </box>
  )
}

const ReactBabylonScenePage = () => {
  return(
  <div>
    <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
      <Scene onSceneMount={onSceneMount}>
        <arcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={Math.PI / 2}
          beta={Math.PI / 4}
          radius={8} />

        <hemisphericLight
          name="light1"
          intensity={0.7}
          direction={Vector3.Up()}
        />

        <SpinningBox
          name="left"
          position={new Vector3(-2, 0, 0)}
          color={Color3.FromHexString('#EEB5EB')}
          hoveredColor={Color3.FromHexString('#C26DBC')}
        />
        <SpinningBox
          name="right"
          position={new Vector3(2, 0, 0)}
          color={Color3.FromHexString('#C8F4F9')}
          hoveredColor={Color3.FromHexString('#3CACAE')}
        />
      </Scene>
    </Engine>
  </div>
)

}

export default ReactBabylonScenePage
