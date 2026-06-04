#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Infra2015 reseptikirjaston kevyt laskuriesimerkki.

Käyttö:
    python resepti_laskuri_esimerkki.py Infra2015_reseptikirjasto.json REC_1621_PUTKIKAIVANTO_MAA

Tämä on tarkoituksella pieni ja helposti muokattava esimerkki.
Se ei käytä vaarallista vapaata evalia, vaan sallii vain nimetyt muuttujat ja
pienen joukon matemaattisia funktioita.
"""

from __future__ import annotations

import ast
import json
import math
import sys
from dataclasses import dataclass
from typing import Any


ALLOWED_FUNCS = {
    "max": max,
    "min": min,
    "round": round,
    "ceil": math.ceil,
    "floor": math.floor,
    "sqrt": math.sqrt,
    "abs": abs,
}


class SafeEval(ast.NodeVisitor):
    def __init__(self, variables: dict[str, Any]):
        self.variables = variables

    def visit(self, node):
        return super().visit(node)

    def visit_Expression(self, node: ast.Expression):
        return self.visit(node.body)

    def visit_Constant(self, node: ast.Constant):
        return node.value

    def visit_Name(self, node: ast.Name):
        if node.id in self.variables:
            return self.variables[node.id]
        if node.id in ("True", "False"):
            return node.id == "True"
        raise NameError(f"Tuntematon muuttuja: {node.id}")

    def visit_BinOp(self, node: ast.BinOp):
        left = self.visit(node.left)
        right = self.visit(node.right)
        if isinstance(node.op, ast.Add):
            return left + right
        if isinstance(node.op, ast.Sub):
            return left - right
        if isinstance(node.op, ast.Mult):
            return left * right
        if isinstance(node.op, ast.Div):
            return left / right
        if isinstance(node.op, ast.FloorDiv):
            return left // right
        if isinstance(node.op, ast.Mod):
            return left % right
        if isinstance(node.op, ast.Pow):
            return left ** right
        raise TypeError(f"Kielletty operaattori: {type(node.op).__name__}")

    def visit_UnaryOp(self, node: ast.UnaryOp):
        value = self.visit(node.operand)
        if isinstance(node.op, ast.UAdd):
            return +value
        if isinstance(node.op, ast.USub):
            return -value
        if isinstance(node.op, ast.Not):
            return not value
        raise TypeError(f"Kielletty unaarioperaattori: {type(node.op).__name__}")

    def visit_Compare(self, node: ast.Compare):
        left = self.visit(node.left)
        result = True
        for op, comp in zip(node.ops, node.comparators):
            right = self.visit(comp)
            if isinstance(op, ast.Eq):
                ok = left == right
            elif isinstance(op, ast.NotEq):
                ok = left != right
            elif isinstance(op, ast.Lt):
                ok = left < right
            elif isinstance(op, ast.LtE):
                ok = left <= right
            elif isinstance(op, ast.Gt):
                ok = left > right
            elif isinstance(op, ast.GtE):
                ok = left >= right
            else:
                raise TypeError(f"Kielletty vertailu: {type(op).__name__}")
            result = result and ok
            left = right
        return result

    def visit_IfExp(self, node: ast.IfExp):
        return self.visit(node.body) if self.visit(node.test) else self.visit(node.orelse)

    def visit_Call(self, node: ast.Call):
        if not isinstance(node.func, ast.Name) or node.func.id not in ALLOWED_FUNCS:
            raise NameError("Vain sallitut funktiot ovat käytössä: " + ", ".join(ALLOWED_FUNCS))
        args = [self.visit(a) for a in node.args]
        return ALLOWED_FUNCS[node.func.id](*args)

    def generic_visit(self, node):
        raise TypeError(f"Kielletty lausekeosa: {type(node).__name__}")


def safe_eval(expr: str, variables: dict[str, Any]) -> Any:
    tree = ast.parse(expr, mode="eval")
    return SafeEval(variables).visit(tree)


def load_library(path: str) -> dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def evaluate_recipe(library: dict[str, Any], recipe_id: str, user_inputs: dict[str, Any] | None = None) -> dict[str, Any]:
    user_inputs = user_inputs or {}
    recipes = {r["id"]: r for r in library["recipes"]}
    resources = {r["code"]: r for r in library["resources"]}

    if recipe_id not in recipes:
        raise KeyError(f"Reseptiä ei löydy: {recipe_id}")

    recipe = recipes[recipe_id]
    variables: dict[str, Any] = {}

    # Defaults from inputVariables
    for var in recipe.get("inputVariables", []):
        key = var["key"]
        variables[key] = user_inputs.get(key, var.get("default"))

    # Computed quantities in order
    computed_values = {}
    for key, expr in recipe.get("computedQuantities", {}).items():
        value = safe_eval(expr, variables)
        variables[key] = value
        computed_values[key] = value

    # Resource lines
    rows = []
    total_cost = 0.0
    total_sell = 0.0
    for line in recipe.get("resourceLines", []):
        resource_code = line["resourceCode"]

        # Placeholder resource code, e.g. pipe_resource_code -> M24
        if resource_code not in resources and resource_code in variables:
            resource_code = variables[resource_code]

        if resource_code not in resources:
            raise KeyError(f"Resurssia ei löydy: {resource_code}")

        qty = safe_eval(line["quantityExpression"], variables)
        res = resources[resource_code]
        cost = qty * float(res["costPrice"])
        sell = qty * float(res["sellPrice"])
        total_cost += cost
        total_sell += sell
        rows.append({
            "resourceCode": resource_code,
            "resourceName": res["name"],
            "unit": line.get("unit", res["unit"]),
            "quantity": qty,
            "costPrice": res["costPrice"],
            "sellPrice": res["sellPrice"],
            "costTotal": cost,
            "sellTotal": sell,
            "description": line.get("description", "")
        })

    return {
        "recipeId": recipe_id,
        "recipeName": recipe["name"],
        "inputs": variables,
        "computedQuantities": computed_values,
        "resourceRows": rows,
        "totalCost": total_cost,
        "totalSell": total_sell,
        "grossMargin": total_sell - total_cost,
        "grossMarginPercent": ((total_sell - total_cost) / total_sell * 100) if total_sell else 0
    }


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    library_path = sys.argv[1]
    recipe_id = sys.argv[2]
    library = load_library(library_path)
    result = evaluate_recipe(library, recipe_id)

    print(f"\n{result['recipeName']}")
    print("-" * len(result["recipeName"]))
    for row in result["resourceRows"]:
        print(f"{row['resourceCode']:>4}  {row['quantity']:10.2f} {row['unit']:<6}  {row['resourceName']:<55}  {row['sellTotal']:10.2f} €")

    print("\nYhteensä:")
    print(f"  Kustannus: {result['totalCost']:.2f} €")
    print(f"  Myynti:    {result['totalSell']:.2f} €")
    print(f"  Kate:      {result['grossMargin']:.2f} € ({result['grossMarginPercent']:.1f} %)")


if __name__ == "__main__":
    main()
