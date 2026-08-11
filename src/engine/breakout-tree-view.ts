import type { BreakoutChain, ResultEntry, Score } from "@/lib/types";
import {
  processBreakoutStep,
  resolveBreakoutNext,
} from "@/engine/breakout-processor";
import { findLatestBreakoutScore } from "@/engine/breakout-resolve";

export type TreeNodeStatus = "pending" | "current" | "scored" | "skipped";

export interface BreakoutBranchNode {
  id: string;
  label: string;
  status: TreeNodeStatus;
  score?: Score;
  diag?: string;
  kind: "top-tier" | "test";
  children: BreakoutBranchNode[];
}

export interface BreakoutBranchTree {
  root: BreakoutBranchNode;
  patternLabel: string;
}

/** @deprecated Prefer BreakoutBranchNode — kept for any residual callers */
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

function stemAndSide(test: string): { stem: string; side: "L" | "R" | null } {
  const m = test.match(/^(.*) ([LR])$/);
  if (m) return { stem: m[1], side: m[2] as "L" | "R" };
  return { stem: test, side: null };
}

function phaseRank(test: string): number {
  if (/^Stabilized /i.test(test)) return 2;
  if (/^Passive /i.test(test)) return 3;
  if (/^Active /i.test(test)) return 1;
  return 0;
}

/** Collect taken path tip + short upcoming preview (mirrors breakout cursor). */
function collectPathTests(
  chain: BreakoutChain,
  log: ResultEntry[],
  currentTest: string,
): string[] {
  const path: string[] = [];
  const seen = new Set<string>();
  let test = chain.start;

  for (let n = 0; n < 80; n++) {
    if (!chain.nodes[test] || seen.has(test)) break;
    seen.add(test);
    path.push(test);

    const score = findLatestBreakoutScore(log, test);
    if (score === undefined) break;

    const step = processBreakoutStep(chain, test, score, log);
    if (
      !step.nextTest ||
      step.nextTest === "EXIT" ||
      step.subPatternSwitch ||
      step.nextTest.includes("Flow")
    ) {
      break;
    }
    if (!chain.nodes[step.nextTest]) break;
    test = step.nextTest;
  }

  // Ensure UI current tip is present if cursor and walk disagree slightly
  if (currentTest && chain.nodes[currentTest] && !seen.has(currentTest)) {
    path.push(currentTest);
    seen.add(currentTest);
    test = currentTest;
  }

  // Soft preview: opposite-side sibling if present, else one FN-path step
  const tip = path[path.length - 1];
  if (tip && !findLatestBreakoutScore(log, tip)) {
    const { stem, side } = stemAndSide(tip);
    if (side) {
      const opp = side === "L" ? "R" : "L";
      const sibling = `${stem} ${opp}`;
      if (chain.nodes[sibling] && !seen.has(sibling)) {
        path.push(sibling);
        seen.add(sibling);
      }
    } else {
      const node = chain.nodes[tip];
      const guessNext = resolveBreakoutNext(node?.FN?.next ?? node?.any?.next, [
        ...log,
        { phase: "BREAKOUT", pattern: "", test: tip, score: "FN" },
      ]);
      if (
        guessNext &&
        guessNext !== "EXIT" &&
        !guessNext.includes("Flow") &&
        chain.nodes[guessNext] &&
        !seen.has(guessNext)
      ) {
        path.push(guessNext);
      }
    }
  }

  return path;
}

function makeTestNode(
  id: string,
  log: ResultEntry[],
  currentTest: string,
): BreakoutBranchNode {
  const entry = latestEntryForTest(log, id);
  let status: TreeNodeStatus = "pending";
  if (entry) status = "scored";
  else if (id === currentTest) status = "current";

  return {
    id,
    label: shortLabel(id),
    status,
    score: entry?.score,
    diag: entry?.diag,
    kind: "test",
    children: [],
  };
}

function findNodeParent(
  node: BreakoutBranchNode,
  root: BreakoutBranchNode,
): BreakoutBranchNode | null {
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.children.some((c) => c.id === node.id)) return cur;
    stack.push(...cur.children);
  }
  return null;
}

/**
 * Hierarchical breakout map rooted at the top-tier result.
 * Bilateral L/R tests fan out as siblings; same-side follow-ups
 * (Active → Passive/Stabilized) hang under their side.
 */
