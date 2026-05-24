"""
Agent Forge — Validador de contratos
=====================================
Valida um agent gerado: schema, consistência skills↔toolbox, regras.

Uso:
    python validate.py path/to/agent/
    python validate.py ../agents/pos-ia-tutor/
"""
from __future__ import annotations

import io
import json
import sys
from pathlib import Path
from typing import Any

import click
from jsonschema import Draft7Validator
from rich.console import Console
from rich.table import Table

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

console = Console(force_terminal=True, legacy_windows=False)

ROOT = Path(__file__).resolve().parent.parent
SCHEMA_PATH = ROOT / "blueprint.schema.json"

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


class ValidationError:
    def __init__(self, severity: str, code: str, message: str) -> None:
        self.severity = severity
        self.code = code
        self.message = message


def load_schema() -> dict[str, Any]:
    return json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))


def validate_schema(blueprint: dict[str, Any]) -> list[ValidationError]:
    schema = load_schema()
    validator = Draft7Validator(schema)
    errors = []
    for err in sorted(validator.iter_errors(blueprint), key=lambda e: e.path):
        path = ".".join(str(p) for p in err.path) or "root"
        errors.append(ValidationError("erro", "schema", f"{path}: {err.message}"))
    return errors


def validate_consistency(blueprint: dict[str, Any]) -> list[ValidationError]:
    errors: list[ValidationError] = []

    skill_names = {s.get("nome") for s in blueprint.get("skills", []) if isinstance(s, dict)}
    toolbox = set(blueprint.get("toolbox") or [])

    for t in toolbox:
        if t not in skill_names:
            errors.append(
                ValidationError(
                    "erro",
                    "toolbox-orfa",
                    f"Toolbox referencia '{t}' que não existe em skills",
                )
            )

    orfas_skills = skill_names - toolbox
    for s in orfas_skills:
        errors.append(
            ValidationError(
                "aviso",
                "skill-nao-autorizada",
                f"Skill '{s}' declarada mas não está em toolbox (não poderá ser usada)",
            )
        )

    loop = blueprint.get("loop") or {}
    criterios = loop.get("criterios_parada") or []
    if "objetivo_alcancado" not in criterios and "limite_etapas" not in criterios:
        errors.append(
            ValidationError(
                "erro",
                "sem-criterio-parada",
                "Loop precisa de pelo menos 'objetivo_alcancado' OU 'limite_etapas'",
            )
        )

    rules = blueprint.get("rules") or {}
    obrigatorias = set(rules.get("obrigatorias") or [])
    for o in obrigatorias:
        if o not in skill_names:
            errors.append(
                ValidationError(
                    "aviso",
                    "obrigatoria-inexistente",
                    f"Regra obrigatória '{o}' não corresponde a nenhuma skill",
                )
            )

    if not blueprint.get("objetivo"):
        errors.append(
            ValidationError(
                "erro",
                "sem-objetivo",
                "Agent sem objetivo é só uma automação — defina 'objetivo'",
            )
        )

    return errors


def validate_files(agent_dir: Path) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if not (agent_dir / "blueprint.json").exists():
        errors.append(
            ValidationError("erro", "sem-blueprint", "Falta blueprint.json no agent")
        )
    for fname in CONTRACT_FILES:
        if not (agent_dir / fname).exists():
            errors.append(
                ValidationError("erro", "contrato-faltando", f"Contrato {fname} não existe")
            )
    return errors


def validate_agent(agent_dir: Path) -> tuple[list[ValidationError], dict[str, Any] | None]:
    file_errors = validate_files(agent_dir)
    if any(e.code == "sem-blueprint" for e in file_errors):
        return file_errors, None

    blueprint = json.loads((agent_dir / "blueprint.json").read_text(encoding="utf-8"))
    schema_errors = validate_schema(blueprint)
    consistency_errors = validate_consistency(blueprint)
    return file_errors + schema_errors + consistency_errors, blueprint


def render_report(agent_dir: Path, errors: list[ValidationError]) -> bool:
    table = Table(title=f"Validação: {agent_dir.name}", show_lines=False)
    table.add_column("Severidade", style="bold")
    table.add_column("Código", style="cyan")
    table.add_column("Mensagem")

    erros = [e for e in errors if e.severity == "erro"]
    avisos = [e for e in errors if e.severity == "aviso"]

    if not errors:
        console.print(f"[bold green]OK[/bold green] {agent_dir.name} passou em todas as validações")
        return True

    for e in errors:
        style = "red" if e.severity == "erro" else "yellow"
        table.add_row(
            f"[{style}]{e.severity.upper()}[/{style}]",
            e.code,
            e.message,
        )
    console.print(table)

    console.print(
        f"\n[red]{len(erros)} erro(s)[/red] · [yellow]{len(avisos)} aviso(s)[/yellow]\n"
    )
    return len(erros) == 0


@click.command()
@click.argument("agent_path", type=click.Path(exists=True, path_type=Path))
def cli(agent_path: Path) -> None:
    """Valida um agent gerado (schema + consistência)."""
    errors, _ = validate_agent(agent_path)
    ok = render_report(agent_path, errors)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    cli()
