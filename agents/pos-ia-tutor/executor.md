# Executor: Tutor da Pós em IA

> Como as ações são executadas. Garante segurança e consistência.

## Validações Pré-execução

1. **Validação de payload** — tipos, estrutura, compatibilidade com a interface da skill
2. **Verificação de toolbox** — a ferramenta está autorizada?
3. **Verificação de limites** — `rules.md` permite esta chamada?
4. **Resolução de adapter** — qual implementação real será chamada?

Se qualquer validação falhar, a execução é INTERROMPIDA com erro estruturado.

## Política de Retry

```yaml
max_tentativas: 3
backoff: exponencial    # 1s, 2s, 4s
retry_em:
  - timeout
  - rate_limit
  - erro_5xx
nao_retry_em:
  - erro_4xx
  - validacao_falhou
  - tool_not_allowed
```

## Timeout por Ferramenta

Default: **30s**. Pode ser sobrescrito por skill.

## Classificação de Resultado

Cada execução é classificada como:

| Status | Significado | Próxima ação |
|--------|-------------|--------------|
| `completo` | Ação bem-sucedida, dados completos | Continua o loop |
| `parcial` | Ação executou, mas dados incompletos | Decide se replanea |
| `falho` | Ação falhou após retries | Aciona fallback ou Circuit Breaker |

## Circuit Breaker

Acionado quando:
- 3 falhas consecutivas da MESMA ferramenta
- Resposta inválida da LLM 2x seguidas
- Estrutura malformada do plano

Ação: interrompe execução com resultado controlado e gera trace de diagnóstico.
