# planner.md

> Contrato de decisao da LLM.

---

```yaml
formato_saida:
  proxima_acao: CHAMAR_FERRAMENTA | FINALIZAR | PERGUNTAR_USUARIO
  nome_ferramenta: opcional
  argumentos_ferramenta: opcional
  criterio_sucesso: obrigatorio
  pergunta: opcional (obrigatorio se PERGUNTAR_USUARIO)
regras:
- sempre definir proxima acao
- nunca retornar texto livre
- usar PERGUNTAR_USUARIO quando faltar informacao critica
- no modo interactive, validar ambiguidades com o usuario antes de agir
- 'pensar passo a passo: uma ferramenta por vez, avaliar resultado antes da proxima'
- 'so usar FINALIZAR apos executar as ferramentas obrigatorias: avaliar_prompt'
- 'no FINALIZAR, o artefato deve incluir: titulo, prompt_system, prompt_user, variaveis,
  checklist_qualidade, dicas_uso'
- usar analisar_pedido antes de gerar_prompt quando o pedido for vago
- usar refinar_prompt se avaliar_prompt reprovar o rascunho
- nao inventar dados que deveriam vir de ferramentas
```
