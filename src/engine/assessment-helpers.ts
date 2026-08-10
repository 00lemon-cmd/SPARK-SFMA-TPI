import { TT_ORDER } from "@/engine/top-tier";

export type TopTierName = (typeof TT_ORDER)[number];

/** Map queued top-tier label → SFMA_LOGIC root key (SLS L/R share one bilateral breakout). */
export function breakoutChainKey(pattern: string): string {
  // Cervical Rotation L/R are separate side-specific chains (do not collapse).
  if (pattern.includes("SLS")) return "SLS";
  return pattern;
}

function ttOrderIndex(t: string): number {
  const idx = TT_ORDER.indexOf(t as TopTierName);
  return idx === -1 ? 999 : idx;
}

function lateralSide(pattern: string): "L" | "R" | null {
  const t = pattern.trimEnd();
  if (t.endsWith(" L")) return "L";
  if (t.endsWith(" R")) return "R";
  return null;
}

function breakoutGroupRank(t: string): number {
  if (t.startsWith("Cervical")) return 0;
  if (t.startsWith("UE Pattern")) return 1;
  if (t === "Multi-Segmental Flexion") return 2;
  if (t === "Multi-Segmental Extension") return 3;
  if (t.startsWith("MS Rotation")) return 4;
  if (t.startsWith("SLS")) return 5;
  if (t === "Deep Squat") return 6;
  return 7;
}

/**
 * Order queued breakouts: keep global scan sections in order, batch LEFT before RIGHT
 * within a section so clients repeat fewer repositioning cycles (e.g. UE Pattern 1 L, UE Pattern 2 L, then Rs).
 */
export function sortBreakoutQueue(queue: string[]): string[] {
  return [...queue].sort((a, b) => {
    const ga = breakoutGroupRank(a);
    const gb = breakoutGroupRank(b);
    if (ga !== gb) return ga - gb;

    const sa = lateralSide(a);
    const sb = lateralSide(b);
    if (sa && sb && sa !== sb) return sa === "L" ? -1 : 1;

    return ttOrderIndex(a) - ttOrderIndex(b);
  });
}

/** Strip trailing ` L` / ` R` from top-tier names (e.g. UE Pattern 1 L → UE Pattern 1). */
export function stripTopTierSideSuffix(name: string): string {
  return name.replace(/ [LR]$/, "");
}

function chainNameSortIndex(chainBase: string): number {
  const variants = TT_ORDER.filter(
    (t) => stripTopTierSideSuffix(t) === chainBase || t === chainBase
  );
  if (variants.length === 0) return 999;
  return Math.min(...variants.map((t) => ttOrderIndex(t)));
}

/** Order breakout chain labels (e.g. `UE Pattern 1`) by first matching top-tier index. */
export function sortBreakoutChainNames(chainBases: string[]): string[] {
  return [...chainBases].sort(
    (a, b) => chainNameSortIndex(a) - chainNameSortIndex(b) || a.localeCompare(b)
  );
}
