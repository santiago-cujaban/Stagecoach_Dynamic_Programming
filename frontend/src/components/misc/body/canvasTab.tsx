import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Cyto from "./canvas/cytoscape";

export default function CanvasTab() {
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
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Edit</MenubarItem>
            <MenubarItem>Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Cyto />
    </div>
  );
}
