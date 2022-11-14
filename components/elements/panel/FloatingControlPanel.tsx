import { ScaleFade, VStack } from "@chakra-ui/react"
import { ReactNode, useState } from "react"

export enum PanelButtonType {
  "default",
  "vector3",
  "section",
}

const FloatingControlPanel = ({ children }: { children: ReactNode }) => {

  const [isPanelOpen, setPanelOpen] = useState(true)

  return (
    <ScaleFade initialScale={0.9} in={isPanelOpen}>
      <VStack
        mt={"1rem"}
        ml={"1rem"}
        alignItems={"start"}
        p="6px"
        display="flex"
        borderRadius="lg"
        border={"1px solid"}
        borderColor={"whiteAlpha.400"}
        position="fixed"
        zIndex={100}
        shadow='md'
        rounded='md'
      >
        <div>
          {children}
        </div>
      </VStack>
    </ScaleFade>
  )
}

export default FloatingControlPanel
