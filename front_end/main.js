var maxNodes;
var nodes = {};
var phases = {};
var errorWasAdded = false;

// Segun el ingreso dentro de la lista adyacente, permite visualizar las conexiones
function getNodeConnections(id) {
  var inputNode = document.getElementById(id);
  var connections = inputNode.value.split(",");
  for (var k of connections) {
    document.getElementById(id + " " + k).style.display = "inline";
  }
}

// Crea la lista adjacente visualmente
function createAdjacentList() {
  nodes = {};
  phases = {};
  maxNodes = parseInt(document.getElementById("numNodes").value);
  var spaceAL = document.getElementById("AdjacentList");
  spaceAL.innerHTML = "";
  document.getElementById("cy").style.width = "50%";
  spaceAL.style.display = "flex";

  for (var i = 0; i < maxNodes; i++) {
    var label = document.createElement("p");
    label.textContent = "Nodo " + i;
    spaceAL.appendChild(label);

    for (var j = i + 1; j <= maxNodes; j++) {
      var input = document.createElement("input");
      input.placeholder = "Nodo " + i + " -> Nodo " + j;
      input.id = i + " " + j;
      input.autocomplete = "off";
      input.style.display = "none";
      input.addEventListener("focus", function (event) {
        event.target.style.backgroundColor = "#e7f3fe";
      });
      input.addEventListener("input", function (event) {
        if (isNaN(event.target.value)) {
          event.target.style.backgroundColor = "#F7CAC9";
        }
      });

      spaceAL.appendChild(input);
    }
    // Ingreso Conexiones Esenciales
    var divForm = document.createElement("div");
    divForm.className = "Conex";
    var inputDisplay = document.createElement("input");
    var buttonDisplay = document.createElement("button");

    buttonDisplay.textContent = "Visualizar Conexiones Nodo " + i;
    inputDisplay.placeholder = "Conexiones del Nodo " + i;
    inputDisplay.autocomplete = "off";
    inputDisplay.id = i;

    buttonDisplay.onclick = function () {
      getNodeConnections(this.previousSibling.id);
    };

    divForm.appendChild(inputDisplay);
    divForm.appendChild(buttonDisplay);
    spaceAL.appendChild(divForm);
  }

  var solve_button = document.createElement("button");
  solve_button.textContent = "Solucionar";
  solve_button.id = "solve_button";
  solve_button.style.height = "25px";
  solve_button.onclick = function () {
    createObject();
  };
  spaceAL.appendChild(solve_button);
}

// Soluciona el problema obtenido en forma de texto
function createByText() {
  adjList = document.getElementById("AdjacentList");
  adjList.style.display = "none";
  cyDiv = document.getElementById("cy");
  cyDiv.style.width = "100%";
  cyDiv.style.height = "40vh";

  nodes_text = document.getElementById("Nodesbytext").value;

  nodes = JSON.parse(nodes_text);
  findPhases();

  infoSpace = document.getElementById("Info");
  infoSpace.innerHTML = "";
  p = document.createElement("p");

  text_info =
    "************************************************************<br>" +
    "<b>SE ENVIO LA SIGUIENTE INFORMACION, COPIA ANTES DE REFRESCAR</b><br>" +
    "************************************************************<br>" +
    "<br><b>!! NODOS !!</b><br>" +
    JSON.stringify(nodes) +
    "<br><b>!! ETAPAS !!</b><br>" +
    JSON.stringify(phases) +
    "<br>";

  p.innerHTML = text_info;
  infoSpace.appendChild(p);
  sendSolver();
  createGraphView();
}

// encuentra las etapas correspondientes a cada nodo
function findPhases() {
  var lastNode = Object.keys(nodes[Object.keys(nodes).length - 1])[0];
  console.log(lastNode);
  phases[0] = 1;

  for (node in nodes) {
    for (key in nodes[node]) {
      phases[key] = phases[node] + 1;
    }
  }
  delete phases[lastNode];
}

// Toma el valor de cada elemento y crea un objeto
function createObject() {
  maxNodes = parseInt(document.getElementById("numNodes").value);

  for (var i = 0; i < maxNodes; i++) {
    nodes[i] = {};
    // Pasa informacion de las conexiones
    for (var j = i + 1; j <= maxNodes; j++) {
      var inputValue = document.getElementById(i + " " + j).value;
      if (!isNaN(inputValue) && inputValue !== "") {
        nodes[i][j] = parseInt(inputValue);
      } else {
        document.getElementById(i + " " + j).style.display = "none";
      }
    }
  }
  // Logica detectar etapas
  findPhases();

  infoSpace = document.getElementById("Info");
  infoSpace.innerHTML = "";
  p = document.createElement("p");

  text_info =
    "************************************************************<br>" +
    "<b>SE ENVIO LA SIGUIENTE INFORMACION, COPIA ANTES DE REFRESCAR</b><br>" +
    "************************************************************<br>" +
    "<br><b>!! NODOS !!</b><br>" +
    JSON.stringify(nodes) +
    "<br><b>!! ETAPAS !!</b><br>" +
    JSON.stringify(phases) +
    "<br>";

  p.innerHTML = text_info;
  infoSpace.appendChild(p);

  sendSolver();
  createGraphView();
}

