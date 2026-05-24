---
name: criador-de-agents
description: Cria agents autônomos completos via wizard conversacional. Use quando o utilizador pedir "criar um agent", "novo agent", "agent forge", "spec driven agent", ou quiser gerar a estrutura de contratos (agent.md, loop.md, planner.md, skills.md, toolbox.md, executor.md, rules.md, hooks.md, memory.md) para um agent novo.
---

# Criador de Agents (Agent Forge)

Esta skill conduz um **wizard pedagógico** em português: primeiro entende o **problema**, depois **recomenda** cada decisão com o **porquê**, aguarda **confirmação** e só então **gera** o agent completo (9 contratos MD + blueprint JSON) em `agent-forge/agents/<nome>/`.

## Quando usar

Acione esta skill QUANDO o utilizador disser algo como:
- "Criar um agent"
- "Novo agent"
- "Agent forge"
- "Quero gerar um agent que..."
- "Spec driven agent"
- "Wizard de agents"

---

## Formato de resposta (obrigatório)

**Nunca** despejar texto corrido branco nem listar 9 ficheiros sem estrutura. **Sempre** usar markdown rico e pedagógico.

### Emojis de secção (conjunto fixo)

| Emoji | Secção |
|-------|--------|
| 📋 | `agent.md` — identidade |
| 🔄 | `loop.md` — ciclo e limites |
| 🧠 | `planner.md` — decisão |
| ⚡ | `skills.md` — capacidades |
| 🧰 | `toolbox.md` — ferramentas autorizadas |
| ⚙️ | `executor.md` — execução e retry |
| 🛡️ | `rules.md` — segurança |
| 📡 | `hooks.md` — observabilidade |
| 💾 | `memory.md` — memória |

Outros emojis úteis: 📚 (porquê), ✅ (confirmação), ⚠️ (risco), 🎯 (objetivo), 💡 (dica).

### Estrutura mínima de cada resposta do wizard

1. **Cabeçalho** com contexto (`## 🎯 Problema` ou `## 💡 Recomendação`)
2. **Tabelas** para comparações (tipos de agent, arquiteturas, skills)
3. **Blockquotes** (`>`) para callouts e avisos
4. **Labels em negrito** para campos-chave
5. Secção **`## 📚 Porque escolhi isto`** — obrigatória em toda recomendação
6. **Pergunta de confirmação** no fim (nunca gerar sem "sim")

### Ao entregar o agent criado

Incluir secção **`## 📦 Os 9 contratos deste agent`** — uma subsecção por ficheiro com emoji, função em 1 linha e **porquê** desta configuração.

---

## Filosofia

> O agent NÃO é código. É uma especificação que um runtime genérico interpreta.

Cada agent tem 9 contratos:

| Ficheiro | Emoji | Define |
|----------|-------|--------|
| `agent.md` | 📋 | Identidade, tipo, objetivo, formato de saída |
| `loop.md` | 🔄 | Limites do ciclo (max iterações, critérios de parada) |
| `planner.md` | 🧠 | Regras de decisão, arquitetura cognitiva |
| `skills.md` | ⚡ | O que o agent SABE fazer |
| `toolbox.md` | 🧰 | O que o agent PODE fazer (subconjunto de skills) |
| `executor.md` | ⚙️ | Validação, retry, tratamento de erros |
| `rules.md` | 🛡️ | Limites, restrições, confirmações humanas |
| `hooks.md` | 📡 | Observabilidade (eventos) |
| `memory.md` | 💾 | Memórias (curta/longa/episódica/contextual) |

Referência de formato: `agent-forge/docs/PEDAGOGIA.md`

---

## Fluxo do Wizard (problema → recomendação → confirmação → geração)

### Fase 1 — Problema primeiro

**Uma pergunta por turno.** Começar pelo problema, não pelo nome técnico.

> **Apresentação (1 frase):** "Vou entender o teu problema, recomendar a arquitetura ideal com o porquê de cada escolha, e só depois gerar os 9 contratos. Podes começar?"

