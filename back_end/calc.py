import copy

"""
Invierte el orden de los nodes dentro de los grafos
"""

def reverse_order(graph: dict):
    return dict(reversed(list(graph.items())))    


"""
Imprime un diccionario con mejor orden
"""
def print_graph(graph: dict):
    for i, j in graph.items():
        print(i,":",j)

"""
Agrega las etapas indicadas despues de encontrar las soluciones
"""
def add_phases(graph: dict, phases: dict):
    for key, phase in phases.items():
        graph.get(key)['etapa'] = phase
    

"""
Separa el diccionario por etapa en una lista con diccionarios
"""
def separate_to_tables():
    ...

"""
Recorre el node invertido y realiza las operaciones para encontrar
las sumas correspondientes al mejor camino.
"""

def walk_graph(graph: dict, og: dict):
    og_copy = copy.deepcopy(og)
    for node, links in graph.items():

        if len(og_copy.get(node).keys()) == 1: 
            key_node = list(graph.get(node).keys())[0]
            key_graph = graph.get(key_node,0)
            sum_data = {}

            if key_graph == 0 :
                graph[node][f'Sum{node}'] = graph.get(node).get(key_node) + key_graph
                sum_data[key_node] = graph.get(node).get(key_node) + key_graph
            else:
                graph[node][f'Sum{node}'] = graph.get(node).get(key_node) + key_graph.get(f'Sum{key_node}')
                sum_data[key_node] = graph.get(node).get(key_node) + key_graph.get(f'Sum{key_node}')

            graph[node]['nodes'] = sum_data

        if len(og_copy.get(node).keys()) > 1:
            keys = list(graph.get(node).keys())
            sum_data = {}

            for key in keys:
                in_key = graph.get(node).get(key)
                graph_key = graph.get(key).get(f'Sum{key}')
                sum_data[key] = in_key+graph_key

            graph[node][f'Sum{node}'] = sum_data.get(min(sum_data, key=lambda k: sum_data[k]))
            graph[node]['nodes'] = sum_data

    return graph

if __name__=="__main__":

    """ NODOS 4 ETAPAS
    '1':{'2':2,'3':4,'4':3},
        '2':{'5':7,'6':4,'7':6},
        '3':{'5':3,'6':2,'7':4},
        '4':{'5':4,'6':1,'7':5},
        '5':{'8':1,'9':4},
        '6':{'8':6,'9':3},
        '7':{'8':3,'9':3},
        '8':{'10':3},
        '9':{'10':4}
    ...
    fases
    '1':1,
        '2':2,
        '3':2,
        '4':2,
        '5':3,
        '6':3,
        '7':3,
        '8':4,
        '9':4
    """
    graph_og= {
        '1':{'2':2,'3':4,'4':3},
        '2':{'5':7,'6':4,'7':6},
        '3':{'5':3,'6':2,'7':4},
        '4':{'5':4,'6':1,'7':5},
        '5':{'8':1,'9':4},
        '6':{'8':6,'9':3},
        '7':{'8':3,'9':3},
        '8':{'10':3},
        '9':{'10':4}   
    }

    phases = {
        '1':1,
        '2':2,
        '3':2,
        '4':2,
        '5':3,
        '6':3,
        '7':3,
        '8':4,
        '9':4
    }
    
    graph_inv = reverse_order(graph_og) # Devuelve el grafo invertido
    solved_graph = copy.deepcopy(walk_graph(graph_inv, graph_og)) # Resuelve las sumas de caminos
    add_phases(solved_graph, phases) # Agrega las fases indicadas por el usuario
    print_graph(solved_graph)
    

