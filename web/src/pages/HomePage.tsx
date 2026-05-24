import { Link } from "react-router-dom";
import { ForgeHero } from "../components/ForgeHero";
import { ForgeStats } from "../components/ForgeStats";
import { ForgePhilosophy } from "../components/ForgePhilosophy";
import { ForgeFlowDiagram } from "../components/ForgeFlowDiagram";
import { ForgeCardGrid } from "../components/ForgeCardGrid";

export function HomePage() {
  return (
    <div>
      <ForgeHero />
      <ForgeStats />
      <ForgePhilosophy />
      <ForgeFlowDiagram />
      <ForgeCardGrid />

      <section className="px-6 md:px-12 lg:px-24 py-24">
        <div className="max-w-5xl mx-auto af-glass rounded-2xl p-8 md:p-12 relative overflow-hidden af-scanline">
          <div className="af-noise" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            <span className="af-gradient-text">Pronto para forjar?</span>
          </h2>
          <p className="text-[var(--af-muted)] text-lg mb-8 max-w-2xl">
            Primeira vez? Segue o tutorial do criador de agents (wizard no Cursor, scripts e runtime).
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/tutorial" className="af-btn-primary">
              ▸ Como usar o criador
            </Link>
            <Link to="/conceitos" className="af-btn-ghost">
              Conceitos
            </Link>
            <Link to="/agents" className="af-btn-ghost">
              Ver agents
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-12 border-t border-[var(--af-border)] text-center">
        <p className="text-[var(--af-muted)] text-sm">
          Agent Forge ·{" "}
          <span className="af-neon-cyan">Spec Driven Agents</span> · curso{" "}
          <em>Criação de Agentes Autônomos</em>
        </p>
      </footer>
    </div>
  );
}
