---
name: executar-agent
description: Executa um agent Agent Forge no Cursor sem API key — interpreta os contratos MD/YAML e corre o ciclo ReAct no chat. Use quando o utilizador disser "executar agent", "rodar agent", "usa o gerador-prompt", "gerador-prompt:", "pos-ia-tutor:", ou quiser usar um agent forjado sem python main.py nem OpenAI.
---

# Executar Agent (Runtime Cursor)

> **O runtime é o Cursor.** Tu (o assistente) és o planejador, executor e avaliador. **Zero API key externa.**

## Quando usar

- "Executa o gerador-prompt"
- "Rodar agent pos-ia-tutor com entrada: ..."
- "Usa o agent X para ..."
- Qualquer pedido que referencie `agent-forge/agents/<nome>/`

---

## Formato de resposta (obrigatório)

**Nunca** entregar só texto corrido ou um bloco `--- trace ---` minimalista. **Sempre** markdown rico e pedagógico.

### Emojis de secção (mesmo conjunto do criador)

| Emoji | Uso |
|-------|-----|
| 👁️ | PERCEBER — o que foi entendido |
| 🧠 | PLANEJAR — decisão e raciocínio |
| ⚡ | AGIR — skill executada |
| ✅ | AVALIAR — progresso e próximo passo |
| 📦 | Entrega final (contrato de saída) |
| 📡 | Trace / observabilidade |
| 📚 | Porque fiz isto (pedagogia) |
| ⚠️ | Confirmação de segurança |

### Durante o ciclo ReAct

Mostrar **cada etapa** num bloco escaneável (não esconder o raciocínio):

```markdown
### 🔄 Etapa N — `<PERCEBER | PLANEJAR | AGIR | AVALIAR>`

| Campo | Valor |
|-------|-------|
| **Fase** | PERCEBER |
| **O que sei** | ... |
| **O que falta** | ... |

> **📚 Decisão:** porque esta fase importa agora.
```

### Entrega final

1. Cabeçalho `## 📦 Resultado — <nome do agent>`
2. Artefato no formato de `contrato_saida` (campos obrigatórios em subsecções)
3. Secção `## 📚 Porque fiz isto` — explica decisões do ciclo
4. Secção `## 📡 Trace da execução` — tabela pedagógica (não JSON cru)

Referência: `agent-forge/docs/PEDAGOGIA.md`

---

## Filosofia

O agent **não está no Python** — está na **especificação**. Lê os contratos e **simula o runtime** no chat, usando ferramentas reais do Cursor quando a skill pedir dados reais.

---

## Passo 0 — Resolver qual agent

1. Se o utilizador disser o nome (`gerador-prompt`, `doc-tutor`), usa esse.
2. Senão, lista `agent-forge/agents/*/blueprint.json` e pergunta qual.

Pasta base: `agent-forge/agents/<nome>/`

Apresentar brevemente:

```markdown
## 🚀 Executando agent `<nome>`

| Campo | Valor |
|-------|-------|
| **Tipo** | ... |
| **Arquitetura** | ... |
| **Entrada** | ... |
```

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

Validação rápida (opcional na 1ª execução):

```bash
cd agent-forge && python scripts/validate.py agents/<nome>/
cd agent-forge/runtime && python main.py validar --agente ../agents/<nome>
```

---

## Passo 2 — Ciclo ReAct (tu és o motor)

Repete até **objetivo alcançado** ou **max_iteracoes**:

```
PERCEBER → PLANEJAR → AGIR → AVALIAR
```

### 👁️ PERCEBER

- Entrada do utilizador + histórico desta conversa.
- Tipo do agent do `agent.md`.

**Mostrar ao utilizador:** o que foi compreendido, o que falta, nível de confiança.

### 🧠 PLANEJAR (segue planner.md)

Escolhe **exactamente uma**:

| proxima_acao | Quando |
|--------------|--------|
| `PERGUNTAR_USUARIO` | Tipo interactive e falta info; **ou** ação perigosa |
| `CHAMAR_FERRAMENTA` | Próxima skill da toolbox **e** confirmação se necessária |
| `FINALIZAR` | Objetivo atingido E regras obrigatórias cumpridas |

**Mostrar:** raciocínio explícito, ferramenta escolhida, critério de sucesso.

