"use client";

import { useEffect, useState } from "react";

const phrases = [
  "que decide",
  "que aprende",
  "que evolui",
  "que respeita contratos",
  "que sabe quando parar",
];

export function ForgeHero() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 md:px-12 lg:px-24 pt-24 pb-16 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="af-pulse af-neon-lime text-xs af-mono uppercase tracking-widest">
            ● Online
          </span>
          <span className="text-[var(--af-muted)] text-xs af-mono uppercase tracking-widest">
            v1.0 · MVP
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          <span className="block af-neon-cyan">AGENT</span>
          <span className="block af-gradient-text">FORGE</span>
        </h1>

        <div className="text-xl md:text-3xl text-[var(--af-text)] max-w-3xl font-light">
          Forje agents{" "}
          <span
            key={phraseIdx}
            className="af-neon-magenta font-bold inline-block"
            style={{ animation: "splash-fade-in 0.5s ease-out" }}
          >
            {phrases[phraseIdx]}
          </span>
        </div>

        <p className="text-[var(--af-muted)] mt-8 max-w-2xl text-base md:text-lg leading-relaxed">
          Um criador de agents autônomos que segue a arquitetura{" "}
          <strong className="af-neon-cyan">Spec Driven Agents</strong>. Você
          descreve o problema, o forjador gera os{" "}
          <strong className="af-neon-lime">9 contratos</strong> em Markdown que
          um runtime genérico executa.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-3 text-xs af-mono uppercase tracking-widest text-[var(--af-muted)]">
          <span>⚡ Task-based</span>
          <span className="text-[var(--af-violet)]">·</span>
          <span>💬 Interativo</span>
          <span className="text-[var(--af-violet)]">·</span>
          <span>🎯 Goal-oriented</span>
          <span className="text-[var(--af-violet)]">·</span>
          <span>🤖 Autônomo</span>
        </div>
      </div>
    </section>
  );
}
