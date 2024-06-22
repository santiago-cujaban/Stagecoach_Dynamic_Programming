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
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  const handleSelectionChange = (nodes: any[]) => {
    setSelectedNodes(nodes);
  };

  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Nodes</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Edit</MenubarItem>
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
            <MenubarItem>Edit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Cyto
        onCreateEdge={createEdgeRef}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
