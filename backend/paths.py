from phases import calculate_phases

table_data = {}
best_paths = {}

# Main adding logic
def calculate_paths(graph_nodes:dict):
    phases:dict = calculate_phases(graph_nodes)

    if not graph_nodes or not phases:
        raise Exception("Empty input provided.")
    
    last_phase = phases[list(phases.keys())[-1]]

    rev_graph_nodes = dict(reversed(list(graph_nodes.items())))
    for node, path in rev_graph_nodes.items():
        if phases[node] == last_phase:
            table_data[node] = {'f(s,x)': path[list(path.keys())[0]], 'f': path[list(path.keys())[0]]}
        else:
            table_data[node] = {'f(s,x)': {}}
            for key in path:
                if isinstance(table_data[key]['f(s,x)'], dict):
                    multiple_solutions = table_data[key]['f(s,x)']
                    table_data[node]['f(s,x)'][key] = path[key] + min(multiple_solutions.values())
                else:
                    table_data[node]['f(s,x)'][key] = path[key] + table_data[key]['f(s,x)']
    paths = calculate_min_paths(graph_nodes)
    return table_data, paths, phases

# Finds f and x
def calculate_min_paths(graph_nodes:dict):
    for node, _ in table_data.items():
        if isinstance(table_data[node]['f(s,x)'], dict):
            data = table_data[node]['f(s,x)']
            min_value = min(data.values())
            min_keys = [key for key, value in data.items() if value == min_value]

            table_data[node]['f'] = min_value
            table_data[node]['x'] = min_keys
        else:
            table_data[node]['x'] = list(graph_nodes[node].keys())[0]

    rev_dict = dict(reversed(list(table_data.items())))
    first_node = list(rev_dict.keys())[0]
    last_node = rev_dict[list(rev_dict.keys())[-1]]['x']
    
    list_of_paths = find_best_paths(rev_dict, first_node, last_node)
    for id, path in enumerate(list_of_paths):
        for value in path:
            if value != last_node:
                best_paths[f'path {id}'] = {'nodes': path}

        best_paths[f'path {id}']['sum'] = table_data[first_node]['f']
            
    return best_paths

# Find paths using DFS
def find_best_paths(graph, start, end, path=[]):
    path = path + [start]
    if start == end:
        return [path]
    if start not in graph:
        return []
    paths = []
    next_nodes = graph[start]['x']
    if isinstance(next_nodes, list):
        for node in next_nodes:
            if node not in path:
                newpaths = find_best_paths(graph, node, end, path)
                for newpath in newpaths:
                    paths.append(newpath)
    elif isinstance(next_nodes, str):
        if next_nodes not in path:
            newpaths = find_best_paths(graph, next_nodes, end, path)
            for newpath in newpaths:
                paths.append(newpath)
    return paths