import docTutor from "@forge/agents/doc-tutor/blueprint.json";
import geradorPrompt from "@forge/agents/gerador-prompt/blueprint.json";

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
  docTutor as AgentBlueprint,
  geradorPrompt as AgentBlueprint,
];
