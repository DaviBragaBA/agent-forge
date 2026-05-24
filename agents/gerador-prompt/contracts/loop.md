# loop.md

> Motor do ciclo.

---

```yaml
objetivo: gerador_prompt
ciclo:
  max_etapas: 8
condicoes_parada:
- objetivo_alcancado
- max_etapas_excedido
- sem_progresso
- limite_tempo_excedido
```
