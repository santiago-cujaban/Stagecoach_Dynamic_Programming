import copy, json

def solver_walker(graph: dict, phases: dict):
    validate_graph(graph, phases)
    reversed_graph = dict(reversed(list(graph.items()))) # Invierte el orden A -> Z por Z -> A
    solved_graph = copy.deepcopy(walk_graph(reversed_graph, graph, phases))  # Solucion del problema
    solution_best_path = find_best_paths_limited(solved_graph)  # Posibles Rutas Optimas
    nodes_json = json.dumps(solved_graph)
    path_json = json.dumps(solution_best_path)
    print(nodes_json, path_json)
    return nodes_json, path_json

def validate_graph(graph: dict, phases:dict):
    graph_c = copy.deepcopy(graph)

    if len(list(graph_c.keys())) == 0 or len(list(phases.keys())) == 0:
        raise Exception('DICCIONARIO Vacio')

    last_phase = phases[list(graph_c.keys())[-1]]
    for key, value in graph_c.items():
        f_phase = phases[key]
        for k, v in value.items():
            k_phase = phases.get(k, last_phase + 1)
            if f_phase + 1 != k_phase:
                raise Exception('Mala Conexión')


def walk_graph(reversed_graph: dict, original_graph: dict, phases: dict):

    graph_copy = copy.deepcopy(original_graph) # Copia del grafo original
    for node, _ in reversed_graph.items(): # Recorre el grafo inverso

        if len(graph_copy.get(node).keys()) == 1:  # Si el nodo solo tiene una conexión
            sum_data = {}
            key_node = list(reversed_graph.get(node).keys())[0]
            key_graph = reversed_graph.get(key_node, 0)

            if key_graph == 0:
                reversed_graph[node][f'f*(s){node}'] = reversed_graph.get(node).get(key_node) + key_graph
                sum_data[key_node] = reversed_graph.get(node).get(key_node) + key_graph
            else:
                reversed_graph[node][f'f*(s){node}'] = reversed_graph.get(node).get(key_node) + key_graph.get(f'f*(s){key_node}')
                sum_data[key_node] = reversed_graph.get(node).get(key_node) + key_graph.get(f'f*(s){key_node}')

            reversed_graph[node]['f(s,x)'] = sum_data

        if len(graph_copy.get(node).keys()) > 1:   # Si el nodo tiene más de una conexión
            sum_data = {}
            keys = list(reversed_graph.get(node).keys())

            for key in keys:
                in_key = reversed_graph.get(node).get(key)
                graph_key = reversed_graph.get(key).get(f'f*(s){key}')
                sum_data[key] = in_key+graph_key

            reversed_graph[node][f'f*(s){node}'] = sum_data.get(min(sum_data, key=lambda k: sum_data[k]))
            reversed_graph[node]['f(s,x)'] = sum_data

    # Elimina los números de la llave f*(s)
    new_dictionary = {}
    for key, value in reversed_graph.items():
        new_value = {}
        for subkey, subvalue in value.items():
            new_subkey = subkey.replace(f'f*(s){key}', 'f*(s)')
            new_value[new_subkey] = subvalue
        new_dictionary[key] = new_value
    reversed_graph = new_dictionary
    

    find_path(reversed_graph)   # Agrega X* de cada S (nodo)
    for key, phase in phases.items(): reversed_graph.get(key)['etapa'] = phase   #Agrega etapa correspondiente

    return reversed_graph


def find_path(graph: dict):

    for node, _ in graph.items():
        nodes_found = []
        best_weight = graph.get(node).get('f*(s)')
        nodes_dict = graph.get(node).get('f(s,x)')
        
        for key, value in nodes_dict.items():
            if value == best_weight:
                nodes_found.append(key)
        graph[node]['x*'] = nodes_found


def find_best_paths_limited(graph: dict):
    graph_c = dict(reversed(list(copy.deepcopy(graph).items())))
    first_node = list(graph_c.keys())[0] # Nodo Inicial
    start = graph_c[first_node]['x*'] # Caminos posibles inicio
    last_node = graph_c[list(graph_c.keys())[-1]]['x*'][0] # Nodo Final
    
    best_paths = []
    
    for step in start:
        path = []
        path.append(first_node)
        walk = step
        while walk != last_node:
            path.append(walk)
            walk = graph_c[walk]['x*'][0]
        path.append(last_node)
        best_paths.append(path)
    
    return best_paths


# EJEMPLOS

#5 ETAPAS
#graph = 'A':{'B':2,'C':3, 'D':4}, 'B':{'E':3}, 'C':{'E':4, 'F':7}, 'D':{'F':5}, 'E':{'G':2,'H':5}, 'F':{'G':3}, 'G':{'I':1,'K':6}, 'H':{'I':4,'J':3}, 'I':{'L':1}, 'J':{'L':2}, 'K':{'L':3},
#phases = 'A':1, 'B':2, 'C':2, 'D':2, 'E':3, 'F':3, 'G':4, 'H':4, 'I':5, 'J':5, 'K':5

#4 ETAPAS
#graph = '1':{'2':2,'3':4,'4':3}, '2':{'5':7,'6':4,'7':6}, '3':{'5':3,'6':2,'7':4}, '4':{'5':4,'6':1,'7':5}, '5':{'8':1,'9':4}, '6':{'8':6,'9':3}, '7':{'8':3,'9':3}, '8':{'10':3}, '9':{'10':4}
#phases = '1':1, '2':2, '3':2, '4':2, '5':3, '6':3, '7':3, '8':4, '9':4

#3 ETAPAS
#graph = '0':{'1':7,'2':8,'3':5}, '1':{'4':12}, '2':{'4':8,'5':9}, '3':{'4':7,'5':13}, '4':{'6':9}, '5':{'6':6}
#phases = '0':1, '1':2, '2':2, '3':2, '4':3, '5':3