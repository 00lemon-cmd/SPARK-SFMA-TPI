import type { Handedness, TPIDysfunction } from "@/lib/types";
import { MEDICAL_L2_MAP } from "./medical-l2-map";
import { resolveLeadTrail } from "@/lib/types";

export interface SFMARecommendation {
  topTierTests: string[];
  breakoutChains: string[];
  dysfunctions: TPIDysfunction[];
}

export function recommendSFMATests(
  selectedFaultIds: string[],
  handedness: Handedness
): SFMARecommendation {
  const { lead, trail } = resolveLeadTrail(handedness);
  const topTierSet = new Set<string>();
  const breakoutSet = new Set<string>();
  const dysfunctions: TPIDysfunction[] = [];

  const lateralitySuffix = (lat: string): string => {
    if (lat === "LEAD") return ` ${lead}`;
    if (lat === "TRAIL") return ` ${trail}`;
    return "";
  };

  for (const faultId of selectedFaultIds) {
    const mapping = MEDICAL_L2_MAP.find((m) => m.faultId === faultId);
    if (!mapping) continue;

    const allDysfunctions = [...mapping.mobilityDysfunctions, ...mapping.smcdDysfunctions];
    for (const dysfunction of allDysfunctions) {
      dysfunctions.push(dysfunction);
      for (const test of dysfunction.sfmaTests) {
        if (test.includes("Rotation L") || test.includes("Rotation R") ||
            test.includes("SLS L") || test.includes("SLS R") ||
            test.includes("UE Pattern")) {
          if (dysfunction.laterality === "LEAD") {
            topTierSet.add(test.replace(/ [LR]$/, ` ${lead}`));
          } else if (dysfunction.laterality === "TRAIL") {
            topTierSet.add(test.replace(/ [LR]$/, ` ${trail}`));
          } else {
            topTierSet.add(test);
          }
        } else {
          topTierSet.add(test);
        }

        breakoutSet.add(test.replace(/ [LR]$/, ""));
      }
    }
  }

  return {
    topTierTests: Array.from(topTierSet).sort(),
    breakoutChains: Array.from(breakoutSet).sort(),
    dysfunctions,
  };
}
