# Toolbox: Gerador de Prompts

> Ferramentas autorizadas para execução. Camada de controle e segurança.
> O runtime BLOQUEIA qualquer ferramenta que não esteja aqui.

## Ferramentas Permitidas


- ✅ `analisar_pedido`

- ✅ `pesquisar_contexto`

- ✅ `gerar_prompt`

- ✅ `refinar_prompt`

- ✅ `avaliar_prompt`

- ✅ `salvar_template`


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
