import { Link, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ConceitosPage } from "./pages/ConceitosPage";
import { AgentsPage } from "./pages/AgentsPage";
import { TutorialPage } from "./pages/TutorialPage";

function Nav() {
  const { pathname } = useLocation();
  const links = [
    { href: "/", label: "Forja" },
    { href: "/tutorial", label: "Tutorial" },
    { href: "/conceitos", label: "Conceitos" },
    { href: "/agents", label: "Agents" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--af-border)] bg-[rgba(6,6,10,0.85)] backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-black tracking-tight text-lg">
          <span className="af-neon-cyan">AGENT</span>{" "}
          <span className="af-gradient-text">FORGE</span>
        </Link>
        <div className="flex flex-wrap gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={`text-xs af-mono uppercase tracking-widest px-3 py-1.5 rounded border transition-all ${
                pathname === href
                  ? "text-[var(--af-cyan)] border-[var(--af-cyan)] bg-[rgba(0,240,255,0.1)]"
                  : "text-[var(--af-muted)] border-[var(--af-border)] hover:border-[var(--af-cyan)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/conceitos" element={<ConceitosPage />} />
        <Route path="/agents" element={<AgentsPage />} />
      </Routes>
    </>
  );
}
