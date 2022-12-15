import { Vector3 } from "@babylonjs/core"
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputAddon,
  ButtonGroup,
} from "@chakra-ui/react"

const AddButtonWithControl = (
  label: string,
  state: Vector3,
  setValue: (newValue: Vector3) => void,
  onButtonClicked: (position: Vector3) => void
) => {
  const { x, y, z } = state

  return (
    <div>
      <ButtonGroup isAttached>
        <Button size="xs" onClick={() => onButtonClicked(new Vector3(x, y, z))}>
          {label}
        </Button>
        <HStack>
          <InputGroup size={"xs"} maxW={"4rem"}>
            <InputAddon>x</InputAddon>
            <Input
              color={"white"}
              value={x}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(new Vector3(Number(e.target.value), y, z))
              }
            />
          </InputGroup>
          <InputGroup size={"xs"} maxW={"4rem"}>
            <InputAddon>y</InputAddon>
            <Input
              value={y}
              color={"white"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(new Vector3(x, Number(e.target.value), z))
              }
            />
          </InputGroup>
          <InputGroup size={"xs"} maxW={"4rem"}>
            <InputAddon>z</InputAddon>
            <Input
              color={"white"}
              value={z}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(new Vector3(x, y, Number(e.target.value)))
              }
            />
          </InputGroup>
        </HStack>
      </ButtonGroup>
    </div>
  )
}

export default AddButtonWithControl
