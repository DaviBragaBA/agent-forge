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
- executar_shell
- escrever_ficheiro
- chamada_rede
- git_push
politica_confirmacao:
  obrigatoria: true
  decisao_planner: PERGUNTAR_USUARIO
  aceitar_apenas:
  - sim
  - 'yes'
  - confirmo
  - podes executar
  nunca_assumir_consentimento: true
politicas:
- inventar_constraints_nao_fornecidas
- finalizar_sem_avaliacao_aprovada
- prompt_maior_que_contexto_util
- publicar_externamente
- aceder_fora_workspace
- executar_shell_sem_confirmacao
- nao inventar fontes ou paginas
- citar material consultado em toda resposta final
```
