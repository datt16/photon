import {
  useOutsideClick,
  Input,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import { useEditorStore } from "../../../../../libs/EditorStore"
import useAnnotation from "../../../hooks/useAnnotation"

const AnnotationEditor = (props: {
  isEditorOpen: boolean
  setIsEditorOpen: (next: boolean) => void
  onDismiss?: () => void
}): JSX.Element => {
  const { isEditorOpen, setIsEditorOpen } = props

  const dialogRootRef = useRef(null)
  const inputDescriptionRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const { submitData, setIsEditing } = useAnnotation()

  // 外側タップ時にエディタを閉じる
  useOutsideClick({
    ref: dialogRootRef,
    handler: () => {
      console.log("Out side clicked")
      setIsEditorOpen(false)
    },
  })

  const {
    currentPickedPointWindow: { x, y },
  } = useEditorStore()

  // 表示時の処理
  useEffect(() => {
    inputDescriptionRef.current?.focus()
  }, [isEditorOpen])

  return (
    <>
      {isEditorOpen ? (
        <VStack
          ref={dialogRootRef}
          left={x}
          top={y}
          position={"fixed"}
          zIndex={101}
          background="Background"
        >
          <Input
            ref={inputDescriptionRef}
            placeholder="注釈書くところ"
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          ></Input>
          <Button
            onClick={() => {
              submitData({
                description: inputDescriptionRef.current?.value,
              })
              setIsEditorOpen(false)
              setIsEditing(false)
              toast({
                title: "注釈を追加しました",
                duration: 5000,
                status: "success",
                isClosable: true,
              })
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
