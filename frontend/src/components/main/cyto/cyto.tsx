import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import CytoscapeComponent from "react-cytoscapejs";

export default function Cyto({
  onCreateEdge,
  onSelectionChange,
  onChangeNodeLabel,
  onSendElements,
}: any) {
  const [elements, setElements] = useState<any[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);
  const [isGraphSaved, setIsGraphSaved] = useState<boolean>(false);

  function getNodeCount() {
    return elements.filter(
      (element: any) => !element.data.source && !element.data.target
    ).length;
  }

  function handleCreateNode(event: any) {
    const { position } = event;
    const newNodeId = getNodeCount() + 1;
    const newNode = {
      data: { id: newNodeId, label: `Node ${getNodeCount() + 1}` },
      position: { x: position.x, y: position.y },
    };

    const updatedElements = [...elements, newNode];
    setElements(updatedElements);
  }

  function handleSelectNodes(event: any) {
    const nodeId = event.target.id();
    const updatedSelectedNodes = [...selectedNodes, nodeId];
    if (updatedSelectedNodes.length > 2) {
      setSelectedNodes([]);
      onSelectionChange([]);
    } else {
      setSelectedNodes(updatedSelectedNodes);
      onSelectionChange(updatedSelectedNodes);
    }
  }

  function handleCreateEdge() {
    if (selectedNodes.length === 2) {
      const [source, target] = selectedNodes;
      const edgeExists = elements.some(
        (element: any) =>
          element.data.source === source && element.data.target === target
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

      setSelectedNodes([]);
      onSelectionChange([]);
    }
  }

  function changeNodeLabel(nodeId: any, newLabel: any) {
    const updatedElements = elements.map((element: any) => {
      if (element.data.id === nodeId) {
        return {
          ...element,
          data: {
            ...element.data,
            label: newLabel,
          },
        };
      }
      return element;
    });
    setElements(updatedElements);
    setSelectedNodes([]);
    onSelectionChange([]);
  }

  function handleOnSendElements() {
    if (onSendElements) {
      onSendElements(elements);
    }
  }

  function handleSaveGraph() {
    localStorage.setItem("graph", JSON.stringify(elements));
    setIsGraphSaved(true);
  }

  function handleLoadGraph() {
    const savedGraph = localStorage.getItem("graph");
    if (savedGraph) {
      setElements(JSON.parse(savedGraph));
      setIsGraphSaved(true);
    }
  }

  function handleCleanGraph() {
    localStorage.removeItem("graph");
    setIsGraphSaved(false);
  }

  useEffect(() => {
    const savedGraph = localStorage.getItem("graph");
    if (savedGraph) {
      setIsGraphSaved(true);
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key === "graph") {
        setIsGraphSaved(localStorage.getItem("graph") !== null);
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (onCreateEdge) {
      onCreateEdge.current = handleCreateEdge;
    }
  }, [handleCreateEdge, onCreateEdge]);

  useEffect(() => {
    if (onChangeNodeLabel) {
      onChangeNodeLabel.current = changeNodeLabel;
    }
  }, [changeNodeLabel, onChangeNodeLabel]);

  return (
    <>
      <CytoscapeComponent
        elements={elements}
        style={{ height: "510px", background: "hsl(0, 0%, 76%)" }}
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
              handleCreateNode(event);
            }
          });

          cy.on("tap", "node", (event) => {
            handleSelectNodes(event);
          });
        }}
        stylesheet={[
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              "line-color": "#9dbaea",
              "target-arrow-color": "#9dbaea",
              "font-size": "10px",
              label: "data(weight)",
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
      <div className="flex justify-center items-center mt-7 gap-5">
        <Button onClick={handleOnSendElements}>Solve</Button>
        {!isGraphSaved ? (
          <Button variant="secondary" onClick={handleSaveGraph}>
            Save Graph
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={handleLoadGraph}>
              Load Graph
            </Button>
            <Button variant="destructive" onClick={handleCleanGraph}>
              Clear Saved Graph
            </Button>
          </>
        )}
      </div>
    </>
  );
}
