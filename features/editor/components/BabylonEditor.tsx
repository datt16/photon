import BabylonScene from "../../../components/babylon/BabylonScene"
import { onEditorRendered, onEditorReady } from "../logic/Common"

const BabylonEditor = () => {
    return (
        <BabylonScene
            antialias
            onSceneReady={onEditorReady}
            onRender={onEditorRendered}
        />
    )
}

export default BabylonEditor