**P1. Problema e objetivo**
- "Que **problema** queres resolver?" (deixar o utilizador descrever livremente)
- "Em **uma frase**: qual seria o **resultado ideal** quando o agent terminar?"

> Bloquear avanço se o objetivo for vago. Pedir exemplos concretos de entrada/saída.

**P2. Nome (só depois do problema)**
- Sugerir kebab-case derivado do objetivo (ex: `revisor-pr`, `gerador-prompt`)
- Confirmar ou ajustar

---

### Fase 2 — Recomendação pedagógica (NÃO perguntar 7 coisas soltas)

Depois de P1+P2, o assistente **recomenda** um blueprint completo numa **única resposta estruturada**. O utilizador confirma ou ajusta — não interrogar item a item.

Ler `agent-forge/taxonomies.json` antes de recomendar.

#### Template da resposta de recomendação

```markdown
## 💡 Recomendação para `<nome-sugerido>`

> Resumo em 2 linhas do que este agent fará e para quem.

---

### 🎯 Objetivo proposto

**Objetivo:** ...
**Contrato de saída:** formato + campos obrigatórios

---

### 📊 Comparação: 4 tipos de agent

| Tipo | Emoji | Ideal para | Porque NÃO neste caso |
|------|-------|------------|------------------------|
| Task-Based | ⚡ | ... | ... |
| Interativo | 💬 | ... | ... |
| Goal-Oriented | 🎯 | ... | ... |
| Autônomo | 🤖 | ... | ... |

**✅ Recomendo:** `<tipo>` — *uma linha de justificação*

---

### 🧠 Arquitetura cognitiva

| Arquitetura | Emoji | Vantagem | Desvantagem |
|-------------|-------|----------|-------------|
| ReAct | 🔄 | ... | ... |
| Plan-and-Execute | 📋 | ... | ... |
| Reflection | 🪞 | ... | ... |

**✅ Recomendo:** `<arquitetura>` — *porquê para ESTE problema*

---

### ⚡ Skills propostas

| Skill | Tipo | O que faz | Porque incluir |
|-------|------|-----------|----------------|
| `skill_a` | mock | ... | ... |
| `skill_b` | rest | ... | ... |

---

### 🧰 Toolbox (subconjunto autorizado)

| Na toolbox | Fora da toolbox | Porquê |
|------------|-----------------|--------|
| ✅ `skill_a` | ❌ `skill_c` | ... |

> **Princípio:** skill = sabe; toolbox = pode agora.

---

### 🔄 Loop proposto

| Parâmetro | Valor | Porquê |
|-----------|-------|--------|
| Max iterações | 8 | ... |
| Tempo máx (s) | 120 | ... |
| Critérios de parada | objetivo_alcancado, limite_etapas | ... |

---

### 💾 Memória proposta

| Tipo | Habilitar? | Porquê |
|------|------------|--------|
| Curta | ✅ sempre | estado da execução |
| Longa | sim/não | ... |
| Episódica | sim/não | ... |
| Contextual | sim/não | ... |

---

### 🛡️ Regras de segurança

| Categoria | Itens | Porquê |
|-----------|-------|--------|
| Confirmação | executar_shell, escrever_ficheiro, ... | ... |
| Proibidas | publicar_externamente, ... | ... |
| Obrigatórias | (se houver) | ... |

---

## 📚 Porque escolhi isto

Parágrafo curto que **ensina**: porque este tipo vs os outros, porque esta arquitetura, porque cada skill, porque este subconjunto na toolbox, porque estes limites de loop, porque este perfil de memória.

---

**Confirma esta recomendação?** Podes dizer "sim", pedir ajustes ("menos skills", "tipo interativo") ou responder ponto a ponto.
```

**Regras da recomendação:**
- Cada linha "Recomendo" deve explicar **porque não** as alternativas
- Skills `rest`/`database`/`mcp` → incluir em `acoes_com_confirmacao`
- Defaults de segurança se o utilizador não disser o contrário
- **Nunca gerar** antes de confirmação explícita

---

### Fase 3 — Resumo final (após ajustes)

