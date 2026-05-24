# Pedagogia — Formato de resposta Agent Forge

Guia breve para o assistente (skills `criador-de-agents` e `executar-agent`) sobre **como comunicar** de forma escaneável e ensinável.

---

## Princípio

> Cada resposta deve **ensinar** uma decisão de design — não só listar escolhas.

O utilizador aprende spec-driven agents ao ver **porque** cada contrato existe e **porque** foi configurado assim.

---

## Emojis de contrato (conjunto fixo)

| Emoji | Ficheiro | Tema |
|-------|----------|------|
| 📋 | `agent.md` | Identidade e saída |
| 🔄 | `loop.md` | Ciclo e limites |
| 🧠 | `planner.md` | Decisão cognitiva |
| ⚡ | `skills.md` | Capacidades |
| 🧰 | `toolbox.md` | Autorização |
| ⚙️ | `executor.md` | Execução |
| 🛡️ | `rules.md` | Segurança |
| 📡 | `hooks.md` | Observabilidade |
| 💾 | `memory.md` | Memória |

Transversais: 📚 (porquê), 💡 (recomendação), ✅ (sucesso), ⚠️ (risco), 🎯 (objetivo).

---

## Elementos de markdown obrigatórios

1. **Headers** (`##`, `###`) — nunca páginas sem hierarquia
2. **Tabelas** — comparações (tipos, arquiteturas, skills, trace)
3. **Blockquotes** (`>`) — callouts, avisos, princípios
4. **Negrito** — labels de campo (`**Objetivo:**`, `**Risco:**`)
5. **Code blocks** — YAML/JSON de config, não prosa longa
6. Secção **`## 📚 Porque escolhi isto`** (wizard) ou **`## 📚 Porque fiz isto`** (execução)

---

## Wizard (criador-de-agents)

### Fluxo

```
Problema → Recomendação ensinada → Confirmação → Geração → Entrega rica
```

### O que evitar

- ❌ 7 perguntas soltas sem contexto
- ❌ Dump de 9 ficheiros MD no chat
- ❌ Texto corrido sem tabelas

### O que fazer

- ✅ Tabela "4 tipos de agent" com coluna "Porque NÃO neste caso"
- ✅ Tabela de arquiteturas com vantagens/desvantagens
- ✅ Secção "Os 9 contratos deste agent" na entrega final (explicação, não conteúdo integral)

---

## Execução (executar-agent)

### Durante ReAct

Cada etapa visível com fase, raciocínio e lição curta.

### Trace final

Tabela com colunas: `# | Fase | Ação | Resultado | 📚 Lição`

Não substituir por JSON cru ou bloco `--- trace ---` de 4 linhas.

---

## Contratos gerados (templates)

Os ficheiros MD do agent devem ser **profissionais e escaneáveis**:

- Emoji no título ou secções principais
- Separadores `---` entre blocos grandes
- YAML com comentários inline quando útil
- Blockquotes para princípios e avisos

Ver `agent-forge/templates/*.template`.

---

## Tom

- Português, profissional mas amigável
- Explicar como professor, não como manual técnico seco
- Sem referências institucionais
