import re

file_path = '/home/basant/.gemini/antigravity/brain/52a12754-d4d5-4f49-891a-f07f362d21fb/.system_generated/steps/415/output.txt'

nodes = []
current_node = None

# A node item in the YAML list starts with "  - id: <id>" at indent level 2 (under nodes:)
# Let's parse with a simple state machine.
with open(file_path, 'r') as f:
    for line in f:
        # Check if line matches "  - id: ..."
        match_id = re.match(r'^  - id:\s*(.*)$', line)
        if match_id:
            if current_node:
                nodes.append(current_node)
            current_node = {'id': match_id.group(1).strip(), 'indent': 2}
            continue
            
        if current_node:
            # Match fields belonging to current node
            # They should be at indent level 4
            match_name = re.match(r'^    name:\s*(.*)$', line)
            if match_name:
                current_node['name'] = match_name.group(1).strip().strip("'\"")
                continue
                
            match_type = re.match(r'^    type:\s*(.*)$', line)
            if match_type:
                current_node['type'] = match_type.group(1).strip()
                continue

if current_node:
    nodes.append(current_node)

print(f"Scanned {len(nodes)} nodes.")
for n in nodes:
    name = n.get('name', '')
    id_ = n.get('id', '')
    type_ = n.get('type', '')
    if any(target in name.lower() or target in id_.lower() for target in ['monitoring', 'test-case', 'erp', 'create-testcase']):
        print(f"Node Match -> ID: {id_}, Name: {name}, Type: {type_}")
