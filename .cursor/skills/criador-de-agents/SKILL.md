---
name: criador-de-agents
description: Cria agents autônomos completos via wizard conversacional. Use quando o utilizador pedir "criar um agent", "novo agent", "agent forge", "spec driven agent", ou quiser gerar a estrutura de contratos (agent.md, loop.md, planner.md, skills.md, toolbox.md, executor.md, rules.md, hooks.md, memory.md) para um agent novo. Arquitetura Spec Driven Agents.
---

# Criador de Agents (Agent Forge)

Esta skill conduz um **wizard conversacional** em português que termina com a geração de um agent completo (9 contratos MD + blueprint JSON validado) em `agent-forge/agents/<nome>/`.

## Quando usar

Acione esta skill QUANDO o utilizador disser algo como:
- "Criar um agent"
- "Novo agent"
- "Agent forge"
- "Quero gerar um agent que..."
- "Spec driven agent"
- "Wizard de agents"

## Filosofia (ler antes de começar)

> O agent NÃO é código. É uma especificação que um runtime genérico interpreta.

Cada agent tem 9 contratos:

| Ficheiro | Define |
|----------|--------|
| `agent.md` | Identidade, tipo, objetivo, formato de saída |
| `loop.md` | Limites do ciclo (max iterações, critérios de parada) |
| `planner.md` | Regras de decisão, arquitetura cognitiva |
| `skills.md` | O que o agent SABE fazer |
| `toolbox.md` | O que o agent PODE fazer (subconjunto de skills) |
| `executor.md` | Validação, retry, tratamento de erros |
| `rules.md` | Limites, restrições, confirmações humanas |
| `hooks.md` | Observabilidade (eventos) |
| `memory.md` | Memórias (curta/longa/episódica/contextual) |

## Fluxo do Wizard

### Passo 1 — Apresentação (curta)

Dizer ao utilizador, em UMA frase, o que vai acontecer:
> "Vou fazer-te 7 perguntas e gerar um agent completo com 9 contratos. Pode começar?"

### Passo 2 — Perguntas (UMA por turno, conversacional)

Use a ferramenta `AskQuestion` SEMPRE QUE POSSÍVEL. Faça as perguntas na seguinte ordem:

**P1. Nome e objetivo**
- "Como vais chamar este agent?" (sugerir kebab-case, ex: `revisor-pr`)
- "Em uma frase: qual é o OBJETIVO principal deste agent?"

**P2. Tipo de agent** (ler `agent-forge/taxonomies.json > tipos_agent`)
Apresentar os 4 tipos com descrição curta e perguntar qual encaixa:
- ⚡ Task-Based — executa tarefa direta
- 💬 Interativo — pergunta antes de agir
- 🎯 Goal-Oriented — decompõe objetivos
- 🤖 Autônomo — reage a eventos

**P3. Arquitetura cognitiva**
- 🔄 ReAct — pensa e age passo a passo (incerteza)
- 📋 Plan-and-Execute — planeja tudo antes (processos estruturados)
- 🪞 Reflection — auto-avalia e refina (qualidade crítica)

**P4. Skills** (capacidades)
- Pedir lista de skills (3–7 idealmente). Para cada uma:
  - Nome (snake_case)
  - O que faz (1 linha)
  - Tipo de implementação: mock | rest | database | mcp
- **Segurança (sugerir automaticamente):** skills com `rest`, `database` ou `mcp` devem entrar em `acoes_com_confirmacao`; skills que escrevem ficheiros ou publicam dados também.

**P5. Loop**
- Max iterações (default: 8)
- Tempo máx em segundos (default: 120)
- Critérios de parada (já incluir `objetivo_alcancado` e `limite_etapas` por default)

**P6. Regras**
- Alguma ação que exige CONFIRMAÇÃO humana? (default: incluir skills `rest`/`database`/`mcp` + ações de escrita/publicação)
- Alguma ação OBRIGATÓRIA antes de finalizar?
- Algum limite especial (ex: "max 3 chamadas a `buscar_logs`")?
- **Defaults de segurança** (incluir no blueprint se o utilizador não disser o contrário):
  - `acoes_com_confirmacao`: skills sensíveis + `executar_shell`, `escrever_ficheiro`, `chamada_rede`, `git_push`
  - `proibidas`: `publicar_externamente`, `aceder_fora_workspace`, `executar_shell_sem_confirmacao`

**P7. Memória** (perguntar simples — sim/não para cada)
- Memória curta: SIM (sempre)
- Longa: precisa lembrar fatos entre execuções?
- Episódica: precisa lembrar execuções passadas?
- Contextual (embeddings): precisa busca por significado?

### Passo 3 — Mostrar resumo

Apresentar uma tabela com tudo que foi capturado. Perguntar: "Confirma?"

### Passo 4 — Gerar blueprint JSON

Construa um JSON conforme `agent-forge/blueprint.schema.json`. Estrutura mínima:

