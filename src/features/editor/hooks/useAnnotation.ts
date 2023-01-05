import { useAnnotateStore } from "../../../libs/AnnotateStore"
import { useEditorStore } from "../../../libs/EditorStore"

const useAnnotation = () => {
  const {
    editingAnnotation: current,
    editNewAnnotation: editStoreData,
    submit: _submit,
    setIsEditing,
  } = useAnnotateStore()
  const { currentPickedPoint: targetPosition } = useEditorStore()

  /**
   * **入力した注釈情報を保存するメソッド**
   *
   * ### param
   * @param data 入力されたフォームの情報
   *
   * ### memo
   * - 送信時にまとめてデータを受け取ることでレンダー数を節約
   * - setStateでformの値を監視すると変更される度にレンダーが走る
   */
  const submitData = (data: { title?: string; description?: string }) => {
    const title = data.title ?? current.title
    const description = data.description ?? current.description
    editStoreData({ ...current, title, description, targetPosition })
    _submit()
  }

  return {
    submitData,
    setIsEditing,
  }
}

export default useAnnotation
