import { useRef, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Cyto from "./cyto/cyto";
import { resolveData } from "./cyto/logic";

export default function Canvas() {
  const createEdgeRef = useRef<() => void>(null);
  const changeNodeLabelRef =
    useRef<(nodeId: any, newLabel: string) => void>(null);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  function handleSelectionChange(nodes: any[]) {
    setSelectedNodes(nodes);
  }

  function handleEditNodeLabel() {
    if (selectedNodes.length === 1) {
      const newLabel = window.prompt(
        `Enter new label for the node with ID ${selectedNodes[0]}`
      );
      if (newLabel !== null) {
        changeNodeLabelRef.current &&
          changeNodeLabelRef.current(selectedNodes[0], newLabel);
      }
    }
  }

  async function handleOnSendElements(elements: any[]) {
    const { paths, solution, phases } = await resolveData(elements); // Send this data to new script tables
    console.log(paths, solution, phases);
  }

  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Nodes</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={handleEditNodeLabel}
              disabled={selectedNodes.length !== 1}
            >
              Edit
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Paths</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() => {
                createEdgeRef.current && createEdgeRef.current();
              }}
              disabled={selectedNodes.length !== 2}
            >
              New
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Cyto
        onCreateEdge={createEdgeRef}
        onChangeNodeLabel={changeNodeLabelRef}
        onSelectionChange={handleSelectionChange}
        onSendElements={handleOnSendElements}
      />
    </div>
  );
}
