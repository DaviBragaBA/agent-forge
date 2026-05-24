# skills.md

> Habilidades (interface).

---

```yaml
habilidades:
- nome: listar_materiais
  descricao: Lista todos os PDFs e ficheiros de matéria disponíveis em c:\Users\davib\OneDrive\Área
    de Trabalho\Pós em Inteligencia artificial
  entrada:
    filtro: string
  saida:
    materiais: float
- nome: ler_capitulo
  descricao: Lê um capítulo específico de um material, retorna o conteúdo textual
    com numeração de páginas
  entrada:
    caminho_pdf: string
    intervalo_paginas: string
  saida:
    texto: string
    total_paginas: float
    metadados: object
- nome: resumir_capitulo
  descricao: 'Gera resumo didático em markdown de um capítulo lido. Estrutura: conceitos-chave,
    fluxos, exemplos, anti-padrões.'
  entrada:
    texto_capitulo: string
    estilo: string
  saida:
    resumo_md: string
    conceitos_chave: string
    duvidas_sugeridas: string
- nome: gerar_flashcards
  descricao: Cria flashcards (pergunta + resposta + fonte) para revisão espaçada a
    partir de um resumo ou capítulo. Máximo 5 por chamada.
  entrada:
    fonte_texto: string
    dificuldade: string
  saida:
    flashcards: list
- nome: responder_duvida
  descricao: Responde uma dúvida do aluno consultando o material disponível. SEMPRE
    cita capítulo e página. Se não encontrar resposta no material, declara explicitamente.
  entrada:
    pergunta: string
    materiais_consultados: string
  saida:
    resposta: string
    fontes: float
    confianca: float
- nome: criar_exercicio
  descricao: Gera um exercício prático baseado num tópico da matéria. Inclui enunciado,
    dicas e gabarito separado.
  entrada:
    topico: string
    nivel: int
  saida:
    enunciado: string
    dicas: string
    gabarito: string
```
