import copy
import json

"""
FUNCION A LLAMAR PARA LA SOLUCION DE PROBLEMAS DE LA DILIGENCIA
    Recibe:
        - graph -> Diccionario con nodos y sus conexiones a otros. {"nodo":"nodo":peso, }
        - phases -> Diccionario con las etapas de cada nodo. {"nodo": etapa}
    Retorna:
        - Solucion del problema en forma de JSON
        - Caminos optimos del problema en forma de JSON
"""


def solver(graph: dict, phases: dict):
    validate_graph(graph, phases)   # Verificamos que los dict sean validos
    # Invierte el orden A -> Z por Z -> A
    reversed_graph = dict(reversed(list(graph.items())))
    solved_graph = copy.deepcopy(walk_graph(
        reversed_graph, graph, phases))  # Solucion del problema
    solution_best_path = find_best_paths_limited(
        solved_graph)  # Posibles Rutas Optimas
    # Transforma la solución del problema a un objeto JSON
    nodes_json = json.dumps(solved_graph)
    # Transforma la solución del problema a un objeto JSON
    path_json = json.dumps(solution_best_path)
    # Retorna los objetos JSON (Solución y Caminos)
    return nodes_json, path_json


"""
VERIFICA QUE LOS GRAFOS ENVIADOS TENGAN BUENAS CONEXIONES Y NO ESTEN VACIOS
    Recibe: 
        - graph -> Diccionario con nodos y sus conexiones a otros. {"nodo":"nodo":peso, }
        - phases -> Diccionario con las etapas de cada nodo. {"nodo": etapa}
    Retorna:
        Error si
            - Algun diccionario esta vacio.
            - La conexion de un nodo a otro NO pertenece a la siguiente etapa,
              ejemplo, {NODO:1, ETAPA:1} NO puede conectarse con {NODO:3, ETAPA:3}
              igualmente si el nodo 3 trata de conectarse con el NODO 1.
"""


def validate_graph(graph: dict, phases: dict):
    graph_copy = copy.deepcopy(graph)
    if len(list(graph_copy.keys())) == 0 or len(list(phases.keys())) == 0:
        raise Exception("DICCIONARIO VACIO")
    last_phase = phases[list(graph_copy.keys())[-1]]
    for key, value in graph_copy.items():
        f_phase = phases[key]
        for k, _ in value.items():
            k_phase = phases.get(k, last_phase + 1)
            if f_phase + 1 != k_phase:
                raise Exception("MALA CONEXION")


"""
LOGICA PRINCIPAL PARA CALCULAR LA SOLUCIÓN
    Recibe:
        - Grafo con orden invertido.
        - Grafo original sin cambios.
        - Diccionario con las fases de cada nodo.
    Retorna:
        - Grafo solucionado con etapas correspondientes.
"""


def walk_graph(reversed_graph: dict, original_graph: dict, phases: dict):
    graph_copy = copy.deepcopy(original_graph)  # Copia del grafo original
    for node, _ in reversed_graph.items():  # Recorre Nodos en orden Z -> A
        if len(graph_copy.get(node).keys()) == 1:  # Si Nodo solo conecta con un solo Nodo
            sum_data = {}
            key_node = list(reversed_graph.get(node).keys())[0]
            key_graph = reversed_graph.get(key_node, 0)
            if key_graph == 0:
                reversed_graph[node][f"f*(s){node}"] = reversed_graph.get(
                    node).get(key_node) + key_graph
                sum_data[key_node] = reversed_graph.get(
                    node).get(key_node) + key_graph
            else:
                reversed_graph[node][f"f*(s){node}"] = reversed_graph.get(
                    node).get(key_node) + key_graph.get(f"f*(s){key_node}")
                sum_data[key_node] = reversed_graph.get(node).get(
                    key_node) + key_graph.get(f"f*(s){key_node}")
            reversed_graph[node]["f(s,x)"] = sum_data

        if len(graph_copy.get(node).keys()) > 1:   # Si Nodo conecta con más de un Nodo
            sum_data = {}
            keys = list(reversed_graph.get(node).keys())
            for key in keys:
                in_key = reversed_graph.get(node).get(key)
                graph_key = reversed_graph.get(key).get(f"f*(s){key}")
                sum_data[key] = in_key+graph_key
            reversed_graph[node][f"f*(s){node}"] = sum_data.get(
                min(sum_data, key=lambda k: sum_data[k]))
            reversed_graph[node]["f(s,x)"] = sum_data

    new_dictionary = {}
    for key, value in reversed_graph.items():   # Quita los numeros de la llave f*(s): (f*(s)1 -> f*(s))
        new_value = {}
        for subkey, subvalue in value.items():
            new_subkey = subkey.replace(f"f*(s){key}", "f*(s)")
            new_value[new_subkey] = subvalue
        new_dictionary[key] = new_value
    reversed_graph = new_dictionary  # Aplica los cambios

    find_node_to_go(reversed_graph)  # Agrega la llave y valores de x*
    for key, phase in phases.items():
        # Agrega la etapa correspondiente a cada nodo
        reversed_graph.get(key)["etapa"] = phase
    return reversed_graph  # Retorna el grafo solucionado y con la etapa correspondiente


