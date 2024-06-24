import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

export default function Tables({ paths, solution, phases }: any) {
  function renderTables() {
    const tables = [];

    const phasesArray = Object.entries(phases);
    phasesArray.sort((a: any, b: any) => b[1] - a[1]);
    const descPhases = Object.fromEntries(phasesArray);

    const values: any[] = Object.values(descPhases);
    const lastPhase = Math.max(...values);

    for (let i = lastPhase; i >= 1; i--) {
      const phaseNodes = Object.keys(descPhases).filter(
        (key) => phases[key] === i
      );

      const phaseNodesInfo = phaseNodes.reduce((acc: any, node) => {
        if (solution[node]) {
          acc[node] = solution[node];
        }
        return acc;
      }, {});

      if (i == lastPhase) {
        tables.push(createInitialTable(i, phaseNodesInfo));
      } else {
        tables.push(createOtherTables(i, phaseNodesInfo));
      }
    }
    return tables;
  }

  function createInitialTable(phase: number, phaseNodes: any[]) {
    return (
      <div className="mt-5">
        <h3 className="m-3 font-semibold">Phase {phase}</h3>
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">s</TableHead>
              <TableHead className="text-center">f(s,x)</TableHead>
              <TableHead className="text-center">x</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(phaseNodes).map((node: any) => (
              <TableRow key={node}>
                <TableCell>{node}</TableCell>
                <TableCell>{phaseNodes[node]["f(s,x)"]}</TableCell>
                <TableCell>{phaseNodes[node]["x"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  function createOtherTables(phase: number, phaseNodes: any[]) {
    const uniqueKeys = Array.from(
      new Set(
        Object.keys(phaseNodes).flatMap((node: any) =>
          Object.keys(phaseNodes[node]["f(s,x)"])
        )
      )
    );

    return (
      <div className="mt-5">
        <h3 className="m-3 font-semibold">Phase {phase}</h3>
        <Table className="text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">s</TableHead>
              {uniqueKeys.map((key) => (
                <TableHead className="text-center" key={key}>
                  {key}
                </TableHead>
              ))}
              <TableHead className="text-center">f</TableHead>
              <TableHead className="text-center">x</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(phaseNodes).map((node: any) => (
              <TableRow key={node}>
                <TableCell>{node}</TableCell>
                {uniqueKeys.map((key) => (
                  <TableCell key={`${node}-${key}`}>
                    {phaseNodes[node]["f(s,x)"][key] !== undefined
                      ? phaseNodes[node]["f(s,x)"][key]
                      : "-"}{" "}
                  </TableCell>
                ))}
                <TableCell>{phaseNodes[node]["f"]}</TableCell>
                <TableCell>{phaseNodes[node]["x"].join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  useEffect(() => {
    renderTables();
  }, []);

  return (
    <div className="mt-20">
      <div>
        <h2 className="text-lg font-bold text-center">Best Paths</h2>
        <div className="m-5">
          {Object.keys(paths).map((pathKey) => (
            <div key={pathKey} className="m-3">
              <h3 className="font-semibold">{pathKey}</h3>
              <div className="flex gap-10 ml-5">
                <p>Nodes: {paths[pathKey].nodes.join(" -> ")}</p>
                <p>Sum: {paths[pathKey].sum}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-center">Tables</h2>
      {renderTables()}
    </div>
  );
}
