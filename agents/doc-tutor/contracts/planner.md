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
- 'so usar FINALIZAR apos executar as ferramentas obrigatorias: responder_duvida'
- 'no FINALIZAR, o artefato deve incluir: titulo, conteudo, fontes, proxima_acao_sugerida'
- consultar listar_materiais antes de ler_capitulo quando o material nao for conhecido
- resumir ou responder apenas com base em texto obtido via ferramentas
- nao inventar dados que deveriam vir de ferramentas
```
