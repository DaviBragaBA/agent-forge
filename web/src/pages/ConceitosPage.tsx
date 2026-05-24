import { Link } from "react-router-dom";
import taxonomies from "@forge/taxonomies.json";

const contratos = [
  { file: "agent.md", purpose: "Identidade, tipo, objetivo, contrato de saída", color: "var(--af-cyan)" },
  { file: "loop.md", purpose: "Controle do ciclo: max iterações, critérios de parada", color: "var(--af-magenta)" },
  { file: "planner.md", purpose: "Regras de decisão, arquitetura cognitiva", color: "var(--af-violet)" },
  { file: "skills.md", purpose: "O que o agent SABE fazer (interface)", color: "var(--af-lime)" },
  { file: "toolbox.md", purpose: "O que o agent PODE fazer (subconjunto autorizado)", color: "var(--af-amber)" },
  { file: "executor.md", purpose: "Validação, retry, tratamento de erros", color: "var(--af-cyan)" },
  { file: "rules.md", purpose: "Limites, restrições, confirmações humanas", color: "var(--af-magenta)" },
  { file: "hooks.md", purpose: "Observabilidade (eventos)", color: "var(--af-violet)" },
  { file: "memory.md", purpose: "Memórias (curta/longa/episódica/contextual)", color: "var(--af-lime)" },
];

export function ConceitosPage() {
  const tax = taxonomies;

  return (
    <div>
      <header className="px-6 md:px-12 lg:px-24 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-xs af-mono uppercase tracking-widest af-neon-cyan hover:underline">
            ← Agent Forge
          </Link>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mt-4">
            <span className="af-gradient-text">Conceitos</span>
          </h1>
          <p className="text-[var(--af-muted)] mt-3 max-w-2xl">
            Taxonomia completa do Agent Forge — referência ao criar agents.
          </p>
          <nav className="mt-8 flex flex-wrap gap-3 text-xs af-mono uppercase tracking-widest">
            <a href="#contratos" className="af-btn-ghost">Contratos</a>
            <a href="#tipos" className="af-btn-ghost">Tipos</a>
            <a href="#arquiteturas" className="af-btn-ghost">Arquiteturas</a>
            <a href="#adapters" className="af-btn-ghost">Adapters</a>
            <a href="#memorias" className="af-btn-ghost">Memórias</a>
          </nav>
        </div>
      </header>

      <Section id="contratos" title="Os 9 contratos" subtitle="A anatomia de cada agent">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contratos.map((c) => (
            <div key={c.file} className="af-glass af-glass-hover rounded-xl p-5" style={{ borderColor: `${c.color}33` }}>
              <code className="af-mono text-lg font-bold" style={{ color: c.color }}>{c.file}</code>
              <p className="text-[var(--af-muted)] text-sm mt-2">{c.purpose}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="tipos" title="4 tipos de agent" subtitle="Modo de operação">
        <div className="grid md:grid-cols-2 gap-6">
          {tax.tipos_agent.map((t, i) => (
            <ConceptCard key={t.id} icon={t.icone} title={t.nome} description={t.descricao}
              color={["var(--af-cyan)", "var(--af-magenta)", "var(--af-lime)", "var(--af-violet)"][i % 4]}
              extras={[{ label: "Ideal para", value: t.ideal_para.join(" · ") }, { label: "Exemplo", value: t.exemplo }]}
              warning={t.atencao} />
          ))}
        </div>
      </Section>

      <Section id="arquiteturas" title="3 arquiteturas cognitivas" subtitle="Como o agent pensa">
        <div className="grid md:grid-cols-3 gap-6">
          {tax.arquiteturas_cognitivas.map((a, i) => (
            <ConceptCard key={a.id} icon={a.icone} title={a.nome} description={a.descricao}
              color={["var(--af-cyan)", "var(--af-magenta)", "var(--af-lime)"][i]}
              extras={[
                { label: "Vantagens", value: a.vantagens.join(" · ") },
                { label: "Desvantagens", value: a.desvantagens.join(" · ") },
                { label: "Ideal para", value: a.ideal_para },
              ]} />
          ))}
        </div>
      </Section>

      <Section id="adapters" title="4 adapters" subtitle="Conexão com o mundo real">
        <div className="grid md:grid-cols-2 gap-6">
          {tax.adapters.map((a, i) => (
            <ConceptCard key={a.id} icon={a.icone} title={a.nome} description={a.descricao}
              color={["var(--af-cyan)", "var(--af-magenta)", "var(--af-lime)", "var(--af-violet)"][i]}
              extras={[{ label: "Uso", value: a.uso }]}
              warning={a.regras_seguranca ? `🔒 ${a.regras_seguranca.join(" · ")}` : undefined} />
          ))}
        </div>
      </Section>

      <Section id="memorias" title="4 tipos de memória" subtitle="O que o agent lembra">
        <div className="grid md:grid-cols-2 gap-6">
          {tax.tipos_memoria.map((m, i) => (
            <ConceptCard key={m.id} icon={m.icone} title={m.nome} description={m.descricao}
              color={["var(--af-cyan)", "var(--af-magenta)", "var(--af-lime)", "var(--af-violet)"][i]}
              extras={[
                { label: "Analogia", value: m.analogia },
                ...(m.tecnologia ? [{ label: "Tecnologia", value: m.tecnologia }] : []),
              ]}
              warning={m.atencao} />
          ))}
        </div>
      </Section>

      <footer className="px-6 py-12 border-t border-[var(--af-border)] text-center">
        <Link to="/" className="text-xs af-mono uppercase tracking-widest af-neon-cyan hover:underline">
          ← voltar para a forja
        </Link>
      </footer>
    </div>
  );
}

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 md:px-12 lg:px-24 py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs af-mono uppercase tracking-widest af-neon-cyan mb-2">// {id.toUpperCase()}</div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{title}</h2>
        <p className="text-[var(--af-muted)] mb-8">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

function ConceptCard({ icon, title, description, color, extras, warning }: {
  icon: string; title: string; description: string; color: string;
  extras?: Array<{ label: string; value: string }>; warning?: string;
}) {
  return (
    <div className="af-glass af-glass-hover rounded-xl p-6 h-full" style={{ borderColor: `${color}33` }}>
      <div className="flex items-start gap-4">
        <div className="text-4xl" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>{icon}</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2" style={{ color }}>{title}</h3>
          <p className="text-[var(--af-text)] text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      {extras && (
        <div className="mt-5 space-y-2 text-xs">
          {extras.map((e) => (
            <div key={e.label} className="flex gap-2">
              <span className="af-mono uppercase tracking-widest min-w-[80px]" style={{ color }}>{e.label}</span>
              <span className="text-[var(--af-muted)]">{e.value}</span>
            </div>
          ))}
        </div>
      )}
      {warning && (
        <div className="mt-4 text-xs p-3 rounded border af-mono text-[var(--af-amber)] border-[rgba(255,176,32,0.3)] bg-[rgba(255,176,32,0.05)]">
          ⚠ {warning}
        </div>
      )}
    </div>
  );
}
