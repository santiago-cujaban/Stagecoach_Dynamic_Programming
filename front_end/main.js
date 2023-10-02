var maxNodes;
var nodes = {};
var phases = {};

// Crea la lista adjacente visualmente
function createAdjacentList() {
  maxNodes = parseInt(document.getElementById("numNodes").value);
  var spaceAL = document.getElementById("AdjacentList");
  spaceAL.innerHTML = "";

  for (var i = 0; i < maxNodes; i++) {
    var label = document.createElement("p");
    var input_phase = document.createElement("input");
    label.textContent = i + "->";
    input_phase.placeholder = "Num Etapa nodo: " + i;
    input_phase.id = i;
    spaceAL.appendChild(label);
    spaceAL.appendChild(input_phase);

    for (var j = i + 1; j <= maxNodes; j++) {
      var input = document.createElement("input");
      input.placeholder = i + " -> " + j;
      input.id = i + "" + j;
      spaceAL.appendChild(input);
    }
  }

  var solve_button = document.createElement("button");
  solve_button.textContent = "Solucionar";
  solve_button.id = "solve_button";
  solve_button.onclick = function () {
    createObject();
  };
  spaceAL.appendChild(solve_button);
}

// Toma el valor de cada elemento y crea un objeto
function createObject() {
  maxNodes = parseInt(document.getElementById("numNodes").value);

  for (var i = 0; i < maxNodes; i++) {
    var phaseValue = document.getElementById(i).value;
    nodes[i] = {};

    phases[i] = parseInt(phaseValue);
    for (var j = i + 1; j <= maxNodes; j++) {
      var inputValue = document.getElementById(i + "" + j).value;
      if (!isNaN(inputValue)) {
        nodes[i][j] = parseInt(inputValue);
      } else {
        element = document.getElementById(i + "" + j);
        element.style.display = "none";
      }
    }
  }
  sendSolver();
  createGraphView();
}

function createLastTable(space, phase, solution) {
  // Crear una fila de encabezado
  var table = document.createElement("table");
  space.appendChild(table);

  // Crear la cabecera de la tabla
  var title = document.createElement("caption");
  var headerRow = document.createElement("tr");
  var headerCell1 = document.createElement("th");
  var headerCell2 = document.createElement("th");
  var headerCell3 = document.createElement("th");
  title.textContent = "Etapa " + phase;
  headerCell1.textContent = "s";
  headerCell2.textContent = "f*" + phase + "(s)";
  headerCell3.textContent = "x*" + phase;

  table.appendChild(title);
  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  headerRow.appendChild(headerCell3);
  table.appendChild(headerRow);

  const objs_last_phase = {};
  for (const key in solution) {
    const item = solution[key];
    if (item.etapa === phase) {
      objs_last_phase[key] = item;
    }
  }

  for (const key in objs_last_phase) {
    var data_row = document.createElement("tr");
    var from = document.createElement("td");
    from.textContent = key;

    var w = document.createElement("td");
    w.textContent = objs_last_phase[key]["f*(s)"];

    var x = document.createElement("td");
    x.textContent = objs_last_phase[key]["x*"];

    data_row.appendChild(from);
    data_row.appendChild(w);
    data_row.appendChild(x);
    table.appendChild(data_row);
  }
}

