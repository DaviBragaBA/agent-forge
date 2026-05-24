import { Link } from "react-router-dom";

type Step = {
  num: number;
  title: string;
  body: string;
  code?: string;
  tip?: string;
};

const wizardSteps: Step[] = [
  {
    num: 1,
    title: "Abrir o wizard no Cursor",
    body: "No chat do Cursor (workspace da pós), diz por exemplo: «criar um agent» ou «agent forge». A skill criador-de-agents abre o wizard em português.",
    code: 'criar um agent',
  },
  {
    num: 2,
    title: "Responder às 7 perguntas",
    body: "Uma pergunta de cada vez: nome (kebab-case), objetivo, tipo de agent, arquitetura cognitiva, skills (3–7), limites do loop e memória. No fim, confirma o resumo.",
  },
  {
    num: 3,
    title: "Blueprint + 9 contratos",
    body: "O assistente gera agent-forge/agents/<nome>/blueprint.json e os ficheiros MD (agent, loop, planner, skills, toolbox, executor, rules, hooks, memory).",
  },
  {
    num: 4,
    title: "Validar (opcional mas recomendado)",
    body: "Confirma que skills e toolbox batem certo e que o blueprint segue o schema.",
    code: `cd agent-forge
pip install -r scripts/requirements.txt
python scripts/validate.py agents/<nome>/`,
  },
  {
    num: 5,
    title: "Gerar contratos (--runtime)",
    body: "Gera MD legíveis + pasta contracts/ com YAML. Atualiza a UI /agents automaticamente.",
    code: `python scripts/generate.py -b agents/<nome>/blueprint.json --runtime`,
  },
  {
    num: 6,
    title: "Validar estrutura (grátis, sem API)",
    body: "Confirma blueprint e YAML. Não precisa de chave OpenAI.",
    code: `python scripts/validate.py agents/<nome>/
cd runtime
python main.py validar --agente ../agents/<nome>`,
  },
  {
    num: 7,
    title: "Executar no Cursor (sem API key)",
    body: "No chat: executar <nome>: <pedido>. A skill executar-agent corre o agent aqui — usa Cursor/Claude Pro, zero API extra.",
    code: `executar gerador-prompt: Prompt para revisar PRs em Python`,
    tip: "runtime/main.py rodar + OPENAI_API_KEY é só laboratório do curso, opcional.",
  },
  {
    num: 8,
    title: "Ver nesta UI",
    body: "Abre /agents para ver cards dos agents. /tutorial e /conceitos para referência.",
  },
];

function StepCard({ step }: { step: Step }) {
  return (
    <div className="af-glass af-glass-hover rounded-xl p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black af-mono text-lg"
          style={{
            color: "var(--af-cyan)",
            border: "1px solid rgba(0,240,255,0.4)",
            background: "rgba(0,240,255,0.08)",
          }}
        >
          {step.num}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold mb-2 af-neon-cyan">{step.title}</h3>
          <p className="text-[var(--af-text)] text-sm leading-relaxed">{step.body}</p>
          {step.code && (
            <pre className="mt-4 p-4 rounded-lg text-xs af-mono overflow-x-auto border border-[var(--af-border)] bg-[rgba(0,0,0,0.35)] text-[var(--af-lime)]">
              {step.code}
            </pre>
          )}
          {step.tip && (
            <p className="mt-3 text-xs af-mono text-[var(--af-amber)]">⚠ {step.tip}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TutorialPage() {
  return (
    <div>
      <header className="px-6 md:px-12 lg:px-24 pt-12 pb-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="text-xs af-mono uppercase tracking-widest af-neon-cyan hover:underline">
            ← Agent Forge
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4">
            <span className="af-gradient-text">Tutorial</span>
          </h1>
          <p className="text-[var(--af-muted)] mt-3 text-lg leading-relaxed">
            Como usar o <strong className="text-[var(--af-text)]">criador de agents</strong> do Agent Forge —
            wizard no Cursor, scripts Python e runtime. Esta página não substitui as aulas do Git do curso;
            ensina só o nosso fluxo.
          </p>
        </div>
      </header>

      <section className="px-6 md:px-12 lg:px-24 pb-8">
        <div className="max-w-3xl mx-auto af-glass rounded-xl p-6 border border-[rgba(182,255,60,0.2)]">
          <p className="text-sm text-[var(--af-muted)]">
            <span className="af-neon-lime af-mono uppercase tracking-widest text-xs">Resumo ·</span>{" "}
            O assistente lê os contratos e corre o ciclo no Cursor — sem OpenAI API.
            Skill: <code className="af-mono af-neon-lime">executar-agent</code>.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-8 space-y-6 max-w-3xl mx-auto">
        <div className="text-xs af-mono uppercase tracking-widest af-neon-violet mb-2">
          // PASSO A PASSO
        </div>
        {wizardSteps.map((s) => (
          <StepCard key={s.num} step={s} />
        ))}
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Exemplo já forjado</h2>
          <p className="text-[var(--af-muted)] text-sm mb-4">
            O <code className="af-mono af-neon-cyan">pos-ia-tutor</code> foi o primeiro agent. Podes inspecionar a
            pasta e repetir os comandos trocando o nome.
          </p>
          <pre className="p-4 rounded-lg text-xs af-mono overflow-x-auto border border-[var(--af-border)] bg-[rgba(0,0,0,0.35)] text-[var(--af-lime)]">
            {`python main.py rodar --agente ../agents/pos-ia-tutor --entrada "Lista os PDFs da pos"`}
          </pre>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/agents" className="af-btn-primary">
              Ver agents
            </Link>
            <Link to="/conceitos" className="af-btn-ghost">
              Conceitos
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 border-t border-[var(--af-border)] text-center">
        <Link to="/" className="text-xs af-mono uppercase tracking-widest af-neon-cyan hover:underline">
          ← voltar para a forja
        </Link>
      </footer>
    </div>
  );
}
