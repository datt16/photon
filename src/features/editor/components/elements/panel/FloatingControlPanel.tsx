import { Box, ScaleFade } from "@chakra-ui/react"
import { ReactNode, useState } from "react"
const FloatingControlPanel = ({
  children,
  position = "left",
}: {
  children: ReactNode[] | ReactNode
  position?: "left" | "right"
}) => {
  const [isPanelOpen] = useState(true)

  return (
    <ScaleFade initialScale={0.9} in={isPanelOpen}>
      <Box
        my={"1rem"}
        mx={"1rem"}
        alignItems={"start"}
        display="flex"
        borderRadius="lg"
        position="fixed"
        right={position == "right" ? 0 : "auto"}
        left={position == "left" ? 0 : "auto"}
        zIndex={100}
        shadow="md"
        rounded="md"
        maxHeight={"10vh"}
        overflow={"inherit"}
      >
        <div>{children}</div>
      </Box>
    </ScaleFade>
  )
}

export default FloatingControlPanel
