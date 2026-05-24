"""
Exporta contratos no formato do runtime oficial (curso Módulo 4).

Gera YAML em blocos ```yaml dentro dos .md e pasta contracts/
para compatibilidade com agent-forge/runtime (Spec Driven Agents).

Uso:
    python export_runtime_contracts.py agents/pos-ia-tutor/blueprint.json
"""

from __future__ import annotations

import io
import json
import sys
from pathlib import Path
from typing import Any

import click
import yaml
from rich.console import Console

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

console = Console(force_terminal=True, legacy_windows=False)
ROOT = Path(__file__).resolve().parent.parent

TIPO_RUNTIME = {
    "task-based": "task_based",
    "interactive": "interactive",
    "goal-oriented": "goal_oriented",
    "autonomous": "autonomous",
}

CRITERIO_PARADA = {
    "objetivo_alcancado": "objetivo_alcancado",
    "limite_etapas": "max_etapas_excedido",
    "falta_progresso": "sem_progresso",
    "tempo_max": "limite_tempo_excedido",
}


def _regras_planner_dominio(bp: dict[str, Any]) -> list[str]:
    """Regras do planner derivadas do blueprint (sem hardcode de outro agent)."""
    regras: list[str] = []
    skill_names = {s.get("nome") for s in bp.get("skills", []) if isinstance(s, dict)}
    obrigatorias = bp.get("rules", {}).get("obrigatorias") or []
    campos = bp.get("contrato_saida", {}).get("campos_obrigatorios") or []

    if obrigatorias:
        regras.append(
            "so usar FINALIZAR apos executar as ferramentas obrigatorias: "
            + ", ".join(obrigatorias)
        )
    if campos:
        regras.append("no FINALIZAR, o artefato deve incluir: " + ", ".join(campos))

    if "analisar_pedido" in skill_names and "gerar_prompt" in skill_names:
        regras.append("usar analisar_pedido antes de gerar_prompt quando o pedido for vago")
        regras.append("usar refinar_prompt se avaliar_prompt reprovar o rascunho")
    if "listar_materiais" in skill_names and "ler_capitulo" in skill_names:
        regras.append("consultar listar_materiais antes de ler_capitulo quando o material nao for conhecido")
        regras.append("resumir ou responder apenas com base em texto obtido via ferramentas")

    regras.append("nao inventar dados que deveriam vir de ferramentas")
    return regras


def _normalize_type(value: Any) -> str:
    if not isinstance(value, str):
        return "string"
    low = value.lower()
    if "bool" in low:
        return "bool"
    if "int" in low:
        return "int"
    if "float" in low or "number" in low:
        return "float"
    if "list" in low or "array" in low:
        return "list"
    if "object" in low:
        return "object"
    return "string"


def _typed_fields(spec: dict[str, Any] | None) -> dict[str, str]:
    if not spec:
        return {}
    out: dict[str, str] = {}
    for key, val in spec.items():
        out[key] = _normalize_type(val) if isinstance(val, str) else "string"
    return out


def _md_with_yaml(title: str, intro: str, data: dict[str, Any]) -> str:
    yaml_text = yaml.dump(data, allow_unicode=True, default_flow_style=False, sort_keys=False)
    return f"# {title}\n\n> {intro}\n\n---\n\n```yaml\n{yaml_text.strip()}\n```\n"