/*
  LOGICA PRINCIPAL PARA LA CREACION DE TABLAS QUE PERTENECEN
  A LA ULTIMA ETAPA, DONDE SE RECORRE LA SOLUCION DADA POR EL
  BACKEND Y SE AGREGA LA TABLA AL HTML.
*/

function createLastTable(solution, table_space, phase) {
  var table = document.createElement("table");
  table_space.appendChild(table);
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

/*
  LOGICA PRINCIPAL PARA LA CREACION DE TABLAS QUE NO PERTENECEN
  A LA ULTIMA ETAPA, DONDE SE RECORRE LA SOLUCION DADA POR EL
  BACKEND Y SE AGREGA CADA TABLA AL HTML.
*/

function createOtherTable(solution, table_space, phase) {
  var table = document.createElement("table");
  table_space.appendChild(table);
  var title = document.createElement("caption");
  var headerRow = document.createElement("tr");
  var header_s = document.createElement("th");
  var header_f = document.createElement("th");
  var header_x = document.createElement("th");

  title.textContent = "Etapa " + phase;
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

  // SE CREA LOS TITULOS DE LA TABLA
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

  // SE CREAN LOS DATOS DENTRO DE LA TABLA
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

/*
  SEPARA LAS LLAVES POR LA FASE A LA QUE PERTENECEN
  CREANDO UNA TABLA ESPECIFICA PARA LA ULTIMA ETAPA
*/
function createTables(problem_solution) {
  table_space = document.getElementById("Tables");
  table_space.innerHTML = "";

  phases_copy = { ...phases };
  var quantity_phases = Math.max(...Object.values(phases_copy));

  for (var i = 0; i < quantity_phases; i++) {
    if (i == quantity_phases - 1) {
      createLastTable(problem_solution, table_space, i + 1);
    } else {
      createOtherTable(problem_solution, table_space, i + 1);
    }
  }
}

/*
  RECORRE LA INFORMACION DE LA CONEXION DE LOS NODOS
  Y CREA LA VISUALIZACION GRAFICA POR MEDIO DE LA
  LIBRERIA CYTOSCAPE.MIN.JS
*/
function createGraphView() {
  const copy_nodes = { ...nodes };
  const last_key_pos = Object.keys(copy_nodes).length;
  copy_nodes[last_key_pos] = {};
  const data = copy_nodes;
  var elements = [];

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      elements.push({ data: { id: key } });

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

  document.getElementById("cy").style.display = "block";
  var cy = cytoscape({
    container: document.getElementById("cy"),
    elements: elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#92A8D1",
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

/*
  ENVIA LA INFORMACION DE LOS NODOS Y FASES AL BACKEND
  AL RECIBIR LA RESPUESTA DEL SERVIDOR, AGREGA LA
  INFORMACION DE LOS MEJORES CAMINOS Y CREA LAS TABLAS
  CORRESPONDIENTES
*/

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
      if (document.getElementById("Error") !== null) {
        document.getElementById("Error").style.display = "none";
        errorWasAdded = false;
      }
      var solution = JSON.parse(data.solucion);
      var path = data.camino.replace(/,/g, "->") + " = " + solution[0]["f*(s)"];
      var path_space = document.getElementById("BestPath");
      path_space.innerHTML = "";
      var text = document.createElement("p");
      text.textContent = path;
      path_space.appendChild(text);

      createTables(solution);
    })
    .catch((error) => {
      // Verificar si el elemento ya ha sido agregado
      if (!errorWasAdded) {
        var infoDiv = document.getElementById("Info");
        var divWarn = document.createElement("div");
        var textWarn = document.createElement("p");
        divWarn.id = "Error";
        divWarn.innerHTML = "";

        (textWarn.textContent =
          "ERROR AL ENVIAR DATOS AL SERVIDOR, VERIFIQUE LAS CONEXIONES DE LA LISTA ADYACENTE O LA CONEXIÓN AL SERVIDOR"),
          error.message;
        divWarn.appendChild(textWarn);
        infoDiv.parentNode.insertBefore(divWarn, infoDiv.nextSibling);
        errorWasAdded = true;
      }
    });
}
