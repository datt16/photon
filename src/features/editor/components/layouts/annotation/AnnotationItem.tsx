import { Card, CardHeader, CardBody } from "@chakra-ui/card"
import { HStack, Avatar, Heading, Box, Text } from "@chakra-ui/react"

const AnnotationItem = (props: {
  index?: number
  title?: string
  user?: string
  description?: string
}): JSX.Element => {
  const { index, title, user, description } = props

  return (
    <Card m={0} borderRadius={0} variant="filled" minWidth={300}>
      <CardHeader pb={0}>
        <HStack gap={1}>
          <Avatar
            name={index?.toString()}
            size={"sm"}
            background="ButtonFace"
          ></Avatar>
          <Box>
            <Heading size={"sm"}>{title}</Heading>
            <Text fontSize={"xs"} size={""} color={"GrayText"}>
              {user}
            </Text>
          </Box>
        </HStack>
      </CardHeader>
      <CardBody py={2}>
        <Text fontSize="sm">{description}</Text>
      </CardBody>
    </Card>
  )
}

export default AnnotationItem
