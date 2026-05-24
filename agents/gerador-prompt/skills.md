# skills.md

> Habilidades (interface).

---

```yaml
habilidades:
- nome: analisar_pedido
  descricao: Extrai objetivo, audiência, tom, formato de saída e constraints explícitas
    ou implícitas do pedido do utilizador.
  entrada:
    pedido_bruto: string
    contexto_opcional: string
  saida:
    objetivo: string
    audiencia: string
    tom: string
    formato_saida: string
    constraints: list
    lacunas: list
- nome: pesquisar_contexto
  descricao: 'Lê ficheiro, snippet ou descrição de repo fornecida pelo utilizador
    para enriquecer o prompt (mock: devolve texto simulado).'
  entrada:
    caminho_ou_texto: string
    tipo: string
  saida:
    contexto_extraido: string
    trechos_relevantes: list
- nome: gerar_prompt
  descricao: 'Gera rascunho do prompt com secções: role, contexto, tarefa, formato,
    constraints, exemplos opcionais.'
  entrada:
    analise: object
    contexto_adicional: string
  saida:
    prompt_system: string
    prompt_user: string
    variaveis: list
- nome: refinar_prompt
  descricao: Ajusta o rascunho com base em feedback do utilizador ou lacunas detectadas
    na avaliação.
  entrada:
    rascunho: object
    feedback: string
  saida:
    prompt_system: string
    prompt_user: string
    variaveis: list
    alteracoes: list
- nome: avaliar_prompt
  descricao: 'Checklist: claro, completo, sem ambiguidade, constraints realistas,
    variáveis nomeadas, testável numa única chamada LLM.'
  entrada:
    prompt_system: string
    prompt_user: string
  saida:
    aprovado: bool
    nota: float
    problemas: list
    sugestoes: list
- nome: salvar_template
  descricao: 'Serializa o prompt aprovado como template reutilizável com nome e tags
    (mock: devolve JSON do template).'
  entrada:
    nome_template: string
    prompt_system: string
    prompt_user: string
    tags: list
  saida:
    template_id: string
    caminho_sugerido: string
```
