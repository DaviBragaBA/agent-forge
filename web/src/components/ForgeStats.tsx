"use client";

import { useEffect, useState } from "react";

type Stat = { value: number; label: string; suffix?: string; color: string };

const stats: Stat[] = [
  { value: 9, label: "Contratos por agent", color: "var(--af-cyan)" },
  { value: 4, label: "Tipos de agent", color: "var(--af-magenta)" },
  { value: 3, label: "Arquiteturas cognitivas", color: "var(--af-lime)" },
  { value: 4, label: "Tipos de memória", color: "var(--af-violet)" },
];

function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function StatCard({ stat }: { stat: Stat }) {
  const value = useCountUp(stat.value);
  return (
    <div
      className="af-glass af-glass-hover rounded-xl p-6 text-center"
      style={{ borderColor: `${stat.color}33` }}
    >
      <div
        className="text-5xl md:text-6xl font-black af-mono"
        style={{ color: stat.color, textShadow: `0 0 16px ${stat.color}88` }}
      >
        {value}
        {stat.suffix ?? ""}
      </div>
      <div className="text-xs uppercase tracking-widest text-[var(--af-muted)] mt-2">
        {stat.label}
      </div>
    </div>
  );
}

export function ForgeStats() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>
    </section>
  );
}
