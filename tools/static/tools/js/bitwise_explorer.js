/**
 * Bitwise Operation & Bitmask Explorer
 * Displays aligned binary representations for AND, OR, XOR
 * and dynamic bit manipulation (set, clear, read i-th bit).
 */

function exploreBits() {
    const a = parseInt(document.getElementById('int-a').value);
    const b = parseInt(document.getElementById('int-b').value);
    const i = parseInt(document.getElementById('bit-index').value);

    if (isNaN(a) || isNaN(b)) {
        showToast('Please enter valid integers for A and B.');
        return;
    }
    if (isNaN(i) || i < 0 || i > 31) {
        showToast('Bit index must be between 0 and 31.');
        return;
    }

    const AND = a & b;
    const OR  = a | b;
    const XOR = a ^ b;
    const NOT_A = ~a;
    const NOT_B = ~b;

    // Determine display width (at least 8 bits)
    const maxVal = Math.max(Math.abs(a), Math.abs(b), Math.abs(AND), Math.abs(OR), Math.abs(XOR));
    const bits = Math.max(8, Math.min(32, Math.ceil(Math.log2(maxVal + 1)) + 1));

    function toBin(n, len) {
        // Handle negative numbers with two's complement display
        if (n < 0) {
            n = (n >>> 0); // convert to unsigned 32-bit
        }
        let s = n.toString(2);
        if (s.length > len) {
            s = s.slice(-len); // take last 'len' bits
        }
        return s.padStart(len, '0');
    }

    function colorBin(binStr, highlightIdx) {
        return binStr.split('').map((ch, idx) => {
            const bitPos = binStr.length - 1 - idx;
            if (highlightIdx !== undefined && bitPos === highlightIdx) {
                return ch; // will be highlighted separately
            }
            return ch;
        }).join('');
    }

    // ── Output 1: Bitwise Operations ──
    const labelWidth = 12;
    let ops = '';
    ops += `${'A'.padEnd(labelWidth)}= ${toBin(a, bits)}  (${a})\n`;
    ops += `${'B'.padEnd(labelWidth)}= ${toBin(b, bits)}  (${b})\n`;
    ops += `${''.padEnd(labelWidth)}  ${'─'.repeat(bits)}\n`;
    ops += `${'A & B (AND)'.padEnd(labelWidth)}= ${toBin(AND, bits)}  (${AND})\n`;
    ops += `${'A | B (OR)'.padEnd(labelWidth)}= ${toBin(OR, bits)}  (${OR})\n`;
    ops += `${'A ^ B (XOR)'.padEnd(labelWidth)}= ${toBin(XOR, bits)}  (${XOR})\n`;
    ops += `${'~A (NOT)'.padEnd(labelWidth)}= ${toBin(NOT_A, bits)}  (${NOT_A})\n`;
    ops += `${'~B (NOT)'.padEnd(labelWidth)}= ${toBin(NOT_B, bits)}  (${NOT_B})\n`;

    // Bit position ruler
    ops += `\n${'Bit pos:'.padEnd(labelWidth)}  `;
    for (let p = bits - 1; p >= 0; p--) {
        ops += (p % 4 === 0) ? String(p).charAt(String(p).length - 1) : ' ';
    }
    ops += `\n`;
    ops += `${''.padEnd(labelWidth)}  `;
    for (let p = bits - 1; p >= 0; p--) {
        ops += (p === i) ? '▲' : '·';
    }
    ops += ` ← bit ${i}\n`;

    document.getElementById('bitwise-ops-output').textContent = ops;

    // ── Output 2: Bit Manipulation ──
    const setBit = a | (1 << i);
    const clearBit = a & ~(1 << i);
    const toggleBit = a ^ (1 << i);
    const readBit = (a >> i) & 1;

    let manip = `// Operations on A = ${a} at bit position i = ${i}\n\n`;

    manip += `Read bit:    (A >> ${i}) & 1\n`;
    manip += `             = (${a} >> ${i}) & 1\n`;
    manip += `             = ${readBit}  →  bit ${i} is ${readBit === 1 ? 'SET (1)' : 'CLEAR (0)'}\n\n`;

    manip += `Set bit:     A | (1 << ${i})\n`;
    manip += `             = ${a} | ${1 << i}\n`;
    manip += `   Before:   ${toBin(a, bits)}  (${a})\n`;
    manip += `   Mask:     ${toBin(1 << i, bits)}  (${1 << i})\n`;
    manip += `   After:    ${toBin(setBit, bits)}  (${setBit})\n\n`;

    manip += `Clear bit:   A & ~(1 << ${i})\n`;
    manip += `             = ${a} & ${~(1 << i)}\n`;
    manip += `   Before:   ${toBin(a, bits)}  (${a})\n`;
    manip += `   Mask:     ${toBin((~(1 << i)) >>> 0, bits)}  (~${1 << i})\n`;
    manip += `   After:    ${toBin(clearBit, bits)}  (${clearBit})\n\n`;

    manip += `Toggle bit:  A ^ (1 << ${i})\n`;
    manip += `             = ${a} ^ ${1 << i}\n`;
    manip += `   Before:   ${toBin(a, bits)}  (${a})\n`;
    manip += `   Mask:     ${toBin(1 << i, bits)}  (${1 << i})\n`;
    manip += `   After:    ${toBin(toggleBit, bits)}  (${toggleBit})\n\n`;

    // Useful bitmask snippets
    manip += `// ── Useful Bitmask Patterns ──\n`;
    manip += `// Check if power of 2:  (A & (A-1)) == 0  →  ${(a & (a - 1)) === 0}\n`;
    manip += `// Lowest set bit:       A & (-A)          =  ${a & (-a)}  (${toBin((a & (-a)) >>> 0, bits)})\n`;
    manip += `// Count set bits:       __builtin_popcount(${a}) = ${countBits(a)}\n`;
    manip += `// Highest set bit pos:  31 - __builtin_clz(${a}) = ${a > 0 ? 31 - Math.clz32(a) : 'N/A'}\n`;

    document.getElementById('bit-manip-output').textContent = manip;

    showToast('Bitwise exploration complete.');
}

function countBits(n) {
    n = n >>> 0;
    let count = 0;
    while (n) {
        count += n & 1;
        n >>>= 1;
    }
    return count;
}
