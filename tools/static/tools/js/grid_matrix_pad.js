/**
 * 2D Grid / Matrix Pad
 * Parses grid input, adds row/col index headers, and generates
 * dx/dy offset arrays for 4-dir and 8-dir BFS/DFS traversals.
 */

function parseGrid() {
    const raw = document.getElementById('grid-input').value.trim();
    if (!raw) {
        showToast('Please paste a grid or matrix.');
        return;
    }

    const delimChoice = document.getElementById('delimiter-select').value;
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const grid = [];

    for (const line of lines) {
        let cells;
        if (delimChoice === 'none') {
            cells = line.split('');
        } else if (delimChoice === 'comma') {
            cells = line.split(',').map(s => s.trim());
        } else if (delimChoice === 'space') {
            cells = line.split(/\s+/);
        } else {
            // Auto-detect
            if (line.includes(',')) {
                cells = line.split(',').map(s => s.trim());
            } else if (line.includes(' ') || line.includes('\t')) {
                cells = line.split(/\s+/);
            } else {
                cells = line.split('');
            }
        }
        grid.push(cells);
    }

    if (grid.length === 0) {
        showToast('Could not parse any rows.');
        return;
    }

    const rows = grid.length;
    const cols = Math.max(...grid.map(r => r.length));

    // Normalize: pad short rows
    for (let i = 0; i < rows; i++) {
        while (grid[i].length < cols) {
            grid[i].push('.');
        }
    }

    // ── Output 1: Indexed Grid ──
    const colWidth = Math.max(3, ...grid.flat().map(c => String(c).length)) + 1;
    let indexed = `// ${rows}×${cols} grid (0-indexed)\n`;
    indexed += `//    `;
    for (let c = 0; c < cols; c++) {
        indexed += String(c).padStart(colWidth);
    }
    indexed += `\n`;

    for (let r = 0; r < rows; r++) {
        indexed += `// ${String(r).padStart(2)} `;
        for (let c = 0; c < cols; c++) {
            indexed += String(grid[r][c]).padStart(colWidth);
        }
        indexed += `\n`;
    }

    // C++ grid declaration
    const isNumeric = grid.flat().every(c => !isNaN(Number(c)));
    if (isNumeric) {
        indexed += `\nint grid[${rows}][${cols}] = {\n`;
        for (let r = 0; r < rows; r++) {
            indexed += `    {${grid[r].join(', ')}}${r < rows - 1 ? ',' : ''}\n`;
        }
        indexed += `};\n`;
    } else {
        indexed += `\nchar grid[${rows}][${cols}] = {\n`;
        for (let r = 0; r < rows; r++) {
            indexed += `    {${grid[r].map(c => `'${c}'`).join(', ')}}${r < rows - 1 ? ',' : ''}\n`;
        }
        indexed += `};\n`;
    }

    indexed += `int R = ${rows}, C = ${cols};\n`;
    document.getElementById('indexed-grid-output').textContent = indexed;

    // ── Output 2: 4-Direction Offsets ──
    let dir4 = `// 4-directional BFS/DFS offsets (Up, Right, Down, Left)\n`;
    dir4 += `int dx[] = {-1, 0, 1, 0};\n`;
    dir4 += `int dy[] = {0, 1, 0, -1};\n\n`;
    dir4 += `// Usage:\n`;
    dir4 += `for (int d = 0; d < 4; d++) {\n`;
    dir4 += `    int nx = x + dx[d];\n`;
    dir4 += `    int ny = y + dy[d];\n`;
    dir4 += `    if (nx >= 0 && nx < ${rows} && ny >= 0 && ny < ${cols}) {\n`;
    dir4 += `        // process grid[nx][ny]\n`;
    dir4 += `    }\n`;
    dir4 += `}\n\n`;
    dir4 += `// Direction names: {Up, Right, Down, Left}\n`;
    dir4 += `// Movements:\n`;
    dir4 += `//      ↑\n`;
    dir4 += `//    ← · →\n`;
    dir4 += `//      ↓\n`;

    document.getElementById('dir4-output').textContent = dir4;

    // ── Output 3: 8-Direction Offsets ──
    let dir8 = `// 8-directional BFS/DFS offsets (includes diagonals)\n`;
    dir8 += `int dx[] = {-1, -1, -1, 0, 0, 1, 1, 1};\n`;
    dir8 += `int dy[] = {-1, 0, 1, -1, 1, -1, 0, 1};\n\n`;
    dir8 += `// Usage:\n`;
    dir8 += `for (int d = 0; d < 8; d++) {\n`;
    dir8 += `    int nx = x + dx[d];\n`;
    dir8 += `    int ny = y + dy[d];\n`;
    dir8 += `    if (nx >= 0 && nx < ${rows} && ny >= 0 && ny < ${cols}) {\n`;
    dir8 += `        // process grid[nx][ny]\n`;
    dir8 += `    }\n`;
    dir8 += `}\n\n`;
    dir8 += `// Direction names: {↖, ↑, ↗, ←, →, ↙, ↓, ↘}\n`;
    dir8 += `// Movements:\n`;
    dir8 += `//    ↖ ↑ ↗\n`;
    dir8 += `//    ← · →\n`;
    dir8 += `//    ↙ ↓ ↘\n`;

    document.getElementById('dir8-output').textContent = dir8;

    showToast(`Parsed ${rows}×${cols} grid.`);
}
