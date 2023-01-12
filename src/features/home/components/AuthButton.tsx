import { Button, ChakraComponent } from "@chakra-ui/react"

type DivComponent = ChakraComponent<"div", object>

const AuthButton = (() => {
  return (
    <Button width={"100%"} size={"lg"}>
      ログイン
    </Button>
  )
}) as DivComponent

export default AuthButton
