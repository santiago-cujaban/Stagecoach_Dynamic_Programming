import axios from "axios";

async function resolveData(elems: any[]) {
  const names = elems.filter((item) => item.data.id && item.data.label);
  const nodes = elems.filter((item) => item.data.source && item.data.target);

  const idLabel: { [key: string]: string } = {};
  names.forEach((name) => {
    idLabel[name.data.id] = name.data.label;
  });
  const { paths, solution, phases } = await solveBackend(
    JSON.stringify(structureNodes(nodes, idLabel))
  );
  return { paths, solution, phases };
}

function structureNodes(elems: any[], idLabel: { [key: string]: string }) {
  const nodes: { [key: string]: { [key: string]: number } } = {};

  elems.forEach((item) => {
    const source = idLabel[item.data.source];
    const target = idLabel[item.data.target];
    const weight = item.data.weight;

    if (source && target && weight !== undefined) {
      if (!nodes[source]) {
        nodes[source] = {};
      }

      nodes[source][target] = weight;

      if (!nodes[target]) {
        nodes[target] = {};
      }
    }
  });

  Object.keys(nodes).forEach((node) => {
    if (Object.keys(nodes[node]).length === 0) {
      delete nodes[node];
    }
  });

  return nodes;
}

async function solveBackend(graph: string) {
  try {
    const res = await axios.post("http://127.0.0.1:8000/", graph);
    const { paths, solution, phases } = res.data;
    return { paths, solution, phases };
  } catch (err) {
    throw err;
  }
}

export { resolveData };
