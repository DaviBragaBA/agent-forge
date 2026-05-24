# memory.md

> Memoria do agente.

---

```yaml
memoria_curta:
  guardar:
  - resultado_de_ferramenta
  - decisao_do_planejador
  - resumo_gerado
  - fontes_consultadas
  descartar:
  - prompt_sistema_completo
  - argumentos_mock_internos
  max_registros: 200
resumo_final:
  max_linhas: 8
  campos:
  - objetivo
  - etapas_executadas
  - artefato_final
  - fontes
memoria_longa:
  ativa: true
  aviso: armazenar apenas fatos confirmados por ferramenta
```
