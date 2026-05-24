"use client";

import { useEffect, useState } from "react";

const steps = [
  { id: "perceber", label: "Perceber", icon: "👁", color: "var(--af-cyan)" },
  { id: "raciocinar", label: "Raciocinar", icon: "🧠", color: "var(--af-violet)" },
  { id: "agir", label: "Agir", icon: "⚡", color: "var(--af-magenta)" },
  { id: "avaliar", label: "Avaliar", icon: "🎯", color: "var(--af-lime)" },
];

export function ForgeFlowDiagram() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % steps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs af-mono uppercase tracking-widest af-neon-magenta mb-2">
          // AGENT LOOP
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
          O ciclo da{" "}
          <span className="af-gradient-text">decisão contínua</span>
        </h2>
        <p className="text-[var(--af-muted)] max-w-2xl mb-10">
          Diferente de automações lineares, agents operam em ciclo. Cada
          iteração enriquece o estado para melhorar a próxima decisão.
        </p>

        <div className="af-glass rounded-2xl p-8 md:p-12 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div
                  key={step.id}
                  className="text-center transition-all duration-500"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <div
                    className="text-5xl md:text-6xl mb-3 inline-block"
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 16px ${step.color})`
                        : "none",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="text-xs af-mono uppercase tracking-widest mb-1"
                    style={{ color: step.color }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="font-bold"
                    style={{ color: isActive ? step.color : "var(--af-muted)" }}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs af-mono uppercase tracking-widest text-[var(--af-muted)]">
            <span className="af-neon-cyan">↻</span> repete até{" "}
            <span className="af-neon-lime">objetivo alcançado</span> ou{" "}
            <span className="af-neon-magenta">critério de parada</span>
          </div>
        </div>
      </div>
    </section>
  );
}
