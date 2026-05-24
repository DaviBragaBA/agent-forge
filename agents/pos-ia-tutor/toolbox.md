# Toolbox: Tutor da Pós em IA

> Ferramentas autorizadas para execução. Camada de controle e segurança.
> O runtime BLOQUEIA qualquer ferramenta que não esteja aqui.

## Ferramentas Permitidas


- ✅ `listar_materiais`

- ✅ `ler_capitulo`

- ✅ `resumir_capitulo`

- ✅ `gerar_flashcards`

- ✅ `responder_duvida`

- ✅ `criar_exercicio`


## Princípio

> Skill define o que o agent SABE fazer.
> Toolbox define o que o agent PODE fazer.

Toda ferramenta em `skills.md` que não estiver listada acima será REJEITADA pelo executor com erro `tool_not_allowed`.

## Auditoria

Cada chamada de ferramenta é registrada em `trace.json` com:
- Timestamp
- Argumentos
- Resultado
- Latência
- Status (sucesso/falha)
