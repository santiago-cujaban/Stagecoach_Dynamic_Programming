import { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const Cyto = () => {
  const initialElements: any = [];

  const [elements, setElements] = useState(initialElements);

  function handleCanvasClick(event: any) {
    console.log(elements);
    const { position } = event;
    const newNodeId = elements.length + 1;
    const newNode = {
      data: { id: newNodeId, label: `Node ${elements.length + 1}` },
      position: { x: position.x, y: position.y },
    };

    // Clone existing elements and update only the new node's position
    const updatedElements = [...elements, newNode];
    setElements(updatedElements);
  }

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ height: "510px", background: "#C3C3C3" }}
      cy={(cy) => {
        cy.on("cxttap", "node", (event) => {
          cy.remove(event.target);
        });

        cy.on("tap", (event) => {
          if (event.target === cy) {
            handleCanvasClick(event);
          }
        });
      }}
    />
  );
};

export default Cyto;
