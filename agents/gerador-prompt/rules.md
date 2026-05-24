# rules.md

> Limites e politicas.

---

```yaml
ferramentas_obrigatorias:
- avaliar_prompt
limites:
  max_etapas: 8
  sem_progresso: 3
  limite_tempo_segundos: 120
  chamadas_ferramenta:
    total: 10
    gerar_prompt: 2
    refinar_prompt: 2
    avaliar_prompt: 3
    salvar_template: 1
    pesquisar_contexto: 2
acoes_sensiveis:
- salvar_template
politicas:
- inventar_constraints_nao_fornecidas
- finalizar_sem_avaliacao_aprovada
- prompt_maior_que_contexto_util
- nao inventar fontes ou paginas
- citar material consultado em toda resposta final
```
