import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
} from "@chakra-ui/react"
import React from "react"
import InspectorPanelIcon from "./InspectorPanelIcon"
import { MeshDataItem, NodeItemType, SceneMeshData } from "photon-babylon"
import { Scene } from "@babylonjs/core"

interface InspectorProps {
  meshList: SceneMeshData
  scene?: Scene
  onClickMeshItem?: (item: MeshDataItem) => void
  onClickNodeItem?: (item: NodeItemType) => void
}

const Inspector = (props: InspectorProps) => {
  const { meshList, onClickMeshItem, onClickNodeItem } = props
  return (
    <Accordion
      allowMultiple
      backgroundColor="ButtonFace"
      w="100%"
      maxH={"80vh"}
      overflow={"auto"}
      overflowX={"auto"}
    >
      {Object.keys(meshList).map((key) => {
        return meshList[key].isInspectorVisible ? (
          <AccordionItem key={key + meshList[key].name}>
            <AccordionButton
              alignContent="center"
              onClick={() => {
                if (onClickNodeItem) onClickNodeItem(meshList[key])
              }}
            >
              <AccordionIcon />
              <Text ml={2} color="WindowText">
                {key}
              </Text>
            </AccordionButton>
            {meshList[key].child ? (
              <AccordionPanel>
                {meshList[key].child.map((meshItem) =>
                  meshItem.isInspectorVisible ? (
                    <AccordionItem key={meshItem.name + meshItem.uid}>
                      <AccordionButton
                        alignContent="center"
                        onClick={() => {
                          if (onClickMeshItem) onClickMeshItem(meshItem)
                        }}
                      >
                        <InspectorPanelIcon meshType={meshItem.type} />
                        <Text ml={2} color="WindowText">
                          {meshItem.name}
                        </Text>
                      </AccordionButton>
                    </AccordionItem>
                  ) : null
                )}
              </AccordionPanel>
            ) : null}
          </AccordionItem>
        ) : null
      })}
    </Accordion>
  )
}

export default Inspector
