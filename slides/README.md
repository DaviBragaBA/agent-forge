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

Referência standalone — **9 contratos**, **4 tipos de agent**, **3 arquiteturas cognitivas**, **4 adapters**, **4 tipos de memória**.

1. Abre `conceitos.html` no browser (mesma UX: **←** **→**, **F11**, dots).
2. 7 slides: capa → contratos → tipos → arquiteturas → adapters → memórias → encerramento.
3. Link de volta em `index.html` (último slide) e em `conceitos.html` (último slide → `index.html`).

| # | Tema |
|---|------|
| 0 | Capa — Conceitos Agent Forge |
| 1 | Os 9 contratos (agent … memory) |
| 2 | 4 tipos de agent |
| 3 | 3 arquiteturas cognitivas |
| 4 | 4 adapters |
| 5 | 4 tipos de memória |
| 6 | Encerramento + link para apresentação |

## Caminho

- `agent-forge/slides/index.html`
- `agent-forge/slides/conceitos.html`
