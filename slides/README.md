# Slides — Do Comando ao Retorno

Apresentação HTML em tela cheia sobre o fluxo **Agent Forge** (comando no Cursor → contratos → ReAct → resposta).

## Abrir

1. Abre `index.html` no browser (duplo clique ou arrastar para Chrome/Edge).
2. **F11** para ecrã inteiro.
3. Navegação: **←** **→** ou **Espaço** · **Home** / **End** para primeiro/último slide.

## Conteúdo (11 slides)

| # | Tema |
|---|------|
| 0 | Capa — Comando → Contratos → ReAct → Resposta |
| 1 | Teu comando (`executar gerador-prompt: …`) |
| 2 | Contratos Markdown |
| 3 | Ciclo ReAct / planner |
| 4 | Pipeline de skills (demo PR Python) |
| 5 | Diagrama do fluxo completo |
| 6 | Artefacto de saída |
| 7 | Trace de observabilidade |
| 8 | Runtime Cursor (zero API) |
| 9 | Ciclo de vida (criar → generate → validate → executar) |
| 10 | Encerramento — Spec Driven |

## Demo ao vivo na apresentação

Depois do slide 4 ou 10, no Cursor:

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python no Cursor
```

## Conceitos (taxonomia)

Referência standalone em **página scrollável** (não é slide deck) — **9 contratos**, **4 tipos de agent**, **3 arquiteturas cognitivas**, **4 adapters**, **4 tipos de memória**.

1. Abre `../conceitos.html` na raiz do `agent-forge` (duplo clique no browser).
2. Navegação por scroll ou links âncora no topo (Contratos, Tipos, Arquiteturas, Adapters, Memórias).
3. Link de volta para a apresentação em slides no rodapé; último slide de `index.html` aponta para `../conceitos.html`.

| Secção | Conteúdo |
|--------|----------|
| Contratos | Os 9 ficheiros Markdown (agent … memory) |
| Tipos | 4 tipos de agent |
| Arquiteturas | 3 arquiteturas cognitivas |
| Adapters | 4 adapters |
| Memórias | 4 tipos de memória |

## Caminho

- `agent-forge/slides/index.html` — apresentação (slide deck)
- `agent-forge/conceitos.html` — referência scrollável
