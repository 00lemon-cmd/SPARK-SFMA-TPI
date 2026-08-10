"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import type { Score, AssessmentState, ResultEntry, Handedness } from "@/lib/types";
import { TT_ORDER } from "@/engine/top-tier";
import { SFMA_LOGIC } from "@/engine/sfma-tree";
import { processBreakoutStep } from "@/engine/breakout-processor";
import { resolveBreakoutCursor } from "@/engine/breakout-resolve";
import { breakoutChainKey, sortBreakoutQueue } from "@/engine/assessment-helpers";
import { useAssessmentStore } from "@/db/assessment-store";
import { useAuditStore } from "@/db/audit-store";
import AssessmentProgress from "@/components/AssessmentProgress";
import TestCard from "@/components/TestCard";
import DiagnosisCard from "@/components/DiagnosisCard";

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

  const transitionToNextBreakoutOrFinish = useCallback(
    (st: AssessmentState) => {
      let queue = [...st.boQueue];
      const log = st.resultsLog;

      if (queue.length === 0) {
        finishAndNavigate(st);
        return;
      }

      while (queue.length > 0) {
        const nextPattern = queue[0];
        const key = breakoutChainKey(nextPattern);
        const chain = SFMA_LOGIC[key];
        if (!chain) {
          queue = queue.slice(1);
          continue;
        }

        const resolved = resolveBreakoutCursor(
          SFMA_LOGIC,
          key,
          nextPattern,
          log
        );
        if (!resolved.chainComplete) {
          setState((s) => ({
            ...s,
            mode: "BO",
            boQueue: queue.slice(1),
            activePattern: resolved.activePattern,
            currentTest: resolved.currentTest,
          }));
          setDiagnosis(null);
          return;
        }
        queue = queue.slice(1);
      }

      finishAndNavigate({ ...st, boQueue: [] });
    },
    [finishAndNavigate]
  );

  const startBreakouts = useCallback(
    (st: AssessmentState) => {
      transitionToNextBreakoutOrFinish(st);
    },
    [transitionToNextBreakoutOrFinish]
  );

  const nextPattern = useCallback(
    (st: AssessmentState) => {
      transitionToNextBreakoutOrFinish(st);
    },
    [transitionToNextBreakoutOrFinish]
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
        const newKey = breakoutChainKey(state.currentTest);
        const alreadyQueued = state.boQueue.some(
          (p) => breakoutChainKey(p) === newKey
        );
        const rawQueue =
          score !== "FN" && !alreadyQueued
            ? [...state.boQueue, state.currentTest]
            : state.boQueue;
        const newQueue = sortBreakoutQueue(rawQueue);
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
        const key = breakoutChainKey(state.activePattern);

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
          const flow = result.subPatternSwitch;
          const flowTouched = newLog.some((r) => r.pattern === flow);
          if (flowTouched) {
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
            const resolved = resolveBreakoutCursor(
              SFMA_LOGIC,
              flow,
              flow,
              newLog
            );
            setTransitioning(true);
            if (resolved.chainComplete) {
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
              setState((s) => ({
                ...s,
                resultsLog: newLog,
                activePattern: resolved.activePattern,
                currentTest: resolved.currentTest,
              }));
              setTimeout(() => setTransitioning(false), 500);
            }
          }
        } else {
          const forward = resolveBreakoutCursor(
            SFMA_LOGIC,
            key,
            state.activePattern,
            newLog,
            result.nextTest
          );
          setTransitioning(true);
          if (forward.chainComplete) {
            const doneState: AssessmentState = {
              ...state,
              resultsLog: newLog,
            };
            setState(doneState);
            setTimeout(() => {
              nextPattern(doneState);
              setTransitioning(false);
            }, 1200);
          } else {
            setState((s) => ({
              ...s,
              resultsLog: newLog,
              activePattern: forward.activePattern,
              currentTest: forward.currentTest,
            }));
            setTimeout(() => setTransitioning(false), 500);
          }
        }
      }
    },
    [
      state,
      transitioning,
      pushHistory,
      startBreakouts,
      nextPattern,
    ]
  );

  const progressText =
    state.mode === "TT"
      ? `Top Tier: ${state.ttIndex + 1} of ${TT_ORDER.length}`
      : `Breakout: ${state.activePattern}`;

  const progressPct =
    state.mode === "TT"
      ? Math.round(((state.ttIndex) / TT_ORDER.length) * 100)
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1600px] rounded-2xl bg-spark-card/95 backdrop-blur border border-white/60 shadow-xl p-4 sm:p-6 lg:p-7 text-left">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 mb-4">
          <div
            className={`flex-grow rounded-xl px-5 py-3.5 text-white ${
              state.mode === "TT" ? "bg-spark-primary" : "bg-spark-breakout"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70 mb-0.5">
              Spark SFMA
            </div>
            <div className="font-semibold text-lg sm:text-xl tracking-tight">
              {state.mode === "TT" ? "Top Tier Screening" : "Breakout Audit"}
            </div>
          </div>
          <div className="sm:min-w-[220px] rounded-xl bg-white border border-slate-200 px-4 py-3 flex flex-col justify-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Patient
            </div>
            <div className="font-semibold text-slate-800 truncate">
              {state.client}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{progressText}</div>
          </div>
        </div>

        {progressPct !== undefined && (
          <div className="w-full h-1.5 bg-slate-200/80 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-slate-800 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}

        <DiagnosisCard diagnosis={diagnosis} />

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(360px,42%)_minmax(0,1fr)] gap-4 lg:gap-5 items-stretch mb-4">
          <AssessmentProgress
            mode={state.mode}
            currentTest={state.currentTest}
            activePattern={state.activePattern}
            resultsLog={state.resultsLog}
            boQueue={state.boQueue}
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
          className="w-full rounded-xl bg-slate-500/90 py-3 text-white font-semibold text-sm tracking-wide hover:bg-slate-600 transition-colors disabled:opacity-35"
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
