import BabylonSceneProvider from "../../../components/babylon/BabylonSceneProvider"
import { onEditorRendered, onEditorReady } from "../logic/Common"

const BabylonEditor = () => {
    return (
        <BabylonSceneProvider
            antialias
            onSceneReady={onEditorReady}
            onRender={onEditorRendered}
        />
    )
}

export default BabylonEditor
