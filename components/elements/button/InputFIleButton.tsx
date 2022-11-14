import { Button, ResponsiveValue } from "@chakra-ui/react"
import { ChangeEventHandler, ReactNode, useRef } from "react"

interface InputFIleButtonProps {
  name: string
  size?: ResponsiveValue<(string & {}) | "sm" | "md" | "lg" | "xs">
  onChange?: ChangeEventHandler<HTMLInputElement>
  children?: ReactNode
}

const InputFIleButton = (props: InputFIleButtonProps) => {
  const { onChange, size, name, children } = props
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name={name}
        hidden
        onChange={onChange}
      />
      <Button
        size={size}
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        {children}
      </Button>
    </>
  )
}

export default InputFIleButton
