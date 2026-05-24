"""
Agent Forge — Gerador de contratos
===================================
Lê um blueprint JSON e gera os 9 ficheiros .md do agent.

Uso:
    python generate.py --blueprint path/to/blueprint.json
    python generate.py --blueprint blueprint.json --output ../agents/meu-agent/
"""
from __future__ import annotations

import io
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import click
from rich.console import Console
from rich.table import Table

# Força UTF-8 no stdout do Windows (evita UnicodeEncodeError com cp1252)
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

console = Console(force_terminal=True, legacy_windows=False)

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = ROOT / "templates"
TAXONOMIES_PATH = ROOT / "taxonomies.json"
AGENTS_DIR = ROOT / "agents"
WEB_AGENTS_TS = ROOT / "web" / "src" / "data" / "agents.ts"

CONTRACT_FILES = [
    "agent.md",
    "loop.md",
    "planner.md",
    "skills.md",
    "toolbox.md",
    "executor.md",
    "rules.md",
    "hooks.md",
    "memory.md",
]


def load_taxonomies() -> dict[str, Any]:
    return json.loads(TAXONOMIES_PATH.read_text(encoding="utf-8"))


def load_blueprint(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def enrich_blueprint(bp: dict[str, Any], tax: dict[str, Any]) -> dict[str, Any]:
    """Adiciona campos derivados: descrições humanas a partir de taxonomias."""
    enriched = dict(bp)

    tipo_match = next((t for t in tax["tipos_agent"] if t["id"] == bp.get("tipo")), None)
    enriched["tipo_descricao"] = tipo_match["descricao"] if tipo_match else ""

    arq_match = next(
        (a for a in tax["arquiteturas_cognitivas"] if a["id"] == bp.get("arquitetura_cognitiva")),
        None,
    )
    enriched["arquitetura_descricao"] = arq_match["descricao"] if arq_match else ""

    enriched.setdefault("metadata", {})
    enriched["metadata"].setdefault("criado_em", datetime.now().isoformat(timespec="seconds"))
    enriched["metadata"].setdefault("versao_blueprint", "1.0.0")
    enriched["metadata"].setdefault("criado_por", "agent-forge")
    enriched["metadata"].setdefault("tags", [])
    return enriched


def render(template: str, ctx: dict[str, Any]) -> str:
    """
    Renderer simples (sem dependência externa):
    - {{path.to.key}}  → substitui por valor
    - {{#each list}} ... {{this.field}} ... {{/each}}  → itera
    - {{#if cond}} ... {{/if}}  → condicional simples
    """
    text = template

    text = _render_each(text, ctx)
    text = _render_if(text, ctx)
    text = _render_vars(text, ctx)

    return text


def _resolve_path(ctx: dict[str, Any], path: str) -> Any:
    parts = path.split(".")
    value: Any = ctx
    for part in parts:
        if isinstance(value, dict):
            value = value.get(part, "")
        else:
            return ""
    return value


def _format_value(value: Any) -> str:
    if value is None or value == "":
        return "_(não definido)_"
    if isinstance(value, bool):
        return "✅" if value else "❌"
    if isinstance(value, (dict, list)):
        return f"```json\n{json.dumps(value, indent=2, ensure_ascii=False)}\n```"
    return str(value)


def _render_vars(text: str, ctx: dict[str, Any]) -> str:
    pattern = re.compile(r"\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}")

    def repl(m: re.Match[str]) -> str:
        return _format_value(_resolve_path(ctx, m.group(1)))

    return pattern.sub(repl, text)


def _render_each(text: str, ctx: dict[str, Any]) -> str:
    pattern = re.compile(r"\{\{#each\s+([a-zA-Z0-9_.]+)\s*\}\}(.*?)\{\{/each\}\}", re.DOTALL)

    def repl(m: re.Match[str]) -> str:
        items = _resolve_path(ctx, m.group(1))
        block = m.group(2)
        if not isinstance(items, list) or not items:
            return "_(nenhum)_"
        out_parts = []
        for item in items:
            item_ctx = {**ctx, "this": item}
            rendered = _render_if(block, item_ctx)
            rendered = _render_vars(rendered, item_ctx)
            out_parts.append(rendered)
        return "".join(out_parts)

    return pattern.sub(repl, text)


def _render_if(text: str, ctx: dict[str, Any]) -> str:
    pattern = re.compile(r"\{\{#if\s+([a-zA-Z0-9_.]+)\s*\}\}(.*?)\{\{/if\}\}", re.DOTALL)

    def repl(m: re.Match[str]) -> str:
        value = _resolve_path(ctx, m.group(1))
        if value:
            return m.group(2)
        return ""

    return pattern.sub(repl, text)


def _nome_para_var_js(nome: str) -> str:
    """kebab-case → camelCase para import TS (ex: doc-tutor → docTutor)."""
    partes = nome.split("-")
    return partes[0] + "".join(p.capitalize() for p in partes[1:])


def sync_web_agents() -> None:
    """Regenera web/src/data/agents.ts a partir de agents/*/blueprint.json."""
    if not WEB_AGENTS_TS.parent.exists():
        return

    blueprints = sorted(AGENTS_DIR.glob("*/blueprint.json"))
    imports: list[str] = []
    entries: list[str] = []

    for bp_path in blueprints:
        bp = json.loads(bp_path.read_text(encoding="utf-8"))
        nome = bp.get("nome") or bp_path.parent.name
        var = _nome_para_var_js(nome)
        rel = f"@forge/agents/{nome}/blueprint.json"
        imports.append(f'import {var} from "{rel}";')
        entries.append(f"  {var} as AgentBlueprint,")

    content = "\n".join(imports) + "\n\n"
    content += """export type AgentBlueprint = {
  nome: string;
  nome_amigavel?: string;
  descricao?: string;
  tipo?: string;
  arquitetura_cognitiva?: string;
  objetivo?: string;
  skills?: unknown[];
  metadata?: { criado_em?: string };
};

/** Gerado automaticamente por scripts/generate.py — não editar à mão. */
export const agents: AgentBlueprint[] = [
"""
    content += "\n".join(entries) + "\n];\n"

    WEB_AGENTS_TS.write_text(content, encoding="utf-8")
    console.print(f"[green]OK[/green] UI atualizada: [cyan]{WEB_AGENTS_TS.relative_to(ROOT)}[/cyan]")


def generate_agent(
    blueprint_path: Path,
    output_dir: Path | None = None,
    *,
    runtime: bool = False,
) -> Path:
    bp = load_blueprint(blueprint_path)
    tax = load_taxonomies()
    ctx = enrich_blueprint(bp, tax)

    nome = ctx.get("nome", "agent-sem-nome")
    out = output_dir or (AGENTS_DIR / nome)
    out.mkdir(parents=True, exist_ok=True)

    (out / "blueprint.json").write_text(
        json.dumps(ctx, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    table = Table(title=f"Gerando agent: {nome}", show_lines=False)
    table.add_column("Contrato", style="cyan")
    table.add_column("Status", style="green")

    for filename in CONTRACT_FILES:
        template_path = TEMPLATES_DIR / f"{filename}.template"
        if not template_path.exists():
            table.add_row(filename, "[red]template ausente[/red]")
            continue
        rendered = render(template_path.read_text(encoding="utf-8"), ctx)
        (out / filename).write_text(rendered, encoding="utf-8")
        table.add_row(filename, "[green]OK[/green]")

    console.print(table)

    if runtime:
        from export_runtime_contracts import export_from_blueprint

        export_from_blueprint(ctx, out)
        console.print("[green]OK[/green] Contratos runtime (YAML + contracts/) exportados")

    sync_web_agents()

    console.print(f"\n[bold green]OK[/bold green] Agent gerado em: [cyan]{out}[/cyan]\n")
    return out


@click.command()
@click.option(
    "--blueprint",
    "-b",
    required=True,
    type=click.Path(exists=True, path_type=Path),
    help="Caminho para o blueprint JSON",
)
@click.option(
    "--output",
    "-o",
    type=click.Path(path_type=Path),
    help="Pasta de saída (default: agents/<nome>/)",
)
@click.option(
    "--runtime",
    is_flag=True,
    help="Também exporta contratos YAML para agent-forge/runtime",
)
def cli(blueprint: Path, output: Path | None, runtime: bool) -> None:
    """Gera os 9 contratos MD de um agent a partir do blueprint JSON."""
    try:
        generate_agent(blueprint, output, runtime=runtime)
    except Exception as exc:
        console.print(f"[bold red]FALHA:[/bold red] {exc}")
        sys.exit(1)


if __name__ == "__main__":
    cli()
