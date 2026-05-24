# Runtime Cursor (sem API key)

> O Agent Forge foi desenhado para correr **no Cursor**, usando a subscrição que já tens (Claude/Cursor Pro). Não precisas de OpenAI API nem de `main.py rodar` para uso normal.

## Fluxo

```
executar <nome-agent>: <pedido>
         ↓
skill executar-agent
         ↓
lê agent.md + loop + planner + skills + rules
         ↓
ciclo ReAct no chat (Perceber → Planejar → Agir → Avaliar)
         ↓
artefacto + trace
```

## Exemplos

```
executar gerador-prompt: Prompt para revisar PRs em Python
executar doc-tutor: O que é Spec Driven Agents?
```

A skill **`executar-agent`** (`.cursor/skills/executar-agent/`) instrui o assistente a:

1. Carregar contratos de `agent-forge/agents/<nome>/`
2. Seguir `loop.md` e `planner.md`
3. Chamar skills da `toolbox.md` (mock ou ferramentas reais do Cursor)
4. Respeitar `rules.md` e entregar conforme `contrato_saida`
5. Fechar com trace (agent, etapas, ferramentas, status)

## Decisões do planner

| Decisão | Quando |
|---------|--------|
| `CHAMAR_FERRAMENTA` | Próximo passo é uma skill |
| `PERGUNTAR_USUARIO` | Falta contexto |
| `FINALIZAR` | Objetivo alcançado |

## Runtime Python (`runtime/`)

Pasta opcional para validação estrutural (`main.py validar`) ou execução com LLM externa (`main.py rodar` + `OPENAI_API_KEY`). **Não é o fluxo principal.**

## Recursos

| Recurso | Agent Forge no Cursor |
|---------|----------------------|
| Cursor Pro / Claude no chat | Runtime principal |
| Read / Grep / Shell | Skills reais quando configurado |
| OpenAI API | Opcional (runtime Python) |
