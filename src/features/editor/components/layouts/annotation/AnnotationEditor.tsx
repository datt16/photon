import {
  useOutsideClick,
  Input,
  VStack,
  Button,
  useToast,
  Textarea,
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
  const inputTitleRef = useRef<HTMLInputElement>(null)
  const inputDescriptionRef = useRef<HTMLTextAreaElement>(null)
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
          onBlur={() => setIsEditing(false)}
        >
          <Input
            ref={inputTitleRef}
            placeholder="注釈のタイトル"
            onFocus={() => setIsEditing(true)}
          />
          <Textarea
            ref={inputDescriptionRef}
            placeholder="注釈の詳細"
            onFocus={() => setIsEditing(true)}
          />
          <Button
            size={"sm"}
            onClick={() => {
              submitData({
                title: inputTitleRef.current?.value,
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