export function buildBreakoutBranchTree(
  chain: BreakoutChain,
  patternLabel: string,
  topTierScore: Score | undefined,
  log: ResultEntry[],
  currentTest: string,
): BreakoutBranchTree {
  const root: BreakoutBranchNode = {
    id: `__tt__:${patternLabel}`,
    label: patternLabel,
    status: topTierScore ? "scored" : "current",
    score: topTierScore,
    kind: "top-tier",
    children: [],
  };

  const path = collectPathTests(chain, log, currentTest);
  const placed: BreakoutBranchNode[] = [];
  const byId = new Map<string, BreakoutBranchNode>();

  for (const testId of path) {
    if (byId.has(testId)) continue;
    const node = makeTestNode(testId, log, currentTest);
    byId.set(testId, node);

    const { stem, side } = stemAndSide(testId);
    let parent: BreakoutBranchNode = root;

    if (side) {
      // Same-side deeper phase (e.g. Passive L under Active L)
      const sameSide = [...placed]
        .reverse()
        .find((p) => {
          const ps = stemAndSide(p.id);
          return (
            ps.side === side &&
            phaseRank(testId) > phaseRank(p.id) &&
            stemsRelated(ps.stem, stem)
          );
        });

      if (sameSide) {
        parent = sameSide;
      } else {
        const opp = side === "L" ? "R" : "L";
        const sibling = byId.get(`${stem} ${opp}`);
        if (sibling) {
          // Fan out beside opposite side under the same parent
          parent = findNodeParent(sibling, root) ?? root;
        } else {
          // First of a bilateral pair — cascade from the latest path tip
          parent = placed.length ? placed[placed.length - 1] : root;
        }
      }
    } else if (placed.length > 0) {
      // Mid-chain unilateral tests continue the spine from the last placed node
      parent = placed[placed.length - 1];
    }

    parent.children.push(node);
    placed.push(node);
  }

  // Muted one-step alternates off scored nodes (FN vs any diverge)
  for (const testId of path) {
    const entry = latestEntryForTest(log, testId);
    if (!entry) continue;
    const chainNode = chain.nodes[testId];
    if (!chainNode?.FN || !chainNode.any) continue;

    const fnNext = resolveBreakoutNext(chainNode.FN.next, log);
    const anyNext = resolveBreakoutNext(chainNode.any.next, log);
    const alt =
      entry.score === "FN"
        ? anyNext !== fnNext
          ? anyNext
          : undefined
        : fnNext !== anyNext
          ? fnNext
          : undefined;

    if (!alt || alt === "EXIT" || alt.includes("Flow") || !chain.nodes[alt]) continue;
    if (byId.has(alt)) continue;

    const host = byId.get(testId);
    if (!host) continue;
    const skipped: BreakoutBranchNode = {
      id: alt,
      label: shortLabel(alt),
      status: "skipped",
      kind: "test",
      children: [],
    };
    host.children.push(skipped);
    byId.set(alt, skipped);
  }

  return { root, patternLabel };
}

function stemsRelated(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .replace(/^(Active|Passive|Stabilized)\s+/i, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  const na = norm(a);
  const nb = norm(b);
  if (na === nb) return true;
  // Share a significant token run (e.g. "Prone on Elbow Ext/Rot")
  const tokensA = na.split(" ").filter((t) => t.length > 2);
  const tokensB = new Set(nb.split(" ").filter((t) => t.length > 2));
  const overlap = tokensA.filter((t) => tokensB.has(t)).length;
  return overlap >= Math.min(2, tokensA.length);
}

/**
 * Legacy flat walk (unused by new UI, kept for scripts/tests).
 */
export function buildBreakoutTreeView(
  chain: BreakoutChain,
  patternLabel: string,
  log: ResultEntry[],
  currentTest: string,
): BreakoutTreeViewModel {
  const branch = buildBreakoutBranchTree(
    chain,
    patternLabel,
    undefined,
    log,
    currentTest,
  );
  const nodes: BreakoutTreeNodeView[] = [];
  const edges: BreakoutTreeEdgeView[] = [];

  const walk = (n: BreakoutBranchNode, depth: number) => {
    if (n.kind === "test") {
      nodes.push({
        id: n.id,
        label: n.label,
        status: n.status,
        score: n.score,
        diag: n.diag,
        depth,
      });
    }
    for (const c of n.children) {
      if (n.kind === "test") {
        edges.push({
          from: n.id,
          to: c.id,
          taken: c.status !== "skipped" && c.status !== "pending",
        });
      }
      walk(c, n.kind === "top-tier" ? 0 : depth + 1);
    }
  };
  walk(branch.root, 0);
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

/** Resolve the top-tier score that opened this breakout pattern. */
export function findTopTierScoreForPattern(
  pattern: string,
  log: ResultEntry[],
): Score | undefined {
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    if (e.phase === "TOP_TIER" && e.test === pattern) return e.score;
  }
  // Sub-flows (e.g. Lower Quarter ER Flow) — no direct TT row; leave undefined
  return undefined;
}