"""
SEGUN EL VALOR DE CONEXION CON OTROS NODOS F(S,X), BUSCA QUÉ VALORES SON IGUALES AL MEJOR/MENOR (F*(S)) PARA
AÑADIRLOS A LA COLUMNA X*
    Recibe:
        - Diccionario con la conexiones de los nodos y las llaves f*(s), f(s,x)
    Retorna:
        - Modifica el diccionario recibido, agregandole la llave x*
"""


def find_node_to_go(graph: dict):
    for node, _ in graph.items():
        nodes_found = []
        best_weight = graph.get(node).get("f*(s)")
        nodes_dict = graph.get(node).get("f(s,x)")
        for key, value in nodes_dict.items():
            if value == best_weight:
                nodes_found.append(key)
        graph[node]["x*"] = nodes_found


"""
ENCUENTRA ALGUNOS CAMINOS OPTIMOS DENTRO DEL DICCIONARIO DADO, NO ENCUENTRA TODOS
DEBIDO A LA RECURSIVIDAD NECESARIA
    Recibe:
        - Diccionario con la conexion de nodos
    Retorna:
        - Una lista de listas con los mejores caminos
"""


def find_best_paths_limited(graph: dict):
    graph_c = dict(reversed(list(copy.deepcopy(graph).items())))
    first_node = list(graph_c.keys())[0]
    start = graph_c[first_node]["x*"]
    last_node = graph_c[list(graph_c.keys())[-1]]["x*"][0]
    best_paths = []

    """
    Busca dentro del primer nodo el valor de x*, para buscarlo dentro del diccionario
    y al encontrarlo busca el siguiente.
    """
    for step in start:
        path = []
        path.append(first_node)
        walk = step
        while walk != last_node:
            path.append(walk)
            walk = graph_c[walk]["x*"][0]
        path.append(last_node)
        best_paths.append(path)

    return best_paths


# EJEMPLOS

# EXPOSICION
# NODOS: {"0":{"1":1,"2":2,"3":7,"4":6},"1":{"5":5,"6":4},"2":{"5":8,"7":9},"3":{"6":12,"7":4,"8":1,"9":3},"4":{"9":8},"5":{"10":10, "11":8},"6":{"11":5, "12":4},"7":{"12":2, "13":1},"8":{"13":16},"9":{"13":2},"10":{"14":3,"15":4},"11":{"14":2,"16":5},"12":{"15":6},"13":{"16":7},"14":{"17":8},"15":{"17":10},"16":{"17":12}}
# ETAPAS: {"0":1,"1":2,"2":2,"3":2,"4":2,"5":3,"6":3,"7":3,"8":3,"9":3,"10":4,"11":4,"12":4,"13":4,"14":5,"15":5,"16":5}

# 5 ETAPAS
# Graph = {"0":{"1":2,"2":3, "3":4}, "1":{"4":3}, "2":{"4":4, "5":7}, "3":{"5":5}, "4":{"6":2,"7":5}, "5":{"6":3}, "6":{"8":1,"10":6}, "7":{"8":4,"9":3}, "8":{"11":1}, "9":{"11":2}, "10":{"11":3}}
# phases = {"0":1, "1":2, "2":2, "3":2, "4":3, "5":3, "6":4, "7":4, "8":5, "9":5, "10":5}

# 4 ETAPAS
# graph = {"0":{"1":2,"2":4,"3":3}, "1":{"4":7,"5":4,"6":6}, "2":{"4":3,"5":2,"6":4}, "3":{"4":4,"5":1,"6":5}, "4":{"7":1,"8":4}, "5":{"7":6,"8":3}, "6":{"7":3,"8":3}, "7":{"9":3}, "8":{"9":4}}
# phases = {"0":1, "1":2, "2":2, "3":2, "4":3, "5":3, "6":3, "7":4, "8":4}

# 3 ETAPAS
# graph = {"0":{"1":7,"2":8,"3":5}, "1":{"4":12}, "2":{"4":8,"5":9}, "3":{"4":7,"5":13}, "4":{"6":9}, "5":{"6":6}}
# phases = {"0":1, "1":2, "2":2, "3":2, "4":3, "5":3}
