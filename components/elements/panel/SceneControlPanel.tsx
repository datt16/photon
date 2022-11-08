import { Scene, Vector3 } from "@babylonjs/core"
import { Button, VStack, Text, Divider } from "@chakra-ui/react"
import AddButtonWithControl from "../button/AddButtonWithPosition"

export enum PanelButtonType {
  "default",
  "vector3",
  "section",
}

interface PanelButtonProps {
  buttonType: PanelButtonType
  label: string
  onButtonClicked?: <T>(param: T) => void
  state?: Vector3
  onStateChanged?: (newState: Vector3) => void
}

const SceneControlPanel: React.FC<{
  data: PanelButtonProps[]
}> = ({ data }) => {
  const panelItems = data.map((property, index) => {
    switch (property.buttonType) {
      case PanelButtonType.default:
        return (
          <section key={property.label}>
            <Button size="xs" onClick={property.onButtonClicked}>
              {property.label}
            </Button>
          </section>
        )
      case PanelButtonType.section:
        return index == 0 ? (
          <section key={property.label}>
            <Text fontSize={"xs"} color={"whiteAlpha.900"}>
              {property.label}
            </Text>
          </section>
        ) : (
          <section key={property.label}>
            <Divider />
            <Text fontSize={"xs"} color={"whiteAlpha.900"}>
              {property.label}
            </Text>
          </section>
        )
      case PanelButtonType.vector3:
        return (
          <section key={property.label}>
            {AddButtonWithControl(
              property.label,
              property.state!,
              property.onStateChanged!,
              property.onButtonClicked
            )}
          </section>
        )
    }
  })

  return (
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
    >
      {panelItems}
    </VStack>
  )
}

export default SceneControlPanel
