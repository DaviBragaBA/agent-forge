import { Link } from "react-router-dom";

type Card = {
  emoji: string;
  title: string;
  description: string;
  color: string;
  href?: string;
  badge?: string;
};

const cards: Card[] = [
  {
    emoji: "📄",
    title: "9 Contratos MD",
    description:
      "Cada agent é definido por agent.md, loop.md, planner.md, skills.md, toolbox.md, executor.md, rules.md, hooks.md e memory.md.",
    color: "var(--af-cyan)",
    href: "/conceitos#contratos",
  },
  {
    emoji: "🧠",
    title: "3 Arquiteturas Cognitivas",
    description:
      "ReAct para exploração. Plan-and-Execute para processos estruturados. Reflection para alta qualidade.",
    color: "var(--af-violet)",
    href: "/conceitos#arquiteturas",
  },
  {
    emoji: "🔌",
    title: "4 Tipos de Adapter",
    description:
      "Mock para protótipos. REST para APIs. Database parametrizado. MCP para integração padronizada.",
    color: "var(--af-magenta)",
    href: "/conceitos#adapters",
  },
  {
    emoji: "💾",
    title: "4 Tipos de Memória",
    description:
      "Curta (ciclo). Longa (fatos). Episódica (histórico). Contextual (busca semântica via embeddings).",
    color: "var(--af-lime)",
    href: "/conceitos#memorias",
  },
  {
    emoji: "📊",
    title: "Observabilidade nativa",
    description:
      "Cada execução gera trace.json estruturado: percepção, plano, ação, resultado, raciocínio. Debug por reasoning trace.",
    color: "var(--af-amber)",
    badge: "V2",
  },
  {
    emoji: "✅",
    title: "Evals automatizadas",
    description:
      "Tool Selection (4 métricas) + Memory (6 métricas, com Decision Improvement como central). Decisões baseadas em evidência, não opinião.",
    color: "var(--af-cyan)",
    badge: "V2",
  },
];

export function ForgeCardGrid() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs af-mono uppercase tracking-widest af-neon-violet mb-2">
          // CAPACIDADES
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-10">
          O que vem na <span className="af-gradient-text">forja</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const inner = (
              <div className="af-glass af-glass-hover rounded-xl p-6 h-full relative">
                {card.badge && (
                  <span
                    className="absolute top-4 right-4 text-[10px] af-mono uppercase tracking-widest px-2 py-1 rounded border"
                    style={{
                      color: card.color,
                      borderColor: `${card.color}66`,
                    }}
                  >
                    {card.badge}
                  </span>
                )}
                <div
                  className="text-4xl mb-4"
                  style={{ filter: `drop-shadow(0 0 12px ${card.color})` }}
                >
                  {card.emoji}
                </div>
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>
                <p className="text-[var(--af-muted)] text-sm leading-relaxed">
                  {card.description}
                </p>
                {card.href && (
                  <div
                    className="mt-4 text-xs af-mono uppercase tracking-widest opacity-70"
                    style={{ color: card.color }}
                  >
                    ▸ saber mais
                  </div>
                )}
              </div>
            );
            return card.href ? (
              <Link key={card.title} to={card.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={card.title}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
