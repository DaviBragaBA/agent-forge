# Loop: Gerador de Prompts

> Controle do Agent Loop. Define limites e critérios de parada.
> Sem critério de parada, o agent pode entrar em execução infinita.

## Limites de Execução

```yaml
max_iteracoes: 8
tempo_max_segundos: 120
tokens_max: 50000
```

## Critérios de Parada

O agent encerra a execução quando QUALQUER um destes critérios for atendido:


- ✅ **objetivo_alcancado**

- ✅ **limite_etapas**

- ✅ **falta_progresso**

- ✅ **tempo_max**


## Fluxo

```
PERCEBER → RACIOCINAR → AGIR → AVALIAR
    ↑                              ↓
    └──────── repete se ───────────┘
       objetivo não alcançado
```

## Detecção de Loops Improdutivos

Se 3 iterações consecutivas:
- Não produzirem novo conhecimento, OU
- Repetirem a mesma ação com os mesmos argumentos

→ O Circuit Breaker é acionado e o agent é interrompido com status `falta_progresso`.
