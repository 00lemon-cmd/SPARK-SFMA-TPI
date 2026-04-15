import type { BreakoutChain, Score, ResultEntry } from "@/lib/types";

export interface BreakoutStepResult {
  nextTest: string;
  diag?: string;
  subPatternSwitch?: string;
}

function resolveNext(target: string | undefined, resultsLog: ResultEntry[]): string {
  if (!target) return "EXIT";
  if (!target.startsWith("CHECK_")) return target;
  const firstPipe = target.indexOf("|");
  if (firstPipe === -1) return "EXIT";
  const secondPipe = target.indexOf("|", firstPipe + 1);
  const testToCheck = target.substring(0, firstPipe).replace("CHECK_", "");
  const ifFailed = secondPipe === -1 ? target.substring(firstPipe + 1) : target.substring(firstPipe + 1, secondPipe);
  const ifPassed = secondPipe === -1 ? undefined : target.substring(secondPipe + 1);
  if (!ifFailed && !ifPassed) return "EXIT";
  const logEntry = resultsLog.find((r) => r.test === testToCheck);
  if (logEntry && logEntry.score !== "FN") return resolveNext(ifFailed, resultsLog);
  return resolveNext(ifPassed || "EXIT", resultsLog);
}

export function processBreakoutStep(
  chain: BreakoutChain, currentTest: string, score: Score, resultsLog: ResultEntry[]
): BreakoutStepResult {
  const node = chain.nodes[currentTest];
  if (!node) return { nextTest: "EXIT" };
  const branch = node[score] ?? node.any;
  if (!branch) return { nextTest: "EXIT" };
  const diag = branch.diag;
  const nextTarget = resolveNext(branch.next, resultsLog);
  if (nextTarget === "EXIT") return { nextTest: "EXIT", diag };
  if (nextTarget.includes("Flow")) return { nextTest: nextTarget, diag, subPatternSwitch: nextTarget };
  return { nextTest: nextTarget, diag };
}
