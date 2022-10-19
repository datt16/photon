import { ArcRotateCamera, MeshBuilder, Scene, Vector3 } from "babylonjs"

const onEditorReady = (scene: Scene) => {
    new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        new Vector3(0, 0, 0),
        scene
    ).attachControl(true)

    MeshBuilder.CreateBox(
        "box1",
        {
            size: 1
        },
        scene)

}

const onEditorRendered = (scene: Scene) => {

}

export { onEditorReady, onEditorRendered }
