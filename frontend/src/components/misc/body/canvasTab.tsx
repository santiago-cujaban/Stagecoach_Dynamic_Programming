import { useRef, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Cyto from "./canvas/cytoscape";

export default function CanvasTab() {
  const createEdgeRef = useRef<() => void>(null);
  const changeNodeLabelRef =
    useRef<(nodeId: any, newLabel: string) => void>(null);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  const handleSelectionChange = (nodes: any[]) => {
    setSelectedNodes(nodes);
  };

  const handleEditNodeLabel = () => {
    const newLabel = window.prompt("Enter new label for the node:");
    if (newLabel !== null) {
      changeNodeLabelRef.current &&
        changeNodeLabelRef.current(selectedNodes[1], newLabel);
    }
  };

  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Nodes</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={handleEditNodeLabel}
              disabled={selectedNodes.length == 1}
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
        onSelectionChange={handleSelectionChange}
        onChangeNodeLabel={changeNodeLabelRef}
      />
    </div>
  );
}
