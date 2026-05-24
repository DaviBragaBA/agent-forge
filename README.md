# 🛠️ Agent Forge

> Criador de Agents Autônomos — gera agents completos a partir de um wizard conversacional.

Baseado na arquitetura **Spec Driven Agents** do [Módulo 4](../modulo04-agentes-autonomos/) (curso UNIPDS). Comparação com o material oficial: [docs/COMPARACAO-CURSO.md](docs/COMPARACAO-CURSO.md).

## Filosofia

> O agent não está no código. O agent está na especificação.

Cada agent é descrito por **9 contratos em Markdown**, interpretados por um runtime genérico (o mesmo do curso, em `runtime/`).

## Estrutura

```
agent-forge/
├── blueprint.schema.json
├── taxonomies.json
├── templates/               ← MD legíveis (humanos)
├── agents/
│   └── pos-ia-tutor/        ← blueprint + contratos + contracts/
├── scripts/
│   ├── generate.py          ← gera MD a partir do blueprint
│   ├── export_runtime_contracts.py  ← YAML para o runtime do curso
│   └── validate.py          ← valida blueprint
├── runtime/                 ← runtime oficial (aula04), copiado do curso
├── web/                     ← UI Vite → http://localhost:5173
└── docs/
    └── COMPARACAO-CURSO.md
```

Material do curso (clone local): [`../modulo04-agentes-autonomos/`](../modulo04-agentes-autonomos/)

## Como usar

### Wizard no Cursor

Peça **"criar um agent"** ou **"agent forge"**. A skill `criador-de-agents` gera o blueprint e os contratos.

### Gerar contratos (legíveis + runtime)

```powershell
cd agent-forge
pip install -r scripts/requirements.txt
python scripts/generate.py -b agents/pos-ia-tutor/blueprint.json --runtime
python scripts/validate.py agents/pos-ia-tutor/
```

A flag `--runtime` também cria `contracts/` com blocos YAML para o runtime oficial.

Só exportar runtime (sem regenerar templates):

```powershell
python scripts/export_runtime_contracts.py -b agents/pos-ia-tutor/blueprint.json
```

### Executar agent (Runtime Cursor — **sem API key**)

No chat deste workspace:

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python
rodar pos-ia-tutor: Explica Spec Driven Agents
```

Skill: `.cursor/skills/executar-agent/`. Detalhes: [docs/RUNTIME-CURSOR.md](docs/RUNTIME-CURSOR.md).

O assistente lê os contratos em `agents/<nome>/` e corre o ciclo ReAct aqui no Cursor (Claude/Cursor Pro).

### Runtime Python do curso (opcional — laboratório)

Só se quiseres reproduzir a aula 04 com LLM OpenAI:

```powershell
cd agent-forge/runtime
pip install -r requirements.txt
copy .env.example .env
# OPENAI_API_KEY — opcional, não necessário para uso normal

python main.py validar --agente ../agents/pos-ia-tutor
# python main.py rodar ...  ← requer API key
```

### UI web (standalone)

```powershell
cd agent-forge/web
npm install
npm run dev
```

Abre `http://localhost:5173`. Não faz parte do portfolio.

## Os 9 contratos

| Ficheiro | Função |
|----------|--------|
| `agent.md` | Identidade, tipo, objetivo, contrato de saída |
| `contracts/loop.md` | Ciclo e critérios de parada |
| `contracts/planner.md` | Formato JSON da decisão da LLM |
| `skills.md` | Habilidades (`habilidades` no runtime) |
| `contracts/toolbox.md` | Ferramentas autorizadas |
| `contracts/executor.md` | Validação e retry |
| `rules.md` | Limites e políticas |
| `hooks.md` | Observabilidade |
| `memory.md` | Memória curta e resumo final |

## Checklist de alinhamento com o curso (feito)

| Etapa | Estado | Onde ver |
|-------|--------|----------|
| Comparar contratos/templates oficiais vs Agent Forge | ✅ | [docs/COMPARACAO-CURSO.md](docs/COMPARACAO-CURSO.md) |
| Alinhar runtime do curso com `pos-ia-tutor` | ✅ | `agents/pos-ia-tutor/contracts/` + `runtime/` |
| Documentar diferenças e comandos | ✅ | Este README + `modulo04-agentes-autonomos/README.md` |

Validação rápida:

```powershell
cd agent-forge
python scripts/validate.py agents/pos-ia-tutor/
cd runtime
python main.py validar --agente ../agents/pos-ia-tutor
```

## Status

- ✅ V1: Wizard + gerador + validador blueprint + UI web + tutorial (`/tutorial`)
- ✅ Runtime curso integrado + `pos-ia-tutor` validado (Forge + runtime oficial)
- ⏳ V2: Adapters reais (PDF, MCP) + trace dashboard
- ⏳ V3: Evals + memória longa/embeddings
