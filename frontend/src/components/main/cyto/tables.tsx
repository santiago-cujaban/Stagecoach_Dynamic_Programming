import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function Tables({ paths, solution, phases }: any) {
  const [tableJSX, setTableJSX] = useState<JSX.Element | null>(null);

  function createInitialTable() {
    console.log(solution);
    const values: any[] = Object.values(phases);
    const lastPhase = Math.max(...values);
    const lastPhaseNodes = Object.keys(phases).filter(
      (key) => phases[key] === lastPhase
    );

    const lastPhaseInfo = lastPhaseNodes.reduce((acc: any, node) => {
      if (solution[node]) {
        acc[node] = solution[node];
      }
      return acc;
    }, {});

    const tableContent = (
      <div className="mt-5">
        <h3 className="m-3 font-semibold text-center">Phase {lastPhase}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>s</TableHead>
              <TableHead>f(s,x)</TableHead>
              <TableHead>x</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(lastPhaseInfo).map((node) => (
              <TableRow key={node}>
                <TableCell>{node}</TableCell>
                <TableCell>{lastPhaseInfo[node]["f(s,x)"]}</TableCell>
                <TableCell>{lastPhaseInfo[node]["x"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );

    setTableJSX(tableContent);
  }

  useEffect(() => {
    createInitialTable();
  }, []);

  return (
    <div className="mt-20">
      <div>
        <h2 className="text-lg font-bold">Best Paths</h2>
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

      <h2 className="text-lg font-bold">Tables</h2>
      {tableJSX}
    </div>
  );
}