> **📚 Porque esta ação:** explicar em 1–2 frases a escolha vs alternativas.

**Nunca** saltar `ferramentas_obrigatorias` antes de FINALIZAR.

---

## Confirmação de segurança (obrigatório)

Antes de Shell, escrita, rede, MCP externo, git push ou secrets → `PERGUNTAR_USUARIO`:

```markdown
## ⚠️ Confirmação necessária

| Campo | Valor |
|-------|-------|
| **Ação** | ... |
| **Risco** | baixo \| médio \| alto |
| **Impacto** | ficheiros / rede / dados afetados |

Confirmas? (sim/não)
```

Também aplica a `rules.md > acoes_com_confirmacao`.

**Isento:** Read, Grep, Glob, mock sem side-effects.

**Proibido:** assumir consentimento ou interpretar silêncio como sim.

---

### ⚡ AGIR — executar skills

| tipo_implementacao | Como executar no Cursor |
|--------------------|-------------------------|
| **mock** | Produz saída conforme `skills.md`, realista e coerente |
| **rest/database/mcp** | Ferramentas reais se disponíveis; senão simula e avisa |

**Mostrar após cada skill:**

```markdown
### ⚡ Skill `nome_da_skill`

| Campo | Valor |
|-------|-------|
| **Entrada** | ... |
| **Saída** | ... |
| **Status** | completo \| parcial \| falho |

> **📚 O que aprendemos:** ...
```

Respeita `rules.limites_ferramenta`.

### ✅ AVALIAR

- Objetivo mais próximo?
- Repetição sem progresso (3x → parar)?
- Skill obrigatória em falta?

**Mostrar:** tabela de progresso e decisão de continuar ou finalizar.

---

## Passo 3 — Entrega final (contrato de saída)

Quando `FINALIZAR`:

```markdown
## 📦 Resultado — `<nome>`

> Objetivo alcançado: ...

### `<campo_obrigatorio_1>`
...

### `<campo_obrigatorio_2>`
...

---

## 📚 Porque fiz isto

Explicação pedagógica: porque estas skills, porque esta ordem, como o contrato de saída foi satisfeito.
```

Adaptar campos ao `contrato_saida` do blueprint (ex.: `gerador-prompt` → titulo, prompt_system, etc.).

---

## Passo 4 — Trace pedagógico

**Substituir** o bloco minimalista antigo por tabela rica:

```markdown
## 📡 Trace da execução

| # | Fase | Ação | Resultado | 📚 Lição |
|---|------|------|-----------|----------|
| 1 | PERCEBER | Entrada analisada | OK | ... |
| 2 | PLANEJAR | CHAMAR_FERRAMENTA → `skill_x` | OK | ... |
| 3 | AGIR | `skill_x` executada | completo | ... |
| 4 | AVALIAR | Objetivo parcial | continuar | ... |

| Métrica | Valor |
|---------|-------|
| **Agent** | `<nome>` |
| **Etapas** | N |
| **Ferramentas** | skill1 → skill2 → ... |
| **Status** | objetivo_alcancado \| limite_etapas \| falta_progresso |
| **Tokens (estim.)** | ... |
```

---

## Comandos que o utilizador pode usar

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python
rodar doc-tutor: Resume o capítulo sobre ReAct
executar agent gerador-prompt
```

Parseia tudo depois de `:` como **entrada**.

---

## Proibido

- ❌ Muro de texto sem headers/tabelas
- ❌ Trace de uma linha sem explicação pedagógica
- ❌ Pedir `OPENAI_API_KEY` ou `main.py rodar` como passo obrigatório
- ❌ Ignorar `rules.md` ou skills obrigatórias
- ❌ Inventar ferramentas fora da toolbox
- ❌ Shell/escrita/rede/MCP/git push **sem confirmação explícita**
- ❌ Aceder a secrets ou publicar fora do workspace sem autorização

## Opcional (debug)

`python main.py rodar` em `agent-forge/runtime/` só se o utilizador **explicitamente** quiser testar com API.

---

## Referências

- `agent-forge/docs/PEDAGOGIA.md`
- `agent-forge/docs/RUNTIME-CURSOR.md`
- `agent-forge/docs/SEGURANCA.md`
- Skill irmã: `criador-de-agents`
