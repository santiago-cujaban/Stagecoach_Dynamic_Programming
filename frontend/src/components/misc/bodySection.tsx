import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CanvasTab from "./body/canvasTab";
import TablesTab from "./body/tablesTab";
import { Button } from "../ui/button";

export default function BodySection() {
  return (
    <div id="main" className="my-16 h-[90vh]">
      <Tabs defaultValue="canvas">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>
        <TabsContent value="canvas">
          <CanvasTab />
        </TabsContent>
        <TabsContent value="tables">
          <TablesTab />
        </TabsContent>
      </Tabs>
      <div className="flex justify-center items-center mt-7">
        <Button>Solve</Button>
      </div>
    </div>
  );
}
