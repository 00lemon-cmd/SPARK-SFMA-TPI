export type Score = "FN" | "DN" | "DP" | "FP";
export type Phase = "TOP_TIER" | "BREAKOUT";
export type Handedness = "right" | "left";

export function resolveLeadTrail(hand: Handedness) {
  return hand === "right"
    ? { lead: "L" as const, trail: "R" as const }
    : { lead: "R" as const, trail: "L" as const };
}

export interface BranchOutcome {
  diag?: string;
  next?: string;
}

export interface TreeNode {
  FN?: BranchOutcome;
  DN?: BranchOutcome;
  DP?: BranchOutcome;
  FP?: BranchOutcome;
  any?: BranchOutcome;
}

export interface BreakoutChain {
  start: string;
  nodes: Record<string, TreeNode>;
}

export interface ResultEntry {
  phase: Phase;
  pattern: string;
  test: string;
  score: Score;
  diag?: string;
}

export interface AssessmentState {
  client: string;
  handedness: Handedness;
  mode: "TT" | "BO";
  ttIndex: number;
  boQueue: string[];
  currentTest: string;
  activePattern: string;
  resultsLog: ResultEntry[];
}

export type DysfunctionType = "MD" | "SMCD";

export interface Exercise {
  name: string;
  description: string;
  category: string;
  dysfunctionType: DysfunctionType;
  sfmaPattern: string;
  recommendedForScore: string;
  gifUrl?: string;
}

export type SwingPhase = "setup" | "backswing" | "through_swing" | "downswing" | "other";
export type Laterality = "BILATERAL" | "LEAD" | "TRAIL" | "ANY" | "EITHER";

export interface SwingFault {
  id: string;
  name: string;
  phase: SwingPhase;
  injuryRiskAreas: string[];
  tpiManualPage?: string;
}

export interface TPIDysfunction {
  description: string;
  laterality: Laterality;
  sfmaTests: string[];
  type: DysfunctionType;
}

export interface SwingFaultMapping {
  faultId: string;
  mobilityDysfunctions: TPIDysfunction[];
  smcdDysfunctions: TPIDysfunction[];
}

export interface L1Screen {
  id: string;
  name: string;
  category: string;
  linkedFaults: string[];
}

export interface CompletedAssessment {
  id?: number;
  client: string;
  handedness: Handedness;
  date: string;
  results: ResultEntry[];
}
