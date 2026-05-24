# toolbox.md

> Ferramentas autorizadas.

---

```yaml
ferramentas:
- nome: listar_materiais
  entrada:
    filtro: string
- nome: ler_capitulo
  entrada:
    caminho_pdf: string
    intervalo_paginas: string
- nome: resumir_capitulo
  entrada:
    texto_capitulo: string
    estilo: string
- nome: gerar_flashcards
  entrada:
    fonte_texto: string
    dificuldade: string
- nome: responder_duvida
  entrada:
    pergunta: string
    materiais_consultados: string
- nome: criar_exercicio
  entrada:
    topico: string
    nivel: int
```
