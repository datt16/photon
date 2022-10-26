import { EngineOptions, SceneOptions } from '@babylonjs/core'
import { Engine, Scene } from 'babylonjs'
import React, { useEffect, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'

export interface PropTypes {
    antialias?: boolean
    engineOptions?: EngineOptions
    adaptToDeviceRatio?: boolean
    sceneOptions?: SceneOptions
    onRender: (scene: Scene) => void
    onSceneReady: (scene: Scene) => void
}

const BabylonSceneProvider = (props: PropTypes) => {

    const {
        antialias,
        engineOptions,
        adaptToDeviceRatio,
        sceneOptions,
        onRender,
        onSceneReady
    } = props

    const reactCanvas = useRef(null)

    useEffect(() => {
        const { current: canvas } = reactCanvas
        const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio)
        const scene = new Scene(engine, sceneOptions)

        const resize = () => {
            scene.getEngine().resize()
        }

        // windowのイベントリスナにリサイズの処理を追加
        if (window) {
            window.addEventListener("resize", resize)
        }

        // シーンの準備ができたらonSceneReady()で描画を始める
        if (scene.isReady()) {
            onSceneReady(scene)
        } else {
            scene.onReadyObservable.addOnce((scene) => onSceneReady(scene))
        }

        // 以降描画し続けるための処理
        engine.runRenderLoop(() => {
            if (typeof onRender === "function") onRender(scene)
            scene.render()
        })


        // コンポーネントがディスポーズされたとき
        return () => {
            scene.getEngine().dispose()
            if (window) {
                window.removeEventListener("resize", resize)
            }
        }


    }, [reactCanvas])

    return (
        <Div100vh
            style={{
                overflow: 'hidden'
            }}>
            <canvas
                ref={reactCanvas}
                style={
                    {
                        width: '100%',
                        height: '100%',
                        outline: 'none',
                    }
                }
            />
        </Div100vh>
    )
}

export default BabylonSceneProvider