function createOtherTable(solution, table_space, phase) {
  var table = document.createElement("table");
  table_space.appendChild(table);

  var title = document.createElement("caption");
  var headerRow = document.createElement("tr");
  var header_s = document.createElement("th");
  var header_f = document.createElement("th");
  var header_x = document.createElement("th");

  title.textContent = "Etapa" + phase;
  header_s.textContent = "s";
  header_f.textContent = "f*" + phase + "(s)";
  header_x.textContent = "x*" + phase;

  table.appendChild(title);
  headerRow.appendChild(header_s);

  const obj_phase = {};
  for (const key in solution) {
    const item = solution[key];
    if (item.etapa === phase) {
      obj_phase[key] = item;
    }
  }

  const uniqueHeaders = new Set();

  // crea headers
  for (const key in obj_phase) {
    for (const k in obj_phase[key]["f(s,x)"]) {
      uniqueHeaders.add(k);
    }
  }

  uniqueHeaders.forEach(function (headerText) {
    var header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  headerRow.appendChild(header_f);
  headerRow.appendChild(header_x);
  table.appendChild(headerRow);

  // crea datos
  for (const key in obj_phase) {
    var data_row = document.createElement("tr");
    var node = document.createElement("td");
    node.textContent = key;
    data_row.appendChild(node);

    for (const headerText of uniqueHeaders) {
      var data = document.createElement("td");
      if (obj_phase[key]["f(s,x)"].hasOwnProperty(headerText)) {
        data.textContent = obj_phase[key]["f(s,x)"][headerText];
      } else {
        data.textContent = " - "; // Si no existe, puedes dejar el campo vacío o asignar otro valor predeterminado.
      }
      data_row.appendChild(data);
    }

    var weight = document.createElement("td");
    weight.textContent = obj_phase[key]["f*(s)"];
    data_row.appendChild(weight);

    var path_n = document.createElement("td");
    path_n.textContent = obj_phase[key]["x*"];
    data_row.appendChild(path_n);

    table.appendChild(data_row);
  }
}

// Crea las tablas por etapa
function createTables(problem_solution) {
  console.log(problem_solution);
  table_space = document.getElementById("Tables");
  table_space.innerHTML = "";
  var title = document.createElement("h3");
  title.textContent = "Tablas";
  table_space.appendChild(title);

  phases_copy = { ...phases };
  var quantity_phases = Math.max(...Object.values(phases_copy));

  for (var i = 0; i < quantity_phases; i++) {
    if (i == quantity_phases - 1) {
      createLastTable(table_space, i + 1, problem_solution);
    } else {
      createOtherTable(problem_solution, table_space, i + 1);
    }
  }
}

// Crea la Gráfica de los nodos
function createGraphView() {
  const copy_nodes = { ...nodes };
  const last_key_pos = Object.keys(copy_nodes).length;
  copy_nodes[last_key_pos] = {};
  const data = copy_nodes;
  var elements = [];

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      elements.push({ data: { id: key } });

      // Add edges
      var edges = data[key];
      for (var target in edges) {
        if (edges.hasOwnProperty(target)) {
          elements.push({
            data: {
              source: key,
              target: target,
              weight: edges[target],
              label: edges[target].toString(),
            },
          });
        }
      }
    }
  }

  document.getElementById("cy").style.visibility = "visible";
  var cy = cytoscape({
    container: document.getElementById("cy"),
    elements: elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#66ccff",
          label: "data(id)",
        },
      },
      {
        selector: "edge",
        style: {
          label: "data(label)",
          "text-rotation": "autorotate",
          "text-margin-x": "5px",
          "text-margin-y": "5px",
        },
      },
    ],
    layout: {
      name: "grid",
      animate: true,
    },
  });
}

// Manda el objeto como JSON al servidor Python
// obtiene la solucion y algunos caminos posibles

function sendSolver() {
  var nodes_OBJ = JSON.stringify(nodes);
  var phases_OBJ = JSON.stringify(phases);
  fetch("http://localhost:8000/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conexiones: nodes_OBJ,
      etapas: phases_OBJ,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      var solucion = JSON.parse(data.solucion);
      var camino = data.camino;
      var path_space = document.getElementById("BestPath");
      path_space.innerHTML = "";
      var title = document.createElement("h3");
      var text = document.createElement("p");
      title.textContent = "Mejores Caminos";
      text.textContent = camino;
      path_space.appendChild(title);
      path_space.appendChild(text);

      createTables(solucion);
    })
    .catch((error) => {
      console.error("Error al enviar los datos al servidor:", error);
    });
}
