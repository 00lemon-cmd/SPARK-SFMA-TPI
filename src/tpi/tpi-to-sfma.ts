import type { Handedness, Laterality, TPIDysfunction } from "@/lib/types";
import { MEDICAL_L2_MAP } from "./medical-l2-map";
import { resolveLeadTrail } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";

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

/** Map pattern tests to lead/trail side labels when dysfunction is single-sided. */
function resolvePatternTestName(
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

export function recommendSFMATests(
  selectedFaultIds: string[],
  handedness: Handedness
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
        const resolved = resolvePatternTestName(
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

  return {
    topTierTests: sortTestsByTopTierOrder(topTierSet),
    topTierTestsMd: sortTestsByTopTierOrder(mdTierSet),
    topTierTestsSmcd: sortTestsByTopTierOrder(smcdTierSet),
    breakoutChains: Array.from(breakoutSet).sort(),
    dysfunctions,
  };
}
