import type { BreakoutChain, ResultEntry, Score } from "@/lib/types";
import { resolveBreakoutNext } from "@/engine/breakout-processor";
import { findLatestBreakoutScore } from "@/engine/breakout-resolve";

export type TreeNodeStatus = "pending" | "current" | "scored" | "skipped";

export interface BreakoutTreeNodeView {
  id: string;
  label: string;
  status: TreeNodeStatus;
  score?: Score;
  diag?: string;
  depth: number;
}

export interface BreakoutTreeEdgeView {
  from: string;
  to: string;
  taken: boolean;
}

export interface BreakoutTreeViewModel {
  nodes: BreakoutTreeNodeView[];
  edges: BreakoutTreeEdgeView[];
  patternLabel: string;
}

function shortLabel(test: string): string {
  return test
    .replace(/^Active /i, "A: ")
    .replace(/^Passive /i, "P: ")
    .replace(/^Stabilized /i, "Stab: ")
    .replace(/Test /gi, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

function latestEntryForTest(
  log: ResultEntry[],
  test: string,
): ResultEntry | undefined {
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.phase === "BREAKOUT" && e.test === test) return e;
  }
  return undefined;
}

/**
 * Build a linear walk of the breakout chain for UI: taken path from start,
 * plus muted one-step alternate branches off scored nodes.
 */
export function buildBreakoutTreeView(
  chain: BreakoutChain,
  patternLabel: string,
  log: ResultEntry[],
  currentTest: string,
): BreakoutTreeViewModel {
  const nodes: BreakoutTreeNodeView[] = [];
  const edges: BreakoutTreeEdgeView[] = [];
  const seen = new Set<string>();

  const addNode = (
    id: string,
    status: TreeNodeStatus,
    depth: number,
    score?: Score,
    diag?: string,
  ) => {
    if (seen.has(id)) {
      const existing = nodes.find((n) => n.id === id);
      if (existing && status === "current") existing.status = "current";
      if (existing && score && !existing.score) {
        existing.score = score;
        existing.status = "scored";
        existing.diag = diag;
      }
      return;
    }
    seen.add(id);
    nodes.push({
      id,
      label: shortLabel(id),
      status,
      score,
      diag,
      depth,
    });
  };

  // Walk the taken path using logged scores (same idea as resolveBreakoutCursor).
  let test = chain.start;
  let depth = 0;
  const MAX = 80;
  const pathIds: string[] = [];

  for (let n = 0; n < MAX; n++) {
    if (!chain.nodes[test]) break;

    const entry = latestEntryForTest(log, test);
    const isCurrent = test === currentTest && !entry;

    if (entry) {
      addNode(test, "scored", depth, entry.score, entry.diag);
      pathIds.push(test);

      const node = chain.nodes[test];
      const branch = node[entry.score] ?? node.any;
      const rawNext = branch?.next;
      const nextTarget = resolveBreakoutNext(rawNext, log);

      // Show muted alternate if FN vs any diverge to different concrete tests
      if (node.FN && node.any) {
        const fnNext = resolveBreakoutNext(node.FN.next, log);
        const anyNext = resolveBreakoutNext(node.any.next, log);
        const alt =
          entry.score === "FN"
            ? anyNext !== fnNext
              ? anyNext
              : undefined
            : fnNext !== anyNext
              ? fnNext
              : undefined;
        if (alt && alt !== "EXIT" && !alt.includes("Flow") && chain.nodes[alt]) {
          addNode(alt, "skipped", depth + 1);
          edges.push({ from: test, to: alt, taken: false });
        }
      }

      if (!nextTarget || nextTarget === "EXIT" || nextTarget.includes("Flow")) {
        break;
      }

      edges.push({ from: test, to: nextTarget, taken: true });
      test = nextTarget;
      depth += 1;
    } else if (isCurrent || test === currentTest) {
      addNode(test, "current", depth);
      pathIds.push(test);
      break;
    } else {
      // Unreached but on projected path from start with no scores yet
      addNode(test, test === currentTest ? "current" : "pending", depth);
      pathIds.push(test);
      break;
    }
  }

  // If current isn't on the walked path (e.g. mid-chain jump), ensure it appears
  if (currentTest && chain.nodes[currentTest] && !seen.has(currentTest)) {
    const entry = latestEntryForTest(log, currentTest);
    addNode(
      currentTest,
      entry ? "scored" : "current",
      depth + 1,
      entry?.score,
      entry?.diag,
    );
  }

  // Preview a few upcoming FN-path nodes from current (unscored)
  if (currentTest && chain.nodes[currentTest] && !findLatestBreakoutScore(log, currentTest)) {
    let preview = currentTest;
    let previewDepth = nodes.find((n) => n.id === currentTest)?.depth ?? depth;
    for (let i = 0; i < 4; i++) {
      const node = chain.nodes[preview];
      if (!node) break;
      const guessNext = resolveBreakoutNext(node.FN?.next ?? node.any?.next, log);
      if (!guessNext || guessNext === "EXIT" || guessNext.includes("Flow")) break;
      if (!chain.nodes[guessNext]) break;
      if (seen.has(guessNext)) break;
      edges.push({ from: preview, to: guessNext, taken: false });
      addNode(guessNext, "pending", previewDepth + 1);
      preview = guessNext;
      previewDepth += 1;
    }
  }

  return { nodes, edges, patternLabel };
}

export interface TopTierCellView {
  name: string;
  status: "pending" | "current" | "scored";
  score?: Score;
  queuedForBreakout: boolean;
}

export function buildTopTierProgress(
  ttOrder: readonly string[],
  log: ResultEntry[],
  currentTest: string,
  mode: "TT" | "BO",
  boQueue: string[],
): TopTierCellView[] {
  const ttScores = new Map<string, Score>();
  for (const e of log) {
    if (e.phase === "TOP_TIER") ttScores.set(e.test, e.score);
  }

  return ttOrder.map((name) => {
    const score = ttScores.get(name);
    const queued =
      (score !== undefined && score !== "FN") ||
      boQueue.some((p) => p === name);
    let status: TopTierCellView["status"] = "pending";
    if (score) status = "scored";
    else if (mode === "TT" && name === currentTest) status = "current";
    return {
      name,
      status,
      score,
      queuedForBreakout: queued,
    };
  });
}
