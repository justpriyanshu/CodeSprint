/**
 * Level-Order Tree Array Restructurer
 * Parses flat level-order arrays (e.g., [1, null, 2, 3]) into
 * parent-child pointer relationships and hierarchical indentation.
 */

function parseTree() {
    const raw = document.getElementById('tree-input').value.trim();
    if (!raw) {
        showToast('Please enter a level-order array.');
        return;
    }

    // Parse input: support [1, null, 2, 3] or 1 null 2 3
    let cleaned = raw.replace(/^\[/, '').replace(/\]$/, '').trim();
    const tokens = cleaned.split(/[\s,]+/).map(t => t.trim()).filter(t => t.length > 0);

    const nodes = tokens.map(t => {
        if (t.toLowerCase() === 'null' || t === '#' || t === 'nil' || t === 'none') {
            return null;
        }
        const num = Number(t);
        return isNaN(num) ? t : num;
    });

    if (nodes.length === 0 || nodes[0] === null) {
        showToast('Empty or invalid tree.');
        return;
    }

    // Build tree structure using level-order indexing
    // For node at index i: left child = 2*i + 1, right child = 2*i + 2
    // But with nulls, we need to track actual children properly

    // Build parent-child relationships tracking nulls
    const tree = []; // {value, left, right, parentIdx}
    for (let i = 0; i < nodes.length; i++) {
        tree.push({
            value: nodes[i],
            index: i,
            leftIdx: null,
            rightIdx: null,
            parentIdx: null,
        });
    }

    // Assign children using BFS-style level-order
    let childIdx = 1;
    for (let i = 0; i < nodes.length && childIdx < nodes.length; i++) {
        if (nodes[i] === null) continue;

        // Left child
        if (childIdx < nodes.length) {
            tree[i].leftIdx = childIdx;
            tree[childIdx].parentIdx = i;
            childIdx++;
        }

        // Right child
        if (childIdx < nodes.length) {
            tree[i].rightIdx = childIdx;
            tree[childIdx].parentIdx = i;
            childIdx++;
        }
    }

    // ── Output 1: Parent → Child Pointers ──
    let pointers = `// Tree from level-order: [${tokens.join(', ')}]\n`;
    pointers += `// Total nodes (incl. null): ${nodes.length}\n`;
    pointers += `// Non-null nodes: ${nodes.filter(n => n !== null).length}\n\n`;

    pointers += `// Parent → Children mapping:\n`;
    for (let i = 0; i < tree.length; i++) {
        if (nodes[i] === null) continue;

        const leftVal = tree[i].leftIdx !== null && nodes[tree[i].leftIdx] !== null
            ? nodes[tree[i].leftIdx] : 'null';
        const rightVal = tree[i].rightIdx !== null && nodes[tree[i].rightIdx] !== null
            ? nodes[tree[i].rightIdx] : 'null';

        pointers += `// Node ${nodes[i]} (idx ${i})  →  left: ${leftVal}, right: ${rightVal}\n`;
    }

    pointers += `\n// C++ struct:\n`;
    pointers += `struct TreeNode {\n`;
    pointers += `    int val;\n`;
    pointers += `    TreeNode *left, *right;\n`;
    pointers += `    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n`;
    pointers += `};\n\n`;

    // Generate C++ construction code
    pointers += `// Construction:\n`;
    const validNodes = [];
    for (let i = 0; i < tree.length; i++) {
        if (nodes[i] !== null) {
            validNodes.push(i);
            pointers += `TreeNode* n${i} = new TreeNode(${nodes[i]});\n`;
        }
    }
    for (let i = 0; i < tree.length; i++) {
        if (nodes[i] === null) continue;
        if (tree[i].leftIdx !== null && nodes[tree[i].leftIdx] !== null) {
            pointers += `n${i}->left = n${tree[i].leftIdx};\n`;
        }
        if (tree[i].rightIdx !== null && nodes[tree[i].rightIdx] !== null) {
            pointers += `n${i}->right = n${tree[i].rightIdx};\n`;
        }
    }
    pointers += `TreeNode* root = n0;\n`;

    document.getElementById('tree-pointers-output').textContent = pointers;

    // ── Output 2: Hierarchical Indentation ──
    let hierarchy = `// Hierarchical tree view:\n`;
    hierarchy += `// [L] = left child, [R] = right child\n\n`;

    function buildHierarchy(idx, prefix, isLeft, isRoot) {
        if (idx === null || idx >= tree.length || nodes[idx] === null) return;

        const connector = isRoot ? '' : (isLeft ? '├── [L] ' : '└── [R] ');
        const extension = isRoot ? '' : (isLeft ? '│   ' : '    ');

        hierarchy += prefix + connector + nodes[idx] + '\n';

        const newPrefix = prefix + extension;

        const hasLeft = tree[idx].leftIdx !== null && nodes[tree[idx].leftIdx] !== null;
        const hasRight = tree[idx].rightIdx !== null && nodes[tree[idx].rightIdx] !== null;

        if (hasLeft) {
            buildHierarchy(tree[idx].leftIdx, newPrefix, hasRight, false);
        }
        if (hasRight) {
            buildHierarchy(tree[idx].rightIdx, newPrefix, false, false);
        }
    }

    buildHierarchy(0, '', false, true);

    // Level-by-level summary
    hierarchy += `\n// Level-by-level:\n`;
    let level = [0];
    let depth = 0;
    while (level.length > 0) {
        const vals = level.map(i => nodes[i] !== null ? String(nodes[i]) : 'null');
        hierarchy += `// Level ${depth}: [${vals.join(', ')}]\n`;

        const nextLevel = [];
        for (const i of level) {
            if (nodes[i] === null) continue;
            if (tree[i].leftIdx !== null) nextLevel.push(tree[i].leftIdx);
            if (tree[i].rightIdx !== null) nextLevel.push(tree[i].rightIdx);
        }
        level = nextLevel;
        depth++;
    }

    document.getElementById('tree-hierarchy-output').textContent = hierarchy;

    showToast(`Parsed tree with ${nodes.filter(n => n !== null).length} nodes.`);
}
