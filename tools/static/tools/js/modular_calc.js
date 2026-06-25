/**
 * Modular Arithmetic Engine (Client-Side Interface)
 * POSTs to /api/modular-calc/ and renders GCD, modular inverse,
 * and prime factorization results.
 */

async function computeModular() {
    const a = document.getElementById('mod-a').value;
    const b = document.getElementById('mod-b').value;
    const m = document.getElementById('mod-m').value;

    if (!a || !b || !m) {
        showToast('Please fill in all fields.');
        return;
    }

    const btn = document.getElementById('compute-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Computing...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    try {
        const response = await fetch('/api/modular-calc/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                a: parseInt(a),
                b: parseInt(b),
                m: parseInt(m),
            }),
        });

        const data = await response.json();

        if (data.error) {
            showToast(data.error);
            return;
        }

        // ── GCD & Modular Inverse Output ──
        let gcdOut = `// Modular Arithmetic Results\n`;
        gcdOut += `// A = ${data.a}, B = ${data.b}, M = ${data.m}\n\n`;
        gcdOut += `GCD(A, B)      = GCD(${data.a}, ${data.b})\n`;
        gcdOut += `               = ${data.gcd_ab}\n\n`;
        gcdOut += `GCD(A, M)      = GCD(${data.a}, ${data.m})\n`;
        gcdOut += `               = ${data.gcd_am}\n\n`;
        gcdOut += `A mod M        = ${data.a} mod ${data.m}\n`;
        gcdOut += `               = ${data.a_mod_m}\n\n`;

        if (data.mod_inverse !== null) {
            gcdOut += `A⁻¹ mod M     = ${data.a}⁻¹ mod ${data.m}\n`;
            gcdOut += `               = ${data.mod_inverse}\n`;
            gcdOut += `               (via Extended Euclidean Algorithm)\n`;
            gcdOut += `\n// Verification: A × A⁻¹ ≡ 1 (mod M)\n`;
            gcdOut += `// ${data.a} × ${data.mod_inverse} mod ${data.m} = ${(BigInt(data.a) * BigInt(data.mod_inverse) % BigInt(data.m)).toString()}\n`;
        } else {
            gcdOut += `A⁻¹ mod M     = DOES NOT EXIST\n`;
            gcdOut += `               (GCD(${data.a}, ${data.m}) = ${data.gcd_am} ≠ 1)\n`;
            gcdOut += `               Inverse exists only when GCD(A, M) = 1\n`;
        }

        document.getElementById('gcd-output').textContent = gcdOut;

        // ── Prime Factorization Output ──
        let factOut = `// Prime Factorization\n\n`;

        factOut += `A = ${data.a}\n`;
        if (data.prime_factors_a.length > 0) {
            const aFactors = data.prime_factors_a.map(f =>
                f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`
            ).join(' × ');
            factOut += `  = ${aFactors}\n`;
            factOut += `  Factors: {${data.prime_factors_a.map(f => `(${f.prime}, ${f.exponent})`).join(', ')}}\n\n`;
        } else {
            factOut += `  = ${Math.abs(data.a) <= 1 ? '(no prime factors)' : data.a}\n\n`;
        }

        factOut += `B = ${data.b}\n`;
        if (data.prime_factors_b.length > 0) {
            const bFactors = data.prime_factors_b.map(f =>
                f.exponent > 1 ? `${f.prime}^${f.exponent}` : `${f.prime}`
            ).join(' × ');
            factOut += `  = ${bFactors}\n`;
            factOut += `  Factors: {${data.prime_factors_b.map(f => `(${f.prime}, ${f.exponent})`).join(', ')}}\n\n`;
        } else {
            factOut += `  = ${Math.abs(data.b) <= 1 ? '(no prime factors)' : data.b}\n\n`;
        }

        // C++ snippet
        factOut += `// C++ usage:\n`;
        factOut += `// long long mod_inverse(long long a, long long m) {\n`;
        factOut += `//     // Extended Euclidean Algorithm\n`;
        factOut += `//     long long g, x, y;\n`;
        factOut += `//     // ... returns a^(-1) mod m\n`;
        factOut += `// }\n`;
        if (data.mod_inverse !== null) {
            factOut += `// Answer: mod_inverse(${data.a}, ${data.m}) = ${data.mod_inverse}\n`;
        }

        document.getElementById('factors-output').textContent = factOut;

        showToast('Server computation complete.');

    } catch (err) {
        showToast('Network error: ' + err.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}
