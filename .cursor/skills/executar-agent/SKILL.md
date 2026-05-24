---
name: executar-agent
description: Executa um agent Agent Forge no Cursor sem API key — interpreta os contratos MD/YAML e corre o ciclo ReAct no chat. Use quando o utilizador disser "executar agent", "rodar agent", "usa o gerador-prompt", "gerador-prompt:", "doc-tutor:", ou quiser usar um agent forjado sem python main.py nem OpenAI.
---

# Executar Agent (Runtime Cursor)

> **O runtime é o Cursor.** Tu (o assistente) és o planejador, executor e avaliador. **Zero API key externa.**

## Quando usar

- "Executa o gerador-prompt"
- "Rodar agent doc-tutor com entrada: ..."
- "Usa o agent X para ..."
- Qualquer pedido que referencie `agent-forge/agents/<nome>/`

## Filosofia

O agent **não está no Python** — está na **especificação**. Lê os contratos e **executa o ciclo ReAct** no chat, usando ferramentas reais do Cursor (Read, Grep, Shell) quando a skill pedir dados reais.

---

## Passo 0 — Resolver qual agent

1. Se o utilizador disser o nome (`gerador-prompt`, `doc-tutor`), usa esse.
2. Senão, lista `agent-forge/agents/*/blueprint.json` e pergunta qual (ou o mais óbvio pelo contexto).

Pasta base: `agent-forge/agents/<nome>/`

---

## Passo 1 — Carregar contratos (obrigatório)

Lê **antes** de agir:

| Ficheiro | O quê |
|----------|--------|
| `blueprint.json` | Fonte única, loop, skills, rules |
| `agent.md` | Identidade, tipo, contrato de saída |
| `contracts/planner.md` | Formato de decisão + regras |
| `contracts/loop.md` | Max etapas, parada |
| `contracts/toolbox.md` | Ferramentas autorizadas |
| `skills.md` | Interfaces das skills |
| `rules.md` | Obrigatórias, limites, políticas |

Validação rápida (sem API, opcional mas recomendado na 1ª execução):

```bash
cd agent-forge && python scripts/validate.py agents/<nome>/
cd agent-forge/runtime && python main.py validar --agente ../agents/<nome>
```

Se falhar, corrige o blueprint antes de executar.

---

## Passo 2 — Ciclo ReAct (tu és o motor)

Repete até **objetivo alcançado** ou **max_iteracoes** (de `loop` / `rules`):

```
PERCEBER → PLANEJAR → AGIR → AVALIAR
```

### PERCEBER

- Entrada do utilizador + histórico desta conversa.
- Tipo do agent (`interactive`, `task-based`, etc.) do `agent.md`.

### PLANEJAR (decisão interna — segue planner.md)

Escolhe **exactamente uma**:

| proxima_acao | Quando |
|--------------|--------|
| `PERGUNTAR_USUARIO` | Tipo interactive e falta info crítica (usa AskQuestion se disponível) |
| `CHAMAR_FERRAMENTA` | Próxima skill da toolbox ainda não satisfeita |
| `FINALIZAR` | Objetivo atingido E regras obrigatórias cumpridas |

**Nunca** saltar `ferramentas_obrigatorias` de `rules.md` antes de FINALIZAR.

### AGIR — executar skills

Para cada skill em `toolbox`:

| tipo_implementacao | Como executar no Cursor |
|--------------------|-------------------------|
| **mock** | Tu produces a saída conforme `skills.md` (entrada/saída), de forma realista e coerente com a entrada |
| **rest/database/mcp** | Usa ferramentas reais (Read, Grep, Shell, MCP) se configurado; senão simula e avisa |

**Limites:** respeita `rules.limites` / `limites_ferramenta` do blueprint.

### AVALIAR

- Objetivo mais próximo?
- Repetição sem progresso (3x → parar com resumo)?
- Skill obrigatória em falta?

---

## Passo 3 — Entrega final (contrato de saída)

Quando `FINALIZAR`, entrega artefato no formato de `contrato_saida` do blueprint.

**Exemplo `gerador-prompt`:** markdown com `titulo`, `prompt_system`, `prompt_user`, `variaveis`, `checklist_qualidade`, `dicas_uso`.

**Exemplo `doc-tutor`:** markdown com `titulo`, `conteudo`, `fontes`, `proxima_acao_sugerida`.

---

## Passo 4 — Trace (observabilidade)

No fim, bloco curto:

```
--- trace ---
agent: <nome>
etapas: N
ferramentas: skill1 → skill2 → ...
status: objetivo_alcancado | limite_etapas | falta_progresso
---
```

---

## Comandos que o utilizador pode usar

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python
executar doc-tutor: Explica ReAct com base nos documentos do projeto
executar agent gerador-prompt
```

Parseia tudo depois de `:` como **entrada**.

---

## Proibido

- ❌ Pedir `OPENAI_API_KEY` ou mandar correr `main.py rodar` como passo **obrigatório**
- ❌ Ignorar `rules.md` ou skills obrigatórias
- ❌ Inventar ferramentas fora da toolbox
- ❌ Mais de 7 skills numa execução inventada (usa só as do contrato)

## Opcional (debug)

`python main.py rodar` em `agent-forge/runtime/` só se o utilizador **explicitamente** quiser testar o runtime Python com API — **não** é o fluxo default.

---

## Referências

- `agent-forge/docs/RUNTIME-CURSOR.md`
- Skill irmã: `criador-de-agents`
