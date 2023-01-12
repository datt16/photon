import { Center, Heading, Box, Text, ChakraComponent } from "@chakra-ui/react"

type DivComponent = ChakraComponent<"div", object>

const Title = (() => {
  return (
    <Center>
      <Box>
        <Heading>PHOTON</Heading>
        <Text fontSize={"large"} letterSpacing={"wider"} textAlign={"center"}>
          3D FILE EDITOR
        </Text>
      </Box>
    </Center>
  )
}) as DivComponent

export default Title