```json
{
  "nome": "<kebab-case>",
  "nome_amigavel": "<Capitalized>",
  "descricao": "...",
  "tipo": "task-based | interactive | goal-oriented | autonomous",
  "objetivo": "...",
  "arquitetura_cognitiva": "react | plan-and-execute | reflection",
  "provider": "auto",
  "contrato_saida": {
    "formato": "markdown",
    "campos_obrigatorios": ["..."]
  },
  "loop": {
    "max_iteracoes": 8,
    "tempo_max_segundos": 120,
    "tokens_max": 50000,
    "criterios_parada": ["objetivo_alcancado", "limite_etapas"]
  },
  "skills": [
    {
      "nome": "skill_um",
      "descricao": "...",
      "entrada": { "param": "string" },
      "saida": { "resultado": "string" },
      "tipo_implementacao": "mock"
    }
  ],
  "toolbox": ["skill_um"],
  "rules": {
    "limites_ferramenta": [],
    "acoes_com_confirmacao": [
      "executar_shell",
      "escrever_ficheiro",
      "chamada_rede",
      "git_push"
    ],
    "obrigatorias": [],
    "proibidas": [
      "publicar_externamente",
      "aceder_fora_workspace",
      "executar_shell_sem_confirmacao"
    ]
  },
  "memory": {
    "curta": true,
    "longa": false,
    "episodica": false,
    "contextual": false,
    "limite_registros": 100
  },
  "hooks": [
    { "evento": "ao_finalizar", "acao": "log" },
    { "evento": "ao_falhar", "acao": "log" }
  ],
  "metadata": {
    "criado_em": "<iso8601>",
    "criado_por": "criador-de-agents (wizard)",
    "versao_blueprint": "1.0.0",
    "tags": []
  }
}
```

Salvar em `agent-forge/agents/<nome>/blueprint.json`.

### Passo 5 — Gerar contratos + runtime + UI

Executar no shell (**sempre com `--runtime`** para poder executar o agent):

```bash
cd agent-forge
pip install -r scripts/requirements.txt
python scripts/generate.py -b agents/<nome>/blueprint.json --runtime
```

Isto gera:
- 9 MD legíveis na raiz do agent
- `contracts/` com YAML para o runtime Python
- Atualiza `web/src/data/agents.ts` (lista na UI `/agents`)

Só exportar runtime (sem regenerar templates):

```bash
python scripts/export_runtime_contracts.py -b agents/<nome>/blueprint.json
```

### Passo 6 — Validar (dois validadores)

**Agent Forge** (blueprint + consistência):

```bash
python scripts/validate.py agents/<nome>/
```

**Runtime Python** (YAML nos MD + toolbox ↔ skills):

```bash
cd runtime
python main.py validar --agente ../agents/<nome>
```

Mostrar ambos os relatórios. Se algum falhar, corrigir o `blueprint.json` e re-rodar o passo 5.

### Passo 7 — Próximos passos

### Passo 7 — Executar (Runtime Cursor, sem API key)

No chat do Cursor (usa a subscrição que já tens — **sem OpenAI API**):

```
executar <nome>: <entrada>
```

Exemplo: `executar gerador-prompt: Prompt para revisar PRs em Python`

Skill: **`executar-agent`**. Documentação: `agent-forge/docs/RUNTIME-CURSOR.md`.

Apresentar também:
- 📁 Pasta: `agent-forge/agents/<nome>/` (+ `contracts/`)
- 📄 Contratos gerados e validados
- 🌐 UI: `cd agent-forge/web && npm run dev` → `/agents` e `/tutorial`
- 🔄 Iterar: editar `blueprint.json` → `generate.py -b ... --runtime`

**Opcional (runtime Python):** `runtime/main.py rodar` requer `OPENAI_API_KEY` — **não** é o fluxo normal.

## Regras de qualidade

1. **Nunca gerar agent sem objetivo claro** — bloquear na P1 até ter resposta sólida.
2. **Skills obrigatórias** devem existir nas skills declaradas (validar antes de gerar).
3. **Toolbox** deve ser subconjunto de skills.
4. **Loop** sempre com pelo menos `objetivo_alcancado` ou `limite_etapas`.
5. **Memória longa** sempre com aviso: "armazene APENAS fatos confirmados por ferramenta".
6. **Idioma:** tudo em português (PT-BR/PT-PT é indiferente, manter consistente).
7. **Segurança:** todo blueprint inclui `acoes_com_confirmacao` para ferramentas de risco e `proibidas` baseline; o runtime Cursor aplica confirmação extra (skill `executar-agent`).
8. **Se Python não estiver disponível:** gerar os ficheiros MD manualmente usando os templates em `agent-forge/templates/` + substituição de placeholders.

## Anti-padrões

- ❌ Gerar um agent "que faz tudo" — focar num objetivo único e claro.
- ❌ Listar 20 skills — manter entre 3 e 7 para o MVP.
- ❌ Saltar a validação — sempre executar `validate.py` **e** `runtime/main.py validar`.
- ❌ Esquecer `--runtime` — sem isso o agent não exporta contratos YAML para o runtime Python.
- ❌ Hardcoded de provider — usar `auto` por default.

## Referências

- `agent-forge/README.md` — visão geral do projeto
- `agent-forge/blueprint.schema.json` — schema completo
- `agent-forge/taxonomies.json` — taxonomias (tipos, arquiteturas, adapters, memórias)
- `agent-forge/templates/*.template` — templates dos 9 contratos
- `agent-forge/docs/SEGURANCA.md` — confirmação humana e ações de risco
