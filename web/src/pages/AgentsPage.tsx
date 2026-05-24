import { Link } from "react-router-dom";
import { agents } from "../data/agents";

const TIPO_COLOR: Record<string, string> = {
  "task-based": "var(--af-cyan)",
  interactive: "var(--af-magenta)",
  "goal-oriented": "var(--af-lime)",
  autonomous: "var(--af-violet)",
};

const ARQ_ICON: Record<string, string> = {
  react: "🔄",
  "plan-and-execute": "📋",
  reflection: "🪞",
};

export function AgentsPage() {
  return (
    <div>
      <header className="px-6 md:px-12 lg:px-24 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-xs af-mono uppercase tracking-widest af-neon-cyan hover:underline">
            ← Agent Forge
          </Link>
          <div className="flex items-end justify-between flex-wrap gap-4 mt-4">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                <span className="af-gradient-text">Agents Forjados</span>
              </h1>
              <p className="text-[var(--af-muted)] mt-3">
                {agents.length === 0
                  ? "Nenhum agent ainda. Use a skill no Cursor."
                  : `${agents.length} agent${agents.length === 1 ? "" : "s"} criado${agents.length === 1 ? "" : "s"}.`}
              </p>
            </div>
            <div className="af-mono text-xs uppercase tracking-widest af-neon-lime">
              ● {agents.length} ativo{agents.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </header>

      <section className="px-6 md:px-12 lg:px-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {agents.length === 0 ? (
            <div className="af-glass rounded-2xl p-12 text-center">
              <div className="text-7xl mb-6 af-float">🧰</div>
              <h2 className="text-2xl font-bold af-neon-cyan mb-3">A forja está vazia</h2>
              <p className="text-[var(--af-muted)] mb-8 max-w-md mx-auto">
                No Cursor, diga <code className="af-mono af-neon-lime">"criar um agent"</code>.
              </p>
              <Link to="/conceitos" className="af-btn-primary">▸ Ver conceitos</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((a) => {
                const color = TIPO_COLOR[a.tipo ?? ""] ?? "var(--af-cyan)";
                const arqIcon = ARQ_ICON[a.arquitetura_cognitiva ?? ""] ?? "🤖";
                return (
                  <div key={a.nome} className="af-glass af-glass-hover rounded-xl p-6 h-full flex flex-col" style={{ borderColor: `${color}33` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>{arqIcon}</div>
                      {a.tipo && (
                        <span className="text-[10px] af-mono uppercase tracking-widest px-2 py-1 rounded border" style={{ color, borderColor: `${color}66` }}>
                          {a.tipo}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold" style={{ color }}>{a.nome_amigavel ?? a.nome}</h3>
                    <code className="af-mono text-xs text-[var(--af-muted)] block mt-1">{a.nome}</code>
                    {a.objetivo && <p className="text-[var(--af-text)] text-sm mt-3 leading-relaxed line-clamp-4">{a.objetivo}</p>}
                    <div className="mt-auto pt-4 flex items-center gap-3 text-xs af-mono text-[var(--af-muted)] uppercase tracking-widest">
                      {a.skills && <span>{a.skills.length} skills</span>}
                      {a.arquitetura_cognitiva && (<><span style={{ color }}>·</span><span>{a.arquitetura_cognitiva}</span></>)}
                    </div>
                    <p className="text-[10px] af-mono text-[var(--af-muted)] mt-3">
                      📁 agent-forge/agents/{a.nome}/
                    </p>
                  </div>
                );
              })}
            </div>
          )}
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
