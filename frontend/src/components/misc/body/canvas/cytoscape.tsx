import { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

const Cyto = ({ onCreateEdge, onSelectionChange }: any) => {
  const initialElements: any = [];

  const [elements, setElements] = useState(initialElements);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  const getNodeCount = () => {
    return elements.filter(
      (element: any) => !element.data.source && !element.data.target
    ).length;
  };

  function createNodes(event: any) {
    const { position } = event;
    const newNodeId = getNodeCount() + 1;
    const newNode = {
      data: { id: newNodeId, label: `Node ${getNodeCount() + 1}` },
      position: { x: position.x, y: position.y },
    };

    const updatedElements = [...elements, newNode];
    setElements(updatedElements);
  }

  function selectNodes(event: any) {
    const nodeId = event.target.id();
    const updatedSelectedNodes = [...selectedNodes, nodeId].slice(-2); // Ensure only two nodes are selected
    setSelectedNodes(updatedSelectedNodes);
    onSelectionChange(updatedSelectedNodes);
  }

  const handleCreateEdge = () => {
    if (selectedNodes.length === 2) {
      const [source, target] = selectedNodes;

      // Check if edge already exists
      const edgeExists = elements.some(
        (element: any) =>
          (element.data.source === source && element.data.target === target) ||
          (element.data.source === target && element.data.target === source)
      );

      if (!edgeExists) {
        const weightInput = window.prompt("Enter the weight for the edge:");

        if (weightInput !== null) {
          const weight = parseFloat(weightInput);

          if (!isNaN(weight)) {
            const newEdge = {
              data: { id: `edge-${source}-${target}`, source, target, weight },
            };

            const updatedElements = [...elements, newEdge];
            setElements(updatedElements);
          } else {
            alert("Please enter a valid number for the edge weight.");
          }
        }
      }

      setSelectedNodes([]); // Reset selected nodes after creating an edge
      onSelectionChange([]);
    }
  };

  useEffect(() => {
    if (onCreateEdge) {
      onCreateEdge.current = handleCreateEdge;
    }
  }, [handleCreateEdge, onCreateEdge]);

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ height: "510px", background: "#C3C3C3" }}
      cy={(cy) => {
        cy.on("cxttap", "node", (event) => {
          const nodeId = event.target.id();
          const updatedElements = elements.filter(
            (element: any) =>
              element.data.id !== nodeId &&
              element.data.source !== nodeId &&
              element.data.target !== nodeId
          );
          setElements(updatedElements);
          cy.remove(event.target);
        });

        cy.on("cxttap", "edge", (event) => {
          const edgeId = event.target.id();
          const updatedElements = elements.filter(
            (element: any) => element.data.id !== edgeId
          );
          setElements(updatedElements);
          cy.remove(event.target);
        });

        cy.on("tap", (event) => {
          if (event.target === cy) {
            createNodes(event);
          }
        });

        cy.on("tap", "node", (event) => {
          console.log(elements);
          selectNodes(event);
        });
      }}
      layout={{ name: "preset" }} // Example layout, adjust as per your needs
      stylesheet={[
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "line-color": "#9dbaea",
            "target-arrow-color": "#9dbaea",
            "font-size": "10px",
            label: "data(weight)", // Display weight as edge label
            "text-background-opacity": 1,
            "text-background-color": "#ffffff",
            "text-background-padding": "3px",
          },
        },
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-wrap": "wrap",
            "text-valign": "top",
            "text-halign": "center",
          },
        },
      ]}
    />
  );
};

export default Cyto;
