# Segurança no Agent Forge

Política de confirmação humana para agents executados no **Runtime Cursor** (skill `executar-agent`) e no runtime Python.

## Princípio

Ações com side-effects **não correm** sem confirmação explícita do utilizador. O planner escolhe `PERGUNTAR_USUARIO`, resume o risco e aguarda `sim` / `confirmo` / `podes executar`.

## Camadas

| Camada | Onde | O quê |
|--------|------|--------|
| Runtime Cursor | `.cursor/skills/executar-agent/SKILL.md` | Shell, Write, rede, MCP, git push, secrets |
| Blueprint | `rules.acoes_com_confirmacao` | Skills sensíveis do agent |
| Contrato | `rules.md` YAML | `acoes_sensiveis` + `politica_confirmacao` |
| Python | `runtime/ciclo.py` | Pausa em `acoes_sensiveis` via stdin |

## Ações que exigem confirmação

- Terminal (`Shell`, installs, builds)
- Escrita ou remoção de ficheiros
- Rede (REST, fetch, APIs)
- MCP externo (Stripe, Supabase, etc.)
- `git push` e operações destrutivas
- Publicação (`npm publish`, deploy)
- Leitura ou uso de secrets (`.env`, tokens)

## Isento (sem confirmação)

- `Read`, `Grep`, `Glob`, listagens read-only
- Skills **mock** sem efeitos reais

## Blueprint (defaults recomendados)

```json
{
  "rules": {
    "acoes_com_confirmacao": [
      "executar_shell",
      "escrever_ficheiro",
      "chamada_rede",
      "git_push"
    ],
    "proibidas": [
      "publicar_externamente",
      "aceder_fora_workspace",
      "executar_shell_sem_confirmacao"
    ],
    "politica_confirmacao": {
      "obrigatoria": true,
      "decisao_planner": "PERGUNTAR_USUARIO",
      "aceitar_apenas": ["sim", "yes", "confirmo", "podes executar"],
      "nunca_assumir_consentimento": true
    }
  }
}
```

Taxonomia completa: `taxonomies.json` → `acoes_com_confirmacao`, `proibidas_baseline`.

## Exemplo de fluxo

```
Agent: ⚠️ Confirmação necessária

Ação: Escrever template em agents/gerador-prompt/templates/revisor-pr.json
Risco: médio
Impacto: 1 ficheiro novo no workspace

Confirmas? (sim/não)

Utilizador: sim

Agent: [executa salvar_template / Write]
```

## LGPD e dados

- Não persistir PII ou credenciais em `memory.md` ou trace
- Citar apenas material do workspace autorizado
- Bloquear acesso fora do workspace (`aceder_fora_workspace`)

## Referências

- Skill `executar-agent` — regras no runtime Cursor
- Skill `criador-de-agents` — defaults no wizard
- `templates/rules.md.template` — bloco YAML `politica_confirmacao`
