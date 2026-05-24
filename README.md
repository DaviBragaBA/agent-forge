# Agent Forge

> Criador de agents autônomos — gera agents completos a partir de um wizard conversacional.

## Filosofia

> O agent não está no código. O agent está na especificação.

Cada agent é descrito por **9 contratos em Markdown**, interpretados por um runtime genérico em `runtime/`.

## Estrutura

```
agent-forge/
├── blueprint.schema.json
├── taxonomies.json
├── templates/               ← templates dos contratos MD
├── agents/
│   ├── doc-tutor/           ← tutor de documentos (ReAct + RAG)
│   └── gerador-prompt/      ← engenharia de prompts
├── scripts/
│   ├── generate.py          ← gera MD a partir do blueprint
│   ├── export_runtime_contracts.py
│   └── validate.py
├── runtime/                 ← runtime Python genérico
├── web/                     ← UI Vite → http://localhost:5173
├── slides/                  ← apresentação HTML do fluxo
└── docs/
    └── RUNTIME-CURSOR.md
```

## Como usar

### Wizard no Cursor

Peça **"criar um agent"** ou **"agent forge"**. A skill `criador-de-agents` gera o blueprint e os contratos.

### Gerar contratos

```powershell
cd agent-forge
pip install -r scripts/requirements.txt
python scripts/generate.py -b agents/doc-tutor/blueprint.json --runtime
python scripts/validate.py agents/doc-tutor/
```

A flag `--runtime` também cria `contracts/` com blocos YAML para o runtime Python.

Só exportar runtime (sem regenerar templates):

```powershell
python scripts/export_runtime_contracts.py -b agents/doc-tutor/blueprint.json
```

### Executar agent (Runtime Cursor — sem API key)

No chat do workspace:

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python
executar doc-tutor: Resume o capítulo sobre ReAct
```

Skill: `.cursor/skills/executar-agent/`. Detalhes: [docs/RUNTIME-CURSOR.md](docs/RUNTIME-CURSOR.md).

O assistente lê os contratos em `agents/<nome>/` e corre o ciclo ReAct no Cursor (Claude/Cursor Pro).

### Runtime Python (opcional)

Para validação estrutural ou execução com LLM externa:

```powershell
cd agent-forge/runtime
pip install -r requirements.txt
copy .env.example .env
# OPENAI_API_KEY — opcional

python main.py validar --agente ../agents/doc-tutor
# python main.py rodar ...  ← requer API key
```

### UI web

```powershell
cd agent-forge/web
npm install
npm run dev
```

Abre `http://localhost:5173`.

### Slides

Abre `slides/index.html` no browser. Navegação: ← → ou Espaço. F11 para ecrã inteiro.

## Os 9 contratos

| Ficheiro | Função |
|----------|--------|
| `agent.md` | Identidade, tipo, objetivo, contrato de saída |
| `loop.md` | Ciclo e critérios de parada |
| `planner.md` | Formato JSON da decisão |
| `skills.md` | Habilidades (interface) |
| `toolbox.md` | Ferramentas autorizadas |
| `executor.md` | Validação e retry |
| `rules.md` | Limites e políticas |
| `hooks.md` | Observabilidade |
| `memory.md` | Memória curta/longa/contextual |

## Agents incluídos

| Agent | Descrição |
|-------|-----------|
| `doc-tutor` | Tutor interativo ReAct — lê documentos, resume, flashcards, Q&A com fontes |
| `gerador-prompt` | Transforma pedidos vagos em prompts estruturados e validados |

## Validação rápida

```powershell
cd agent-forge
python scripts/validate.py agents/doc-tutor/
cd runtime
python main.py validar --agente ../agents/doc-tutor
```

## Roadmap

- V1: Wizard + gerador + validador + UI web + slides
- V2: Adapters reais (PDF, MCP) + trace dashboard
- V3: Evals + memória longa/embeddings
