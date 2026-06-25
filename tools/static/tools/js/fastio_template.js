/**
 * Fast I/O Template Synthesizer
 * Assembles competitive programming boilerplate from selected
 * language and macro options.
 */

let currentLang = 'cpp';

function setLanguage(lang) {
    currentLang = lang;
    // Update tab styles
    document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('lang-tab-active'));
    document.getElementById(`tab-${lang}`).classList.add('lang-tab-active');
}

function generateTemplate() {
    const fastIO = document.getElementById('opt-fastio').checked;
    const typedefs = document.getElementById('opt-typedefs').checked;
    const modular = document.getElementById('opt-modular').checked;
    const template = document.getElementById('opt-template').checked;

    let code = '';

    switch (currentLang) {
        case 'cpp':
            code = generateCpp(fastIO, typedefs, modular, template);
            break;
        case 'java':
            code = generateJava(fastIO, typedefs, modular, template);
            break;
        case 'python':
            code = generatePython(fastIO, typedefs, modular, template);
            break;
    }

    document.getElementById('template-output').textContent = code;
    showToast(`${currentLang.toUpperCase()} template generated.`);
}

function generateCpp(fastIO, typedefs, modular, template) {
    let lines = [];

    // Headers
    lines.push('#include <bits/stdc++.h>');
    lines.push('using namespace std;');
    lines.push('');

    // Fast I/O macros
    if (fastIO) {
        lines.push('// ── Fast I/O ──');
        lines.push('#define FAST_IO ios::sync_with_stdio(false); cin.tie(nullptr); cout.tie(nullptr);');
        lines.push('');
    }

    // Typedefs
    if (typedefs) {
        lines.push('// ── Type Aliases ──');
        lines.push('typedef long long ll;');
        lines.push('typedef unsigned long long ull;');
        lines.push('typedef pair<int, int> pii;');
        lines.push('typedef pair<ll, ll> pll;');
        lines.push('typedef vector<int> vi;');
        lines.push('typedef vector<ll> vll;');
        lines.push('typedef vector<pii> vpii;');
        lines.push('typedef vector<vector<int>> vvi;');
        lines.push('');
        lines.push('// ── Shorthand Macros ──');
        lines.push('#define pb push_back');
        lines.push('#define mp make_pair');
        lines.push('#define fi first');
        lines.push('#define se second');
        lines.push('#define all(x) (x).begin(), (x).end()');
        lines.push('#define rall(x) (x).rbegin(), (x).rend()');
        lines.push('#define sz(x) (int)(x).size()');
        lines.push('#define FOR(i, a, b) for (int i = (a); i < (b); i++)');
        lines.push('#define ROF(i, a, b) for (int i = (a); i >= (b); i--)');
        lines.push('');
    }

    // Modular arithmetic
    if (modular) {
        lines.push('// ── Modular Arithmetic ──');
        lines.push('const ll MOD = 1e9 + 7;');
        lines.push('');
        lines.push('inline ll mod_add(ll a, ll b, ll m = MOD) {');
        lines.push('    return ((a % m) + (b % m)) % m;');
        lines.push('}');
        lines.push('');
        lines.push('inline ll mod_mul(ll a, ll b, ll m = MOD) {');
        lines.push('    return ((a % m) * (b % m)) % m;');
        lines.push('}');
        lines.push('');
        lines.push('inline ll mod_pow(ll base, ll exp, ll m = MOD) {');
        lines.push('    ll result = 1;');
        lines.push('    base %= m;');
        lines.push('    while (exp > 0) {');
        lines.push('        if (exp & 1) result = mod_mul(result, base, m);');
        lines.push('        base = mod_mul(base, base, m);');
        lines.push('        exp >>= 1;');
        lines.push('    }');
        lines.push('    return result;');
        lines.push('}');
        lines.push('');
        lines.push('inline ll mod_inv(ll a, ll m = MOD) {');
        lines.push('    return mod_pow(a, m - 2, m); // Fermat\'s little theorem (m must be prime)');
        lines.push('}');
        lines.push('');
    }

    // Template wrapper
    if (template) {
        lines.push('void solve() {');
        lines.push('    // Your solution here');
        lines.push('    ');
        lines.push('}');
        lines.push('');
        lines.push('int main() {');
        if (fastIO) {
            lines.push('    FAST_IO');
        }
        lines.push('    int t = 1;');
        lines.push('    cin >> t;');
        lines.push('    while (t--) {');
        lines.push('        solve();');
        lines.push('    }');
        lines.push('    return 0;');
        lines.push('}');
    } else {
        lines.push('int main() {');
        if (fastIO) {
            lines.push('    FAST_IO');
        }
        lines.push('    // Your code here');
        lines.push('    ');
        lines.push('    return 0;');
        lines.push('}');
    }

    return lines.join('\n');
}

