import { Button } from "../ui/button";
import Canvas from "./cyto/canvas";

export default function Body() {
  return (
    <div id="main" className="my-16 h-[90vh]">
      <Canvas />
      <div className="flex justify-center items-center mt-7">
        <Button>Solve</Button>
      </div>
      {/*
       * This section to display solution tables
       */}
    </div>
  );
}
