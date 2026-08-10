import type { BreakoutChain, ResultEntry, Score } from "@/lib/types";
import { processBreakoutStep } from "@/engine/breakout-processor";

const MAX_SIMULATION_STEPS = 600;

export function findLatestBreakoutScore(
  log: ResultEntry[],
  test: string,
): Score | undefined {
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.phase === "BREAKOUT" && e.test === test) return e.score;
  }
  return undefined;
}

/**
 * Walks the breakout tree using any prior BREAKOUT scores for the same test name
 * (cross-pattern memory: e.g. lumbar locked active + passive reused from UE Pattern 1 → UE Pattern 2).
 * Handles sub-flow handoffs (e.g. Lower Quarter ER → IR). Call sites may skip entering a
 * flow entirely if it was already started (legacy `alreadyRan` behaviour).
 */
export function resolveBreakoutCursor(
  logic: Record<string, BreakoutChain>,
  initialChainKey: string,
  initialPatternLabel: string,
  log: ResultEntry[],
  /** When set, begin walking from this node (same chain) instead of `chain.start`. */
  entryTest?: string,
): { currentTest: string; activePattern: string; chainComplete: boolean } {
  let key = initialChainKey;
  let activePattern = initialPatternLabel;

  let chain = logic[key];
  if (!chain) {
    return { currentTest: "", activePattern, chainComplete: true };
  }

  let test = entryTest ?? chain.start;

  for (let n = 0; n < MAX_SIMULATION_STEPS; n++) {
    chain = logic[key];
    if (!chain || !chain.nodes[test]) {
      return { currentTest: test, activePattern, chainComplete: false };
    }

    const score = findLatestBreakoutScore(log, test);
    if (score === undefined) {
      return { currentTest: test, activePattern, chainComplete: false };
    }

    const step = processBreakoutStep(chain, test, score, log);

    if (step.nextTest === "EXIT") {
      return { currentTest: test, activePattern, chainComplete: true };
    }

    if (step.subPatternSwitch) {
      const flow = step.subPatternSwitch;
      key = flow;
      activePattern = flow;
      const sub = logic[key];
      if (!sub) {
        return { currentTest: test, activePattern, chainComplete: true };
      }
      test = sub.start;
      continue;
    }

    test = step.nextTest;
  }

  return { currentTest: chain.start, activePattern, chainComplete: false };
}
