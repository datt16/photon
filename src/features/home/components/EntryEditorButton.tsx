import { Center, Text, ChakraComponent, Card } from "@chakra-ui/react"

type DivComponent = ChakraComponent<"div", object>

const EntryEditorButton = (() => {
  return (
    <Card
      textColor={"white"}
      minW={300}
      background="cyan.500"
      p={16}
      borderRadius={16}
      shadow={0}
    >
      <Center>
        <Text fontSize={"5xl"} fontWeight={"bold"}>
          エディタを開く
        </Text>
      </Center>
      <Text mt={"2rem"}>
        3Dファイルの閲覧・簡易編集・注釈の追加ができるエディタを開きます
      </Text>
    </Card>
  )
}) as DivComponent

export default EntryEditorButton
