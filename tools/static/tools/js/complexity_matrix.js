/**
 * Time Complexity & Constraint Matrix
 * Computes operation counts for common complexities and marks
 * each as PASS or TLE based on 10^8 ops/sec boundary.
 */

function analyzeComplexity() {
    const N = parseInt(document.getElementById('n-input').value);
    const TL = parseFloat(document.getElementById('tl-input').value);

    if (isNaN(N) || N <= 0) {
        showToast('Please enter a valid positive N.');
        return;
    }
    if (isNaN(TL) || TL <= 0) {
        showToast('Please enter a valid time limit.');
        return;
    }

    const OPS_PER_SEC = 1e8;
    const maxOps = OPS_PER_SEC * TL;

    // Compute operation counts
    const complexities = [
        {
            name: 'O(1)',
            ops: 1,
            formula: '1',
        },
        {
            name: 'O(log N)',
            ops: Math.log2(N),
            formula: `log₂(${N.toLocaleString()})`,
        },
        {
            name: 'O(√N)',
            ops: Math.sqrt(N),
            formula: `√${N.toLocaleString()}`,
        },
        {
            name: 'O(N)',
            ops: N,
            formula: N.toLocaleString(),
        },
        {
            name: 'O(N log N)',
            ops: N * Math.log2(N),
            formula: `${N.toLocaleString()} × log₂(${N.toLocaleString()})`,
        },
        {
            name: 'O(N²)',
            ops: N * N,
            formula: `${N.toLocaleString()}²`,
        },
        {
            name: 'O(N³)',
            ops: N * N * N,
            formula: `${N.toLocaleString()}³`,
        },
        {
            name: 'O(2^N)',
            ops: Math.pow(2, Math.min(N, 64)),  // cap to avoid Infinity display issues
            formula: `2^${N}`,
        },
        {
            name: 'O(N!)',
            ops: N <= 20 ? factorial(N) : Infinity,
            formula: `${N}!`,
        },
    ];

    // Build output
    const el = document.getElementById('complexity-output');
    let html = '';

    // Header
    html += `<div style="margin-bottom: 1rem; color: #9ca3af; font-size: 0.75rem;">`;
    html += `N = ${N.toLocaleString()} · TL = ${TL}s · Boundary = ${formatSci(maxOps)} ops`;
    html += `</div>`;

    // Table
    html += `<div style="display: grid; gap: 0.5rem;">`;
    for (const c of complexities) {
        const pass = c.ops <= maxOps;
        const opsStr = c.ops === Infinity ? '∞' : formatSci(c.ops);
        const ratio = c.ops === Infinity ? '∞' : (c.ops / maxOps).toFixed(4);
        const timeStr = c.ops === Infinity ? '∞' : formatTime(c.ops / OPS_PER_SEC);

        html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; border-radius: 0.5rem; background: ${pass ? 'rgba(6, 214, 160, 0.04)' : 'rgba(255, 0, 110, 0.04)'}; border: 1px solid ${pass ? 'rgba(6, 214, 160, 0.1)' : 'rgba(255, 0, 110, 0.1)'};">`;
        html += `<div style="display: flex; align-items: center; gap: 0.75rem;">`;
        html += `<span class="${pass ? 'verdict-pass' : 'verdict-tle'}">${pass ? '✓ PASS' : '✗ TLE'}</span>`;
        html += `<span style="font-weight: 600; color: #e5e7eb; min-width: 90px;">${c.name}</span>`;
        html += `</div>`;
        html += `<div style="text-align: right; font-size: 0.75rem;">`;
        html += `<span style="color: #9ca3af;">${opsStr} ops</span>`;
        html += `<span style="color: #4b5563; margin-left: 0.75rem;">≈ ${timeStr}</span>`;
        html += `</div>`;
        html += `</div>`;
    }
    html += `</div>`;

    // Summary
    const passing = complexities.filter(c => c.ops <= maxOps);
    html += `<div style="margin-top: 1rem; padding: 0.75rem; border-radius: 0.5rem; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.75rem; color: #6b7280;">`;
    html += `<strong style="color: #06d6a0;">Target:</strong> Use algorithms with complexity ≤ <strong>${passing.length > 0 ? passing[passing.length - 1].name : 'N/A'}</strong> for N = ${N.toLocaleString()} within ${TL}s.`;
    html += `</div>`;

    el.innerHTML = html;

    showToast('Complexity analysis complete.');
}

function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
        if (result > 1e18) return Infinity;
    }
    return result;
}

function formatSci(n) {
    if (n === Infinity) return '∞';
    if (n < 1000) return n.toFixed(1);
    const exp = Math.floor(Math.log10(n));
    const mantissa = n / Math.pow(10, exp);
    return `${mantissa.toFixed(2)}×10^${exp}`;
}

function formatTime(seconds) {
    if (seconds === Infinity) return '∞';
    if (seconds < 0.001) return `${(seconds * 1e6).toFixed(1)}μs`;
    if (seconds < 1) return `${(seconds * 1000).toFixed(1)}ms`;
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}min`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}hr`;
    return `${(seconds / 86400).toFixed(1)}d`;
}
