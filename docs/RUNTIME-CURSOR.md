# Runtime Cursor (sem API key)

> O Agent Forge foi desenhado para correr **no Cursor**, usando a subscrição que já tens (Claude/Cursor Pro). Não precisas de OpenAI API nem de `main.py rodar` para uso normal.

## Como executar

No chat deste workspace:

```
executar gerador-prompt: Quero um prompt para revisar PRs em Python
```

ou

```
rodar pos-ia-tutor: O que são Spec Driven Agents?
```

A skill **`executar-agent`** (`.cursor/skills/executar-agent/`) instrui o assistente a:

1. Ler os contratos em `agents/<nome>/`
2. Correr o ciclo PERCEBER → PLANEJAR → AGIR → AVALIAR
3. Entregar o artefato final (`contrato_saida`)
4. Mostrar um trace resumido

## O que continua a ser Python (grátis, sem LLM)

| Script | Função |
|--------|--------|
| `scripts/generate.py --runtime` | Gera contratos |
| `scripts/validate.py` | Valida blueprint |
| `runtime/main.py validar` | Valida YAML (estrutura) |

## Runtime Python + OpenAI (opcional)

A pasta `runtime/` vem do **curso** (aula 04). Só faz falta se quiseres reproduzir o laboratório oficial com `OPENAI_API_KEY`. **Não é o fluxo Agent Forge no dia a dia.**

## Claude Pro vs Cursor vs API

| Recurso | Agent Forge no Cursor |
|---------|------------------------|
| Cursor Pro / Claude no chat | ✅ Runtime principal |
| Claude Pro (claude.ai) | ❌ Não ligado ao terminal |
| OpenAI API | ❌ Opcional (só `main.py rodar`) |
