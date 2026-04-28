"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import type { Score, AssessmentState, ResultEntry, Handedness } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";
import { SFMA_LOGIC } from "@/engine/sfma-tree";
import { processBreakoutStep } from "@/engine/breakout-processor";
import { useAssessmentStore } from "@/db/assessment-store";
import { useAuditStore } from "@/db/audit-store";
import Timeline from "@/components/Timeline";
import TestCard from "@/components/TestCard";
import DiagnosisCard from "@/components/DiagnosisCard";

function resolveChainKey(pattern: string): string {
  if (pattern.includes("Cervical Rotation")) return "Cervical Rotation";
  if (pattern.includes("SLS")) return "SLS";
  return pattern;
}

function initialState(client: string, hand: Handedness): AssessmentState {
  return {
    client,
    handedness: hand,
    mode: "TT",
    ttIndex: 0,
    boQueue: [],
    currentTest: TT_ORDER[0],
    activePattern: "",
    resultsLog: [],
  };
}

function AssessmentContent() {
  const params = useSearchParams();
  const router = useRouter();
  const client = params.get("client") || "Unknown";
  const hand = (params.get("hand") as Handedness) || "right";

  const [state, setState] = useState<AssessmentState>(() =>
    initialState(client, hand)
  );
  const [history, setHistory] = useState<AssessmentState[]>([]);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const saveAssessment = useAssessmentStore((s) => s.save);
  const addAudit = useAuditStore((s) => s.add);
  const savedRef = useRef(false);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (state.resultsLog.length > 0 && !savedRef.current) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state.resultsLog.length]);

  const pushHistory = useCallback(() => {
    setHistory((h) => {
      const next = [...h, JSON.parse(JSON.stringify(state)) as AssessmentState];
      if (next.length > 40) next.shift();
      return next;
    });
  }, [state]);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setState(prev);
      setDiagnosis(null);
      return h.slice(0, -1);
    });
  }, []);

  const finishAndNavigate = useCallback(
    (st: AssessmentState) => {
      if (!savedRef.current) {
        const saved = saveAssessment(st.client, st.handedness, st.resultsLog);
        addAudit({ action: "assessment_saved", client: st.client });
        savedRef.current = true;
        router.push(`/report?id=${saved.id}`);
      }
    },
    [addAudit, router, saveAssessment]
  );

  const startBreakouts = useCallback(
    (st: AssessmentState) => {
      if (st.boQueue.length === 0) {
        finishAndNavigate(st);
        return;
      }
      const nextPattern = st.boQueue[0];
      let key = nextPattern;
      if (key.includes("Cervical Rotation")) key = "Cervical Rotation";
      if (key.includes("SLS")) key = "SLS";

      const chain = SFMA_LOGIC[key];
      if (!chain) {
        const remaining = st.boQueue.slice(1);
        setState((s) => ({ ...s, boQueue: remaining }));
        return;
      }

      setState((s) => ({
        ...s,
        mode: "BO",
        boQueue: st.boQueue.slice(1),
        activePattern: nextPattern,
        currentTest: chain.start,
      }));
      setDiagnosis(null);
    },
    [finishAndNavigate]
  );

  const nextPattern = useCallback(
    (st: AssessmentState) => {
      if (st.boQueue.length === 0) {
        finishAndNavigate(st);
        return;
      }

      const nextPat = st.boQueue[0];
      let key = nextPat;
      if (key.includes("Cervical Rotation")) key = "Cervical Rotation";
      if (key.includes("SLS")) key = "SLS";

      const chain = SFMA_LOGIC[key];
      if (!chain) {
        setState((s) => ({ ...s, boQueue: s.boQueue.slice(1) }));
        return;
      }

      setState((s) => ({
        ...s,
        boQueue: s.boQueue.slice(1),
        activePattern: nextPat,
        currentTest: chain.start,
      }));
      setDiagnosis(null);
    },
    [finishAndNavigate]
  );

  const handleScore = useCallback(
    (score: Score) => {
      if (transitioning) return;
      pushHistory();

      if (state.mode === "TT") {
        const entry: ResultEntry = {
          phase: "TOP_TIER",
          pattern: state.currentTest,
          test: state.currentTest,
          score,
        };
        const newLog = [...state.resultsLog, entry];
        const newKey = resolveChainKey(state.currentTest);
        const alreadyQueued = state.boQueue.some((p) => resolveChainKey(p) === newKey);
        const newQueue =
          score !== "FN" && !alreadyQueued
            ? [...state.boQueue, state.currentTest]
            : state.boQueue;
        const nextIdx = state.ttIndex + 1;

        if (nextIdx < TT_ORDER.length) {
          setState((s) => ({
            ...s,
            resultsLog: newLog,
            boQueue: newQueue,
            ttIndex: nextIdx,
            currentTest: TT_ORDER[nextIdx],
          }));
        } else {
          const newState: AssessmentState = {
            ...state,
            resultsLog: newLog,
            boQueue: newQueue,
            ttIndex: nextIdx,
          };
          setState(newState);
          startBreakouts(newState);
        }
      } else {
        let key = state.activePattern;
        if (key.includes("Cervical Rotation")) key = "Cervical Rotation";
        if (key.includes("SLS")) key = "SLS";

        const chain = SFMA_LOGIC[key];
        if (!chain) return;

        const result = processBreakoutStep(
          chain,
          state.currentTest,
          score,
          state.resultsLog
        );

        const entry: ResultEntry = {
          phase: "BREAKOUT",
          pattern: state.activePattern,
          test: state.currentTest,
          score,
          diag: result.diag,
        };

        const newLog = [...state.resultsLog, entry];

        if (result.diag) setDiagnosis(result.diag);

        if (result.nextTest === "EXIT") {
          setTransitioning(true);
          const newState: AssessmentState = {
            ...state,
            resultsLog: newLog,
          };
          setState(newState);
          setTimeout(() => {
            nextPattern(newState);
            setTransitioning(false);
          }, 1200);
        } else if (result.subPatternSwitch) {
          const alreadyRan = newLog.some(
            (r) => r.pattern === result.subPatternSwitch
          );
          if (alreadyRan) {
            setTransitioning(true);
            const newState: AssessmentState = {
              ...state,
              resultsLog: newLog,
            };
            setState(newState);
            setTimeout(() => {
              nextPattern(newState);
              setTransitioning(false);
            }, 300);
          } else {
            const subChain = SFMA_LOGIC[result.subPatternSwitch];
            setTransitioning(true);
            setState((s) => ({
              ...s,
              resultsLog: newLog,
              activePattern: result.subPatternSwitch!,
              currentTest: subChain ? subChain.start : result.nextTest,
            }));
            setTimeout(() => setTransitioning(false), 500);
          }
        } else {
          setTransitioning(true);
          setState((s) => ({
            ...s,
            resultsLog: newLog,
            currentTest: result.nextTest,
          }));
          setTimeout(() => setTransitioning(false), 500);
        }
      }
    },
    [state, transitioning, pushHistory, startBreakouts, nextPattern]
  );

  const timelineEntries =
    state.mode === "TT"
      ? state.resultsLog.filter((r) => r.phase === "TOP_TIER")
      : state.resultsLog.filter(
          (r) =>
            r.phase === "BREAKOUT" && r.pattern === state.activePattern
        );

  const timelineLabel =
    state.mode === "TT"
      ? "Global Scan Sequence"
      : `${state.activePattern} Sequence`;

  const progressText =
    state.mode === "TT"
      ? `Top Tier: ${state.ttIndex + 1} of ${TT_ORDER.length}`
      : `Breakout: ${state.activePattern}`;

  const progressPct =
    state.mode === "TT"
      ? Math.round(((state.ttIndex) / TT_ORDER.length) * 100)
      : undefined;

  return (
    <div className="flex min-h-screen items-start justify-center px-4 sm:px-5 pt-6 sm:pt-10 pb-10">
      <div className="w-full max-w-[850px] rounded-xl bg-spark-card p-4 sm:p-6 shadow-lg text-left">
        <div
          className={`rounded-md px-4 py-3 sm:py-4 text-white font-bold text-base sm:text-lg tracking-wide mb-1 text-center ${
            state.mode === "TT"
              ? "bg-spark-primary"
              : "bg-spark-breakout"
          }`}
        >
          {state.mode === "TT" ? "TOP TIER SCREENING" : "BREAKOUT AUDIT"}
        </div>

        <div className="flex items-center justify-between px-1 py-2 mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            {progressText}
          </span>
          <span className="text-xs text-slate-400">
            Patient: <b className="text-slate-600">{state.client}</b>
          </span>
        </div>

        {progressPct !== undefined && (
          <div className="w-full h-1.5 bg-slate-200 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-spark-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        <DiagnosisCard diagnosis={diagnosis} />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 sm:gap-5 items-stretch mb-4">
          <Timeline
            entries={timelineEntries}
            label={timelineLabel}
            mode={state.mode}
          />
          <TestCard
            testName={state.currentTest}
            pattern={state.mode === "BO" ? state.activePattern : state.currentTest}
            onScore={handleScore}
            disabled={transitioning}
          />
        </div>

        <button
          onClick={goBack}
          disabled={history.length === 0}
          className="w-full rounded-md bg-slate-400 py-3 text-white font-bold text-sm uppercase tracking-wide hover:bg-slate-500 transition-colors disabled:opacity-40"
        >
          &larr; Back (Undo Last)
        </button>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500 font-bold">Loading assessment...</div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
