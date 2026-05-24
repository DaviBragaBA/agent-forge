# rules.md

> Limites e politicas.

---

```yaml
ferramentas_obrigatorias:
- responder_duvida
limites:
  max_etapas: 8
  sem_progresso: 3
  limite_tempo_segundos: 180
  chamadas_ferramenta:
    total: 10
    ler_capitulo: 5
    gerar_flashcards: 3
    criar_exercicio: 2
acoes_sensiveis: []
politicas:
- inventar_fonte
- responder_sem_consultar_material
- gerar_mais_de_5_flashcards_por_vez
- nao inventar fontes ou paginas
- citar material consultado em toda resposta final
```