Tabela compacta de tudo capturado + última pergunta "Confirma geração?"

---

### Fase 4 — Gerar blueprint JSON

Construir JSON conforme `agent-forge/blueprint.schema.json`. Estrutura mínima:

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

---

### Fase 5 — Gerar contratos + runtime + UI

```bash
cd agent-forge
pip install -r scripts/requirements.txt
python scripts/generate.py -b agents/<nome>/blueprint.json --runtime
```

Só exportar runtime (sem regenerar templates):

```bash
python scripts/export_runtime_contracts.py -b agents/<nome>/blueprint.json
```

---

### Fase 6 — Validar

**Agent Forge:**

```bash
python scripts/validate.py agents/<nome>/
```

**Runtime oficial:**

```bash
cd runtime
python main.py validar --agente ../agents/<nome>
```

Mostrar relatórios em tabela. Se falhar, corrigir blueprint e re-rodar fase 5.

---

### Fase 7 — Entrega rica ao utilizador

Usar este template (adaptar valores):

```markdown
## ✅ Agent `<nome>` criado com sucesso

> `<descricao curta>`

| Item | Valor |
|------|-------|
| 📁 Pasta | `agent-forge/agents/<nome>/` |
| 📋 Tipo | `<tipo>` |
| 🧠 Arquitetura | `<arquitetura>` |
| ⚡ Skills | N (toolbox: M) |

---

## 📦 Os 9 contratos deste agent

### 📋 agent.md
**Função:** identidade, objetivo, contrato de saída.
**Nesta config:** ...

### 🔄 loop.md
**Função:** limites e parada.
**Nesta config:** max N iterações porque ...

(... repetir para os 9 ficheiros ...)

---

## 📚 Porque escolhi isto

Resumo pedagógico das decisões principais.

---

## 🚀 Próximos passos

1. **Executar no Cursor:** `executar <nome>: <entrada de exemplo>`
2. **UI web:** `cd agent-forge/web && npm run dev` → `/agents`
3. **Iterar:** editar `blueprint.json` → `generate.py -b ... --runtime`

> Skill de execução: **`executar-agent`**. Docs: `agent-forge/docs/RUNTIME-CURSOR.md`.
```

**Proibido na entrega:** colar os 9 MD completos no chat. Apontar para a pasta e explicar cada um.

---

## Regras de qualidade

1. **Problema antes de specs** — nunca saltar para kebab-case sem entender o objetivo.
2. **Recomendar, não interrogar** — fase 2 é uma proposta ensinada, não 7 perguntas soltas.
3. **📚 Porque escolhi isto** — obrigatório em recomendação e entrega final.
4. **Skills obrigatórias** existem nas skills declaradas.
5. **Toolbox** = subconjunto de skills.
6. **Loop** com pelo menos `objetivo_alcancado` ou `limite_etapas`.
7. **Memória longa** — avisar: "armazene APENAS fatos confirmados por ferramenta".
8. **Idioma:** português consistente.
9. **Segurança:** `acoes_com_confirmacao` + `proibidas` baseline.
10. **Sem Python:** gerar MD manualmente com `agent-forge/templates/` + placeholders.

## Anti-padrões

- ❌ Muro de texto branco sem headers/tabelas
- ❌ Listar 9 ficheiros MD crus no chat
- ❌ Gerar sem confirmação explícita
- ❌ Perguntar tipo/arquitetura/skills um a um sem explicar alternativas
- ❌ Agent "que faz tudo" — um objetivo claro
- ❌ 20 skills — manter 3–7 no MVP
- ❌ Saltar validação ou `--runtime`

## Referências

- `agent-forge/docs/PEDAGOGIA.md` — guia de formato pedagógico
- `agent-forge/README.md` — visão geral
- `agent-forge/blueprint.schema.json` — schema
- `agent-forge/taxonomies.json` — tipos, arquiteturas, adapters
- `agent-forge/templates/*.template` — templates dos 9 contratos
- `agent-forge/docs/SEGURANCA.md` — confirmação humana
