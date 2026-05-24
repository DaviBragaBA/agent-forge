# toolbox.md

> Ferramentas autorizadas.

---

```yaml
ferramentas:
- nome: analisar_pedido
  entrada:
    pedido_bruto: string
    contexto_opcional: string
- nome: pesquisar_contexto
  entrada:
    caminho_ou_texto: string
    tipo: string
- nome: gerar_prompt
  entrada:
    analise: object
    contexto_adicional: string
- nome: refinar_prompt
  entrada:
    rascunho: object
    feedback: string
- nome: avaliar_prompt
  entrada:
    prompt_system: string
    prompt_user: string
- nome: salvar_template
  entrada:
    nome_template: string
    prompt_system: string
    prompt_user: string
    tags: list
```
