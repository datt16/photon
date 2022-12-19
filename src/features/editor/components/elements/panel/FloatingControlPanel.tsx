import { Box, ScaleFade } from "@chakra-ui/react"
import { ReactNode, useState } from "react"
const FloatingControlPanel = ({
  children,
}: {
  children: ReactNode[] | ReactNode
}) => {
  const [isPanelOpen] = useState(true)

  return (
    <ScaleFade initialScale={0.9} in={isPanelOpen}>
      <Box
        mt={"1rem"}
        ml={"1rem"}
        alignItems={"start"}
        display="flex"
        borderRadius="lg"
        position="fixed"
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
