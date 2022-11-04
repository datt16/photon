import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputAddon,
  ButtonGroup,
} from "@chakra-ui/react"
import { Vector3 } from "babylonjs"

export interface position {
  x: number
  y: number
  z: number
}

const AddButtonWithControl = (
  label: string,
  state: position,
  setValue: (newValue: position) => void,
  onButtonClicked = (position: Vector3) => {}
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
                setValue({ x: Number(e.target.value), y, z })
              }
            />
          </InputGroup>
          <InputGroup size={"xs"} maxW={"4rem"}>
            <InputAddon>y</InputAddon>
            <Input
              value={y}
              color={"white"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ x, y: Number(e.target.value), z })
              }
            />
          </InputGroup>
          <InputGroup size={"xs"} maxW={"4rem"}>
            <InputAddon>z</InputAddon>
            <Input
              color={"white"}
              value={z}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue({ x, y, z: Number(e.target.value) })
              }
            />
          </InputGroup>
        </HStack>
      </ButtonGroup>
    </div>
  )
}

export default AddButtonWithControl
