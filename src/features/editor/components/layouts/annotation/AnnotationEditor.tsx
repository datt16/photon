import { useOutsideClick, Input, VStack, Button } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import { useAnnotateStore } from "../../../../../libs/AnnotateStore"
import { useEditorStore } from "../../../../../libs/EditorStore"

const AnnotationEditor = (props: {
  isEditorOpen: boolean
  setIsEditorOpen: (next: boolean) => void
}): JSX.Element => {
  const { isEditorOpen, setIsEditorOpen } = props

  const ref = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useOutsideClick({
    ref: ref,
    handler: () => {
      console.log("Out side clicked")
      setIsEditorOpen(false)
    },
  })

  const {
    currentPickedPointWindow: { x, y },
  } = useEditorStore()

  const { setIsEditing } = useAnnotateStore()

  // 表示時にフォーカス
  useEffect(() => {
    inputRef.current?.focus()
  }, [isEditorOpen])

  return (
    <>
      {isEditorOpen ? (
        <VStack
          ref={ref}
          left={x}
          top={y}
          position={"fixed"}
          zIndex={101}
          background="Background"
        >
          <Input
            ref={inputRef}
            placeholder="注釈書くところ"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          ></Input>
          <Button
            onClick={() => {
              setIsEditorOpen(false)
              setIsEditing(false)
            }}
          >
            Submit
          </Button>
        </VStack>
      ) : (
        <></>
      )}
    </>
  )
}

export default AnnotationEditor
