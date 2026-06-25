import json
import math
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db.models import F
from .models import ToolMetadata


# ──────────────────────────────────────────────
# Seed data for initial tool creation
# ──────────────────────────────────────────────
TOOL_SEED = [
    {'name': 'Graph Edge-List Formatter', 'slug': 'graph-edge-list', 'category': 'graph'},
    {'name': '2D Grid / Matrix Pad', 'slug': 'grid-matrix-pad', 'category': 'graph'},
    {'name': 'Level-Order Tree Array Restructurer', 'slug': 'tree-array', 'category': 'graph'},
    {'name': 'Time Complexity & Constraint Matrix', 'slug': 'complexity-matrix', 'category': 'math'},
    {'name': 'Bitwise Operation & Bitmask Explorer', 'slug': 'bitwise-explorer', 'category': 'math'},
    {'name': 'Modular Arithmetic Engine', 'slug': 'modular-calc', 'category': 'math'},
    {'name': 'Fast I/O Template Synthesizer', 'slug': 'fastio-template', 'category': 'syntax'},
]

# Map slugs to template file names
SLUG_TEMPLATE_MAP = {
    'graph-edge-list': 'tools/graph_edge_list.html',
    'grid-matrix-pad': 'tools/grid_matrix_pad.html',
    'tree-array': 'tools/tree_array.html',
    'complexity-matrix': 'tools/complexity_matrix.html',
    'bitwise-explorer': 'tools/bitwise_explorer.html',
    'modular-calc': 'tools/modular_calc.html',
    'fastio-template': 'tools/fastio_template.html',
}


def _ensure_tools_exist():
    """Create seed ToolMetadata rows if they don't exist yet."""
    if ToolMetadata.objects.count() < len(TOOL_SEED):
        for seed in TOOL_SEED:
            ToolMetadata.objects.get_or_create(
                slug=seed['slug'],
                defaults={'name': seed['name'], 'category': seed['category']},
            )


def index(request):
    """Landing page – 3-category grid of all tools."""
    _ensure_tools_exist()
    tools = ToolMetadata.objects.all()
    categories = {
        'graph': {
            'title': 'Graph & Structural Parsers',
            'subtitle': 'Client-Side JavaScript Engine',
            'icon': '⬡',
            'tools': [],
        },
        'math': {
            'title': 'Algorithmic Math & Analytics',
            'subtitle': 'Client-Side & Server-Side Hybrid',
            'icon': 'Σ',
            'tools': [],
        },
        'syntax': {
            'title': 'Syntax Boilerplate & Macro Builders',
            'subtitle': 'Client-Side',
            'icon': '⌘',
            'tools': [],
        },
    }
    for t in tools:
        if t.category in categories:
            categories[t.category]['tools'].append(t)
    return render(request, 'tools/index.html', {'categories': categories})


def tool_page(request, slug):
    """Render a specific tool page, incrementing its usage count atomically."""
    _ensure_tools_exist()
    tool = get_object_or_404(ToolMetadata, slug=slug)
    # Atomic increment
    ToolMetadata.objects.filter(pk=tool.pk).update(usage_count=F('usage_count') + 1)
    tool.refresh_from_db()
    template = SLUG_TEMPLATE_MAP.get(slug, 'tools/index.html')
    return render(request, template, {'tool': tool})


# ──────────────────────────────────────────────
# Modular Arithmetic API (Server-Side)
# ──────────────────────────────────────────────

def _extended_gcd(a, b):
    """Extended Euclidean Algorithm. Returns (gcd, x, y) such that a*x + b*y = gcd."""
    if a == 0:
        return b, 0, 1
    gcd, x1, y1 = _extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1
    return gcd, x, y


def _mod_inverse(a, m):
    """Compute modular inverse of a mod m via extended Euclidean algorithm.
    Returns None if inverse doesn't exist (gcd(a, m) != 1)."""
    gcd, x, _ = _extended_gcd(a % m, m)
    if gcd != 1:
        return None
    return x % m


def _prime_factors(n):
    """Return list of (prime, exponent) pairs for the prime factorization of |n|."""
    n = abs(n)
    if n <= 1:
        return []
    factors = []
    d = 2
    while d * d <= n:
        exp = 0
        while n % d == 0:
            n //= d
            exp += 1
        if exp > 0:
            factors.append({'prime': d, 'exponent': exp})
        d += 1
    if n > 1:
        factors.append({'prime': n, 'exponent': 1})
    return factors


@csrf_exempt
@require_POST
def modular_calc_api(request):
    """POST /api/modular-calc/
    Body: {"a": int, "b": int, "m": int}
    Returns: {"gcd_ab": ..., "gcd_am": ..., "mod_inverse": ... | null,
              "prime_factors_a": [...], "prime_factors_b": [...]}
    """
    try:
        body = json.loads(request.body)
        a = int(body.get('a', 0))
        b = int(body.get('b', 0))
        m = int(body.get('m', 1))
    except (json.JSONDecodeError, ValueError, TypeError):
        return JsonResponse({'error': 'Invalid input. Provide integers a, b, m.'}, status=400)

    if m == 0:
        return JsonResponse({'error': 'Modulus m must be non-zero.'}, status=400)

    gcd_ab = math.gcd(a, b)
    gcd_am = math.gcd(a, m)
    inverse = _mod_inverse(a, m)
    factors_a = _prime_factors(a)
    factors_b = _prime_factors(b)

    # Increment usage counter for modular-calc tool
    ToolMetadata.objects.filter(slug='modular-calc').update(usage_count=F('usage_count') + 1)

    return JsonResponse({
        'a': a,
        'b': b,
        'm': m,
        'gcd_ab': gcd_ab,
        'gcd_am': gcd_am,
        'mod_inverse': inverse,
        'a_mod_m': a % m,
        'prime_factors_a': factors_a,
        'prime_factors_b': factors_b,
    })
