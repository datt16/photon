import { Button, ResponsiveValue, Tooltip } from "@chakra-ui/react"
import { ChangeEventHandler, ReactNode, useRef } from "react"

interface InputFIleButtonProps {
  name: string
  size?: ResponsiveValue<string | "sm" | "md" | "lg" | "xs">
  onChange?: ChangeEventHandler<HTMLInputElement>
  children?: ReactNode
  labelText?: string
}

const InputFileButton = (props: InputFIleButtonProps) => {
  const { onChange, size, name, children, labelText } = props
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
      <Tooltip label={labelText} hasArrow>
        <Button
          size={size}
          onClick={() => {
            inputRef.current?.click()
          }}
        >
          {children}
        </Button>
      </Tooltip>
    </>
  )
}

export default InputFileButton
