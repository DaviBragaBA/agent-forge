# Comparação: Agent Forge vs Curso (Módulo 4)

Material oficial: [modulo04-agentes-autonomos](https://github.com/unipds-engenharia-de-ia-aplicada/engenharia-de-software-com-ia-aplicada/tree/main/modulo04-agentes-autonomos) (clone local em `../modulo04-agentes-autonomos/`).

## Layout de ficheiros

| Aspeto | Curso (aula03+) | Agent Forge |
|--------|-----------------|-------------|
| Fonte de verdade | 9 ficheiros `.md` com bloco ` ```yaml ` | `blueprint.json` + templates |
| Loop, planner, toolbox, executor | `contracts/loop.md`, `planner.md`, … | Raiz **ou** `contracts/` após export |
| Agent, skills, rules, hooks, memory | Raiz do agent | Raiz do agent |
| Extra | `commands.md` (opcional) | Não gerado |
| Legado flat | — | `loop.md`, `planner.md`, … na raiz (templates humanos) |

## Nomenclatura e formato

| Conceito | Curso | Agent Forge (blueprint) | Após `export_runtime_contracts.py` |
|----------|-------|-------------------------|-------------------------------------|
| Skills | `habilidades[]` em YAML | `skills[]` em JSON | `habilidades` em `skills.md` |
| Toolbox | `ferramentas[]` (nome + entrada) | `toolbox[]` (lista de nomes) | `ferramentas` em `contracts/toolbox.md` |
| Tipo de agent | `task_based`, `interactive`, … | `task-based`, `interactive`, … | Mapeado para `task_based`, etc. |
| Objetivo no loop | slug curto (`resolver_incidente`) | frase longa no blueprint | slug derivado do `nome` |
| Planner | `formato_saida` + `regras[]` | `arquitetura_cognitiva` no blueprint | Gerado a partir da arquitetura |
| Rules | `ferramentas_obrigatorias`, `limites`, `politicas` | `rules.obrigatorias`, `limites_ferramenta` | Convertido para formato curso |
| Hooks | `ganchos` (antes_da_etapa, …) | `hooks[]` com evento/acao | `ganchos` fixos (log/alerta) |
| Memória | `memoria_curta`, `resumo_final` | `memory.curta/longa/…` | `memoria_curta` + flags longa |

## Mapeamento de tipos de agent

| Agent Forge (`blueprint.json`) | Runtime curso (`agent.md`) |
|--------------------------------|----------------------------|
| `task-based` | `task_based` |
| `interactive` | `interactive` |
| `goal-oriented` | `goal_oriented` |
| `autonomous` | `autonomous` |

## Critérios de parada (loop)

| Agent Forge | Curso (`condicoes_parada`) |
|-------------|----------------------------|
| `objetivo_alcancado` | `objetivo_alcancado` |
| `limite_etapas` | `max_etapas_excedido` |
| `falta_progresso` | `sem_progresso` |
| `tempo_max` | `limite_tempo_excedido` |

## Validadores

| Ferramenta | O que valida |
|------------|--------------|
| `scripts/validate.py` | Schema JSON + toolbox ⊆ skills (blueprint) |
| `runtime/main.py validar` | YAML nos MD + consistência curso (oficial) |

## Fluxo recomendado

1. Criar/editar `agents/<nome>/blueprint.json` (wizard ou manual).
2. `python scripts/generate.py -b agents/<nome>/blueprint.json --runtime` — MD legíveis + contratos runtime.
3. `python scripts/validate.py agents/<nome>/` — validação Agent Forge.
4. `cd runtime; python main.py validar --agente ../agents/<nome>` — validação curso.
5. `python main.py rodar --agente ../agents/<nome> --entrada "..."` — execução (requer `.env` com chave LLM).

## Exemplo de referência do curso

`modulo04-agentes-autonomos/aula03-contratos/monitor-agent/` — agent task-based de incidentes.

## Exemplo Agent Forge alinhado

`agent-forge/agents/pos-ia-tutor/` — tutor interativo ReAct; validado pelo runtime oficial.

## Comparação de templates (estrutura)

| Ficheiro | `monitor-agent` (curso) | Saída `generate.py` | Saída `export_runtime_contracts.py` |
|----------|-------------------------|---------------------|-------------------------------------|
| `agent.md` | YAML + doc de campos | MD legível (prosa) | YAML runtime (sobrescreve agent.md) |
| `loop.md` | `contracts/loop.md` | `loop.md` na raiz | `contracts/loop.md` |
| `planner.md` | `contracts/planner.md` | `planner.md` na raiz | `contracts/planner.md` |
| `skills.md` | `habilidades` em YAML | secções por skill | `habilidades` em YAML |
| `toolbox.md` | `contracts/toolbox.md` | `toolbox.md` na raiz | `contracts/toolbox.md` |
| `executor.md` | `contracts/executor.md` | `executor.md` na raiz | `contracts/executor.md` |
| `rules.md` | YAML | MD legível | YAML runtime |
| `hooks.md` | `ganchos` | lista de eventos | `ganchos` (runtime) |
| `memory.md` | `memoria_curta` | flags curta/longa/… | `memoria_curta` + resumo |
| `commands.md` | opcional (curso) | não gerado | não gerado |

**Nota:** Com `--runtime`, tens **duas camadas**: MD legíveis na raiz (templates) + YAML em `contracts/` e nos MD de raiz que o runtime lê (`agent.md`, `skills.md`, etc.). O runtime **só** usa os blocos YAML, não o texto em prosa.

## Estado do alinhamento `pos-ia-tutor` (última verificação)

| Verificação | Comando | Resultado |
|-------------|---------|-----------|
| Blueprint Agent Forge | `python scripts/validate.py agents/pos-ia-tutor/` | OK |
| Runtime curso | `python main.py validar --agente ../agents/pos-ia-tutor` | VÁLIDO (0 avisos) |
