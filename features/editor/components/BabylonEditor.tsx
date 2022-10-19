import BabylonScene from "../../../components/babylon/BabylonScene"
import { onEditorRendered, onEditorReady } from "../logic/BabylonEditorCommonLogic"

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