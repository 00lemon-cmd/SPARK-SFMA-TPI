import type { Handedness, Laterality, ResultEntry, TPIDysfunction } from "@/lib/types";
import { MEDICAL_L2_MAP } from "./medical-l2-map";
import { resolveLeadTrail } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";
import {
  sortBreakoutChainNames,
  sortBreakoutQueue,
  stripTopTierSideSuffix,
} from "@/engine/assessment-helpers";

function sortTestsByTopTierOrder(tests: Set<string>): string[] {
  const orderIndex = new Map<string, number>(
    TT_ORDER.map((t, i) => [t, i])
  );
  return Array.from(tests).sort((a, b) => {
    const ia = orderIndex.has(a) ? orderIndex.get(a)! : 999;
    const ib = orderIndex.has(b) ? orderIndex.get(b)! : 999;
    return ia - ib || a.localeCompare(b);
  });
}

/** Map catalog L/R test tokens to patient lead/trail for MD/SMFA test names. */
export function resolveTopTierTestName(
  test: string,
  laterality: Laterality,
  lead: string,
  trail: string
): string {
  const needsSide =
    test.includes("Rotation L") ||
    test.includes("Rotation R") ||
    test.includes("SLS L") ||
    test.includes("SLS R") ||
    test.includes("UE Pattern");

  if (!needsSide) return test;

  if (laterality === "LEAD") return test.replace(/ [LR]$/, ` ${lead}`);
  if (laterality === "TRAIL") return test.replace(/ [LR]$/, ` ${trail}`);
  return test;
}

export interface SFMARecommendation {
  /** All unique top-tier tests, ordered per SFMA top-tier sequence (TT_ORDER). */
  topTierTests: string[];
  /** Top-tier tests linked to mobility dysfunction (MD) hypotheses — prioritize breakouts to confirm or rule out tissue/joint restriction. */
  topTierTestsMd: string[];
  /** Top-tier tests linked to stability / motor control (SMCD) hypotheses. */
  topTierTestsSmcd: string[];
  breakoutChains: string[];
  dysfunctions: TPIDysfunction[];
}

/**
 * Top-tier cleared at screening (FN), or that pattern’s breakout was already executed in this log.
 */
export function isSfmaTopTierSatisfiedInLog(testName: string, log: ResultEntry[]): boolean {
  const top = log.filter(
    (e) => e.phase === "TOP_TIER" && e.test === testName
  );
  if (top.length > 0) {
    const last = top[top.length - 1];
    if (last.score === "FN") return true;
  }
  if (log.some((e) => e.phase === "BREAKOUT" && e.pattern === testName)) {
    return true;
  }
  return false;
}

/** Every L/R (or single) variant for this chain label was satisfied in the assessment log. */
export function isSfmaBreakoutChainSatisfiedInLog(
  chainBase: string,
  log: ResultEntry[]
): boolean {
  const variants = TT_ORDER.filter(
    (t) => stripTopTierSideSuffix(t) === chainBase || t === chainBase
  );
  if (variants.length === 0) return false;
  return variants.every((v) => isSfmaTopTierSatisfiedInLog(v, log));
}

function filterSfmaRecommendationByLog(
  rec: SFMARecommendation,
  log: ResultEntry[],
  handedness: Handedness
): SFMARecommendation {
  const { lead, trail } = resolveLeadTrail(handedness);
  const filterTests = (tests: string[]) =>
    sortBreakoutQueue(tests.filter((t) => !isSfmaTopTierSatisfiedInLog(t, log)));
  const filterChains = (chains: string[]) =>
    sortBreakoutChainNames(
      chains.filter((c) => !isSfmaBreakoutChainSatisfiedInLog(c, log))
    );
  const dysfunctions = rec.dysfunctions.filter((d) => {
    const resolved = d.sfmaTests.map((test) =>
      resolveTopTierTestName(test, d.laterality, lead, trail)
    );
    return resolved.some((t) => !isSfmaTopTierSatisfiedInLog(t, log));
  });
  return {
    topTierTests: filterTests(rec.topTierTests),
    topTierTestsMd: filterTests(rec.topTierTestsMd),
    topTierTestsSmcd: filterTests(rec.topTierTestsSmcd),
    breakoutChains: filterChains(rec.breakoutChains),
    dysfunctions,
  };
}

export function recommendSFMATests(
  selectedFaultIds: string[],
  handedness: Handedness,
  assessmentResults?: ResultEntry[] | null
): SFMARecommendation {
  const { lead, trail } = resolveLeadTrail(handedness);
  const topTierSet = new Set<string>();
  const mdTierSet = new Set<string>();
  const smcdTierSet = new Set<string>();
  const breakoutSet = new Set<string>();
  const dysfunctions: TPIDysfunction[] = [];

  for (const faultId of selectedFaultIds) {
    const mapping = MEDICAL_L2_MAP.find((m) => m.faultId === faultId);
    if (!mapping) continue;

    const allDysfunctions = [
      ...mapping.mobilityDysfunctions,
      ...mapping.smcdDysfunctions,
    ];
    for (const dysfunction of allDysfunctions) {
      dysfunctions.push(dysfunction);
      for (const test of dysfunction.sfmaTests) {
        const resolved = resolveTopTierTestName(
          test,
          dysfunction.laterality,
          lead,
          trail
        );
        topTierSet.add(resolved);
        if (dysfunction.type === "MD") {
          mdTierSet.add(resolved);
        } else {
          smcdTierSet.add(resolved);
        }
        breakoutSet.add(test.replace(/ [LR]$/, ""));
      }
    }
  }

  let rec: SFMARecommendation = {
    topTierTests: sortBreakoutQueue(sortTestsByTopTierOrder(topTierSet)),
    topTierTestsMd: sortBreakoutQueue(sortTestsByTopTierOrder(mdTierSet)),
    topTierTestsSmcd: sortBreakoutQueue(sortTestsByTopTierOrder(smcdTierSet)),
    breakoutChains: sortBreakoutChainNames(Array.from(breakoutSet)),
    dysfunctions,
  };
  if (assessmentResults && assessmentResults.length > 0) {
    rec = filterSfmaRecommendationByLog(rec, assessmentResults, handedness);
  }
  return rec;
}
