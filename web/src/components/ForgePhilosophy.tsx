export function ForgePhilosophy() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="af-glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="af-noise" />
          <div className="text-xs af-mono uppercase tracking-widest af-neon-cyan mb-4">
            // FILOSOFIA
          </div>
          <blockquote className="text-2xl md:text-4xl font-light leading-tight">
            O agent <span className="line-through opacity-30">não</span> está no{" "}
            <span className="af-neon-magenta line-through">código</span>.
            <br />
            O agent está na{" "}
            <span className="af-neon-lime font-bold">especificação</span>.
          </blockquote>
          <p className="text-[var(--af-muted)] mt-6 text-sm af-mono">
            ─ Spec Driven Agents
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Comparison
            title="Sistema tradicional"
            color="var(--af-magenta)"
            items={[
              "Segue um roteiro fixo",
              "Lógica determinística (if/else)",
              "Falha em fluxos imprevistos",
              "Reativo: entrada → processo → saída",
              "Não aprende",
            ]}
          />
          <Comparison
            title="Agent autônomo"
            color="var(--af-cyan)"
            items={[
              "Persegue um objetivo",
              "Decide a cada iteração",
              "Adapta-se a contexto",
              "Loop contínuo de decisão",
              "Aprende com experiência",
            ]}
            highlight
          />
        </div>
      </div>
    </section>
  );
}

function Comparison({
  title,
  items,
  color,
  highlight,
}: {
  title: string;
  items: string[];
  color: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="af-glass af-glass-hover rounded-xl p-6"
      style={{ borderColor: highlight ? color : "var(--af-border)" }}
    >
      <h3
        className="text-sm af-mono uppercase tracking-widest mb-4"
        style={{ color }}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[var(--af-text)]"
          >
            <span style={{ color }}>{highlight ? "▸" : "✕"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
