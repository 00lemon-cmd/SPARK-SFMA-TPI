import type { ResultEntry } from "@/lib/types";

export interface AggregatedDiagnoses {
  topTier: ResultEntry[];
  breakouts: Map<string, ResultEntry[]>;
  terminalDiagnoses: ResultEntry[];
}

export function aggregateDiagnoses(results: ResultEntry[]): AggregatedDiagnoses {
  const topTier: ResultEntry[] = [];
  const breakouts = new Map<string, ResultEntry[]>();
  const terminalDiagnoses: ResultEntry[] = [];
  for (const entry of results) {
    if (entry.phase === "TOP_TIER") { topTier.push(entry); continue; }
    if (entry.phase === "BREAKOUT") {
      const bucket = breakouts.get(entry.pattern);
      if (bucket) bucket.push(entry); else breakouts.set(entry.pattern, [entry]);
      if (entry.diag) terminalDiagnoses.push(entry);
    }
  }
  return { topTier, breakouts, terminalDiagnoses };
}
