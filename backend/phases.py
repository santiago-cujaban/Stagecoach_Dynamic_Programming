def calculate_phases(graph_nodes: dict):
    if graph_nodes == {}:
        raise Exception('Error, Empty')

    phases = {}
    current_phase = 1
    first_node = list(graph_nodes.keys())[0]

    for _, paths in graph_nodes.items():
        if first_node in paths:
            raise Exception('Error, first node is linked by a child')
    
    phases[first_node] = current_phase
    current_phase += 1

    recursive_verification(current_phase, graph_nodes, phases)
    return phases

def recursive_verification(current_phase:int, graph_nodes:dict, phases:dict):
    
    # Determines the last phase
    for phasesNode in list(phases):
        if phases[phasesNode] == current_phase - 1:
            if len(list(graph_nodes[phasesNode])) == 1 and list(graph_nodes[phasesNode])[0] not in graph_nodes:
                return
            for node in graph_nodes[phasesNode]:
                phases[node] = current_phase

    recursive_verification(current_phase + 1, graph_nodes, phases)