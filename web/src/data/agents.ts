import geradorPrompt from "@forge/agents/gerador-prompt/blueprint.json";
import posIaTutor from "@forge/agents/pos-ia-tutor/blueprint.json";

export type AgentBlueprint = {
  nome: string;
  nome_amigavel?: string;
  descricao?: string;
  tipo?: string;
  arquitetura_cognitiva?: string;
  objetivo?: string;
  skills?: unknown[];
  metadata?: { criado_em?: string };
};

/** Gerado automaticamente por scripts/generate.py — não editar à mão. */
export const agents: AgentBlueprint[] = [
  geradorPrompt as AgentBlueprint,
  posIaTutor as AgentBlueprint,
];
