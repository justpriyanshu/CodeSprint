/**
 * Graph Edge-List Formatter
 * Parses raw edge listings into adjacency list, adjacency matrix,
 * and vector-of-pairs C++ syntax.
 */

// Toggle label updates
document.getElementById('toggle-index').addEventListener('change', function () {
    document.getElementById('index-label').textContent = this.checked ? '1-indexed' : '0-indexed';
});
document.getElementById('toggle-directed').addEventListener('change', function () {
    document.getElementById('directed-label').textContent = this.checked ? 'Directed' : 'Undirected';
});

function parseEdgeList() {
    const raw = document.getElementById('edge-input').value.trim();
    if (!raw) {
        showToast('Please enter an edge list.');
        return;
    }

    const oneIndexed = document.getElementById('toggle-index').checked;
    const directed = document.getElementById('toggle-directed').checked;

    // Parse edges
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const edges = [];
    let maxNode = 0;

    for (const line of lines) {
        const parts = line.split(/[\s,]+/).map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            edges.push([parts[0], parts[1]]);
            maxNode = Math.max(maxNode, parts[0], parts[1]);
            if (parts.length >= 3 && !isNaN(parts[2])) {
                // Weighted edge — store weight but only use u,v for now
            }
        }
    }

    if (edges.length === 0) {
        showToast('No valid edges found.');
        return;
    }

    const minNode = oneIndexed ? 1 : 0;
    const n = maxNode + 1; // number of nodes (0-based internally)

    // Build adjacency list
    const adj = {};
    for (let i = minNode; i <= maxNode; i++) {
        adj[i] = [];
    }
    for (const [u, v] of edges) {
        adj[u].push(v);
        if (!directed) {
            adj[v].push(u);
        }
    }

    // ── Output 1: Adjacency List (C++ style) ──
    let adjListCode = `// Adjacency List (${directed ? 'Directed' : 'Undirected'}, ${oneIndexed ? '1' : '0'}-indexed)\n`;
    adjListCode += `// n = ${maxNode - minNode + 1} nodes, ${edges.length} edges\n`;
    adjListCode += `vector<int> adj[${n}];\n\n`;

    for (let i = minNode; i <= maxNode; i++) {
        if (adj[i].length > 0) {
            for (const neighbor of adj[i]) {
                adjListCode += `adj[${i}].push_back(${neighbor});\n`;
            }
        }
    }

    // Summary comment
    adjListCode += `\n// adj[] contents:\n`;
    for (let i = minNode; i <= maxNode; i++) {
        adjListCode += `// ${i} -> [${adj[i].join(', ')}]\n`;
    }

    document.getElementById('adj-list-output').textContent = adjListCode;

    // ── Output 2: Adjacency Matrix ──
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (const [u, v] of edges) {
        matrix[u][v] = 1;
        if (!directed) {
            matrix[v][u] = 1;
        }
    }

    let matrixCode = `// Adjacency Matrix (${directed ? 'Directed' : 'Undirected'})\n`;
    matrixCode += `int adj[${n}][${n}] = {\n`;
    for (let i = minNode; i <= maxNode; i++) {
        const row = [];
        for (let j = minNode; j <= maxNode; j++) {
            row.push(matrix[i][j]);
        }
        matrixCode += `    {${row.join(', ')}}${i < maxNode ? ',' : ''}\n`;
    }
    matrixCode += `};\n`;

    // Visual matrix with headers
    const pad = String(maxNode).length + 1;
    matrixCode += `\n// Visual:\n//   `;
    for (let j = minNode; j <= maxNode; j++) {
        matrixCode += String(j).padStart(pad);
    }
    matrixCode += `\n`;
    for (let i = minNode; i <= maxNode; i++) {
        matrixCode += `// ${String(i).padStart(2)} `;
        for (let j = minNode; j <= maxNode; j++) {
            matrixCode += String(matrix[i][j]).padStart(pad);
        }
        matrixCode += `\n`;
    }

    document.getElementById('adj-matrix-output').textContent = matrixCode;

    // ── Output 3: Vector of Pairs ──
    let pairsCode = `// Vector of Pairs (${directed ? 'Directed' : 'Undirected'})\n`;
    pairsCode += `vector<pair<int,int>> edges = {\n`;
    const allEdges = directed ? edges : edges.concat(edges.map(([u, v]) => [v, u]));
    const uniqueEdges = directed ? edges : edges; // keep original for init block
    for (let i = 0; i < uniqueEdges.length; i++) {
        const [u, v] = uniqueEdges[i];
        pairsCode += `    {${u}, ${v}}${i < uniqueEdges.length - 1 ? ',' : ''}\n`;
    }
    pairsCode += `};\n`;

    document.getElementById('vec-pairs-output').textContent = pairsCode;

    showToast(`Parsed ${edges.length} edges across ${maxNode - minNode + 1} nodes.`);
}