function generateJava(fastIO, typedefs, modular, template) {
    let lines = [];

    lines.push('import java.util.*;');
    if (fastIO) {
        lines.push('import java.io.*;');
    }
    lines.push('');

    lines.push('public class Main {');

    if (modular) {
        lines.push('    static final long MOD = 1_000_000_007L;');
        lines.push('');
        lines.push('    static long modAdd(long a, long b) {');
        lines.push('        return ((a % MOD) + (b % MOD)) % MOD;');
        lines.push('    }');
        lines.push('');
        lines.push('    static long modMul(long a, long b) {');
        lines.push('        return ((a % MOD) * (b % MOD)) % MOD;');
        lines.push('    }');
        lines.push('');
        lines.push('    static long modPow(long base, long exp) {');
        lines.push('        long result = 1;');
        lines.push('        base %= MOD;');
        lines.push('        while (exp > 0) {');
        lines.push('            if ((exp & 1) == 1) result = modMul(result, base);');
        lines.push('            base = modMul(base, base);');
        lines.push('            exp >>= 1;');
        lines.push('        }');
        lines.push('        return result;');
        lines.push('    }');
        lines.push('');
        lines.push('    static long modInv(long a) {');
        lines.push('        return modPow(a, MOD - 2);');
        lines.push('    }');
        lines.push('');
    }

    if (template) {
        lines.push('    static void solve(Scanner sc, StringBuilder sb) {');
        lines.push('        // Your solution here');
        lines.push('        ');
        lines.push('    }');
        lines.push('');
    }

    lines.push('    public static void main(String[] args) {');

    if (fastIO) {
        lines.push('        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));');
        lines.push('        Scanner sc = new Scanner(br);');
        lines.push('        StringBuilder sb = new StringBuilder();');
    } else {
        lines.push('        Scanner sc = new Scanner(System.in);');
        lines.push('        StringBuilder sb = new StringBuilder();');
    }

    lines.push('');

    if (template) {
        lines.push('        int t = sc.nextInt();');
        lines.push('        while (t-- > 0) {');
        lines.push('            solve(sc, sb);');
        lines.push('        }');
    } else {
        lines.push('        // Your code here');
        lines.push('        ');
    }

    lines.push('');
    lines.push('        System.out.print(sb);');
    lines.push('    }');
    lines.push('}');

    if (typedefs) {
        // Add as comment since Java doesn't have typedefs
        lines.unshift('');
        lines.unshift('// Note: Java has no typedef. Use these as naming conventions:');
        lines.unshift('// ll → long, vi → ArrayList<Integer>, pii → int[]{a,b}');
        lines.unshift('// vvi → ArrayList<ArrayList<Integer>>');
    }

    return lines.join('\n');
}

function generatePython(fastIO, typedefs, modular, template) {
    let lines = [];

    if (fastIO) {
        lines.push('import sys');
        lines.push('input = sys.stdin.readline');
        lines.push('');
    }

    if (modular) {
        lines.push('# ── Modular Arithmetic ──');
        lines.push('MOD = 10**9 + 7');
        lines.push('');
        lines.push('def mod_add(a, b, m=MOD):');
        lines.push('    return (a % m + b % m) % m');
        lines.push('');
        lines.push('def mod_mul(a, b, m=MOD):');
        lines.push('    return (a % m) * (b % m) % m');
        lines.push('');
        lines.push('def mod_pow(base, exp, m=MOD):');
        lines.push('    return pow(base, exp, m)');
        lines.push('');
        lines.push('def mod_inv(a, m=MOD):');
        lines.push('    return pow(a, m - 2, m)  # Fermat\'s little theorem');
        lines.push('');
    }

    if (typedefs) {
        lines.push('# ── Shorthand Utilities ──');
        lines.push('from collections import defaultdict, deque, Counter');
        lines.push('from itertools import accumulate, permutations, combinations');
        lines.push('from functools import lru_cache');
        lines.push('from math import gcd, lcm, isqrt, ceil, log2');
        lines.push('from bisect import bisect_left, bisect_right');
        lines.push('from heapq import heappush, heappop');
        lines.push('');
        lines.push('def ii(): return int(input())');
        lines.push('def mi(): return map(int, input().split())');
        lines.push('def li(): return list(map(int, input().split()))');
        lines.push('def si(): return input().strip()');
        lines.push('');
    }

    if (template) {
        lines.push('def solve():');
        lines.push('    # Your solution here');
        lines.push('    pass');
        lines.push('');
        lines.push('');
        lines.push('t = int(input())');
        lines.push('for _ in range(t):');
        lines.push('    solve()');
    } else {
        lines.push('# Your code here');
        lines.push('');
    }

    return lines.join('\n');
}

// Generate on page load with defaults
document.addEventListener('DOMContentLoaded', generateTemplate);
