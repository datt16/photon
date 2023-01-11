import {
  useOutsideClick,
  Input,
  VStack,
  Button,
  useToast,
  Textarea,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useEditorStore } from "../../../../../libs/EditorStore"
import useAnnotation from "../../../hooks/useAnnotation"

const AnnotationEditor = (props: {
  isEditorOpen: boolean
  setIsEditorOpen: (next: boolean) => void
  onCanceled?: () => void
}): JSX.Element => {
  const { isEditorOpen, setIsEditorOpen, onCanceled } = props

  const [isSubmit, setSubmit] = useState(false)
  const dialogRootRef = useRef(null)
  const inputTitleRef = useRef<HTMLInputElement>(null)
  const inputDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const toast = useToast()

  const { submitData } = useAnnotation()

  const {
    currentPickedPointWindow: { x, y },
  } = useEditorStore()

  // 表示時の処理
  useEffect(() => {
    inputDescriptionRef.current?.focus()
  }, [isEditorOpen])

  // 外側タップ時にエディタを閉じる
  useOutsideClick({
    ref: dialogRootRef,
    handler: () => {
      setIsEditorOpen(false)
    },
  })

  useEffect(() => {
    if (isEditorOpen == false) {
      if (onCanceled && !isSubmit) onCanceled()
    }
  }, [isEditorOpen, isSubmit, onCanceled])

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
          <Input required ref={inputTitleRef} placeholder="注釈のタイトル" />
          <Textarea ref={inputDescriptionRef} placeholder="注釈の詳細" />
          <Button
            size={"sm"}
            onClick={() => {
              submitData({
                title: inputTitleRef.current?.value,
                description: inputDescriptionRef.current?.value,
              })
              setSubmit(true)
              setIsEditorOpen(false)
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