def export_from_blueprint(bp: dict[str, Any], out: Path) -> None:
    contracts = out / "contracts"
    contracts.mkdir(parents=True, exist_ok=True)

    tipo = TIPO_RUNTIME.get(bp.get("tipo", ""), bp.get("tipo", "task_based"))
    objetivo_slug = (
        bp.get("nome", "agent")
        .replace("-", "_")
        .replace(" ", "_")[:40]
    )

    # agent.md
    agent_yaml = {
        "nome": bp["nome"],
        "descricao": bp.get("descricao", ""),
        "tipo": tipo,
        "objetivo": objetivo_slug,
        "contrato_saida": {
            "formato": bp.get("contrato_saida", {}).get("formato", "markdown"),
            "campos_obrigatorios": bp.get("contrato_saida", {}).get("campos_obrigatorios", []),
        },
    }
    (out / "agent.md").write_text(
        _md_with_yaml("agent.md", "Identidade do agente (runtime oficial).", agent_yaml),
        encoding="utf-8",
    )

    # contracts/loop.md
    loop_bp = bp.get("loop", {})
    loop_yaml = {
        "objetivo": objetivo_slug,
        "ciclo": {"max_etapas": loop_bp.get("max_iteracoes", 8)},
        "condicoes_parada": [
            CRITERIO_PARADA.get(c, c)
            for c in loop_bp.get(
                "criterios_parada",
                ["objetivo_alcancado", "max_etapas_excedido", "sem_progresso", "limite_tempo_excedido"],
            )
        ],
    }
    (contracts / "loop.md").write_text(
        _md_with_yaml("loop.md", "Motor do ciclo.", loop_yaml),
        encoding="utf-8",
    )

    # contracts/planner.md
    arq = bp.get("arquitetura_cognitiva", "react")
    regras_planner = [
        "sempre definir proxima acao",
        "nunca retornar texto livre",
        "usar PERGUNTAR_USUARIO quando faltar informacao critica",
    ]
    if tipo == "interactive":
        regras_planner.append("no modo interactive, validar ambiguidades com o usuario antes de agir")
    if arq == "react":
        regras_planner.append("pensar passo a passo: uma ferramenta por vez, avaliar resultado antes da proxima")
    elif arq == "plan-and-execute":
        regras_planner.append("planejar sequencia completa antes de executar a primeira ferramenta")
    elif arq == "reflection":
        regras_planner.append("auto-avaliar qualidade da saida antes de FINALIZAR")

    regras_planner.extend(_regras_planner_dominio(bp))

    planner_yaml = {
        "formato_saida": {
            "proxima_acao": "CHAMAR_FERRAMENTA | FINALIZAR | PERGUNTAR_USUARIO",
            "nome_ferramenta": "opcional",
            "argumentos_ferramenta": "opcional",
            "criterio_sucesso": "obrigatorio",
            "pergunta": "opcional (obrigatorio se PERGUNTAR_USUARIO)",
        },
        "regras": regras_planner,
    }
    (contracts / "planner.md").write_text(
        _md_with_yaml("planner.md", "Contrato de decisao da LLM.", planner_yaml),
        encoding="utf-8",
    )

    # skills.md
    habilidades = []
    for sk in bp.get("skills", []):
        habilidades.append(
            {
                "nome": sk["nome"],
                "descricao": sk.get("descricao", ""),
                "entrada": _typed_fields(sk.get("entrada")),
                "saida": _typed_fields(sk.get("saida")),
            }
        )
    (out / "skills.md").write_text(
        _md_with_yaml("skills.md", "Habilidades (interface).", {"habilidades": habilidades}),
        encoding="utf-8",
    )

    # contracts/toolbox.md
    toolbox_names = bp.get("toolbox") or [s["nome"] for s in bp.get("skills", [])]
    skills_by_name = {s["nome"]: s for s in bp.get("skills", [])}
    ferramentas = []
    for nome in toolbox_names:
        sk = skills_by_name.get(nome, {})
        ferramentas.append({"nome": nome, "entrada": _typed_fields(sk.get("entrada"))})
    (contracts / "toolbox.md").write_text(
        _md_with_yaml("toolbox.md", "Ferramentas autorizadas.", {"ferramentas": ferramentas}),
        encoding="utf-8",
    )

    # contracts/executor.md
    executor_yaml = {
        "execucao": {"validar_entrada": True, "tentar_novamente_em_falha": True},
        "pos_execucao": {"avaliar_resultado": True},
    }
    (contracts / "executor.md").write_text(
        _md_with_yaml("executor.md", "Execucao de ferramentas.", executor_yaml),
        encoding="utf-8",
    )

    # rules.md
    rules_bp = bp.get("rules", {})
    chamadas: dict[str, int] = {"total": 0}
    for lim in rules_bp.get("limites_ferramenta", []):
        if isinstance(lim, dict) and "ferramenta" in lim:
            chamadas[lim["ferramenta"]] = lim.get("max_chamadas", 3)
            chamadas["total"] += chamadas[lim["ferramenta"]]
    if chamadas["total"] == 0:
        chamadas["total"] = len(toolbox_names) * 3

    rules_yaml: dict[str, Any] = {
        "ferramentas_obrigatorias": rules_bp.get("obrigatorias", []),
        "limites": {
            "max_etapas": loop_bp.get("max_iteracoes", 8),
            "sem_progresso": 3,
            "limite_tempo_segundos": loop_bp.get("tempo_max_segundos", 120),
            "chamadas_ferramenta": chamadas,
        },
        "acoes_sensiveis": rules_bp.get("acoes_com_confirmacao", []),
        "politicas": rules_bp.get("proibidas", []) + [
            "nao inventar fontes ou paginas",
            "citar material consultado em toda resposta final",
        ],
    }
    (out / "rules.md").write_text(
        _md_with_yaml("rules.md", "Limites e politicas.", rules_yaml),
        encoding="utf-8",
    )

    # hooks.md
    hooks_yaml = {
        "ganchos": {
            "antes_da_etapa": "log",
            "apos_etapa": "log",
            "antes_da_acao": "log",
            "apos_acao": "log",
            "em_erro": "alerta",
        }
    }
    (out / "hooks.md").write_text(
        _md_with_yaml("hooks.md", "Observabilidade.", hooks_yaml),
        encoding="utf-8",
    )

    # memory.md
    mem = bp.get("memory", {})
    memory_yaml = {
        "memoria_curta": {
            "guardar": [
                "resultado_de_ferramenta",
                "decisao_do_planejador",
                "resumo_gerado",
                "fontes_consultadas",
            ],
            "descartar": ["prompt_sistema_completo", "argumentos_mock_internos"],
            "max_registros": mem.get("limite_registros", 20),
        },
        "resumo_final": {
            "max_linhas": 8,
            "campos": ["objetivo", "etapas_executadas", "artefato_final", "fontes"],
        },
    }
    if mem.get("longa"):
        memory_yaml["memoria_longa"] = {"ativa": True, "aviso": "armazenar apenas fatos confirmados por ferramenta"}
    (out / "memory.md").write_text(
        _md_with_yaml("memory.md", "Memoria do agente.", memory_yaml),
        encoding="utf-8",
    )


@click.command()
@click.option(
    "--blueprint",
    "-b",
    required=True,
    type=click.Path(exists=True, path_type=Path),
    help="Blueprint JSON do agent",
)
@click.option(
    "--output",
    "-o",
    type=click.Path(path_type=Path),
    help="Pasta do agent (default: agents/<nome>/)",
)
def cli(blueprint: Path, output: Path | None) -> None:
    """Exporta contratos YAML para o runtime oficial do curso."""
    bp = json.loads(blueprint.read_text(encoding="utf-8"))
    out = output or (ROOT / "agents" / bp["nome"])
    export_from_blueprint(bp, out)
    console.print(f"[green]OK[/green] Contratos runtime em: [cyan]{out}[/cyan]")
    console.print(f"  contracts/: loop, planner, toolbox, executor")
    console.print(f"  Validar: cd runtime && python main.py validar --agente ../agents/{bp['nome']}")


if __name__ == "__main__":
    cli()
