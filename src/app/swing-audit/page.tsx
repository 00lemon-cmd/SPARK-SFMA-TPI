"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Handedness, SwingPhase } from "@/lib/types";
import { resolveLeadTrail } from "@/lib/types";
import { SWING_FAULTS } from "@/tpi/swing-faults";
import { L1_SCREENS } from "@/tpi/level1-screens";
import { BROTHER_SISTER } from "@/tpi/brother-sister";
import { recommendSFMATests } from "@/tpi/tpi-to-sfma";
import { useAssessmentStore } from "@/db/assessment-store";

const PHASE_LABELS: Record<SwingPhase, string> = {
  setup: "Setup",
  backswing: "Backswing",
  downswing: "Downswing",
  through_swing: "Through Swing",
  other: "Other",
};

const PHASE_ORDER: SwingPhase[] = ["setup", "backswing", "downswing", "through_swing"];

function SwingAuditContent() {
  const params = useSearchParams();
  const router = useRouter();
  const client = params.get("client") || "Unknown";
  const handedness = (params.get("hand") as Handedness) || "right";
  const sides = resolveLeadTrail(handedness);

  const asidParam = params.get("asid");
  const assessmentResultsForFilter = useAssessmentStore((s) => {
    const id = Number(asidParam ?? "");
    if (!Number.isFinite(id) || id <= 0) return undefined;
    return s.getById(id)?.results;
  });

  const [selectedFaults, setSelectedFaults] = useState<Set<string>>(new Set());

  const faultsByPhase = useMemo(() => {
    const grouped = new Map<SwingPhase, typeof SWING_FAULTS>();
    for (const phase of PHASE_ORDER) {
      grouped.set(
        phase,
        SWING_FAULTS.filter((f) => f.phase === phase).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    }
    return grouped;
  }, []);

  const recommendations = useMemo(() => {
    if (selectedFaults.size === 0) return null;
    return recommendSFMATests(
      Array.from(selectedFaults),
      handedness,
      assessmentResultsForFilter
    );
  }, [selectedFaults, handedness, assessmentResultsForFilter]);

  const linkedL1Screens = useMemo(
    () =>
      L1_SCREENS.filter((s) =>
        s.linkedFaults.some((fId) => selectedFaults.has(fId))
      ),
    [selectedFaults]
  );

  const brotherSisterFaults = useMemo(() => {
    const related = new Set<string>();
    Array.from(selectedFaults).forEach((id) => {
      (BROTHER_SISTER[id] ?? []).forEach((bId) => {
        if (!selectedFaults.has(bId)) related.add(bId);
      });
    });
    return Array.from(related)
      .map((id) => SWING_FAULTS.find((f) => f.id === id))
      .filter(Boolean);
  }, [selectedFaults]);

  function toggleFault(id: string) {
    setSelectedFaults((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function proceedToSFMA() {
    const p = new URLSearchParams({ client, hand: handedness });
    router.push(`/assessment?${p.toString()}`);
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 sm:px-5 pt-6 sm:pt-10 pb-10">
      <div className="w-full max-w-[850px] space-y-5">
        <div className="rounded-xl bg-spark-card p-4 sm:p-6 shadow-lg">
          <div className="rounded-md bg-blue-700 px-4 py-3 sm:py-4 text-white font-bold text-base sm:text-lg tracking-wide mb-1 text-center">
            TPI SWING AUDIT
          </div>
          <div className="flex items-center justify-between px-1 py-2 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {selectedFaults.size} fault{selectedFaults.size !== 1 ? "s" : ""} selected
            </span>
            <span className="text-xs text-slate-400">
              Patient: <b className="text-slate-600">{client}</b>
              <span className="text-slate-300 mx-1">&middot;</span>
              {handedness === "right" ? "R" : "L"}-handed
              <span className="text-slate-300 mx-1">&middot;</span>
              Lead: {sides.lead} / Trail: {sides.trail}
            </span>
          </div>

          <p className="text-sm text-slate-500 mb-4 text-center">
            Select the swing faults you observe. Recommendations update automatically.
            {assessmentResultsForFilter && assessmentResultsForFilter.length > 0 && (
              <span className="block mt-1 text-xs text-emerald-700 font-semibold">
                SFMA suggestions exclude tests/chains already cleared in assessment{" "}
                {asidParam ? `#${asidParam}` : ""}.
              </span>
            )}
          </p>

          {PHASE_ORDER.map((phase) => {
            const faults = faultsByPhase.get(phase) ?? [];
            return (
              <div key={phase} className="mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                  {PHASE_LABELS[phase]}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {faults.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFault(f.id)}
                      className={`px-3 py-2.5 rounded-md text-xs font-bold border transition-all text-left ${
                        selectedFaults.has(f.id)
                          ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                          : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {selectedFaults.size > 0 && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedFaults(new Set())}
                className="px-4 py-2 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {brotherSisterFaults.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-5 shadow-lg">
            <h2 className="font-bold text-amber-800 text-sm mb-2">
              Brother-Sister Faults to Watch For
            </h2>
            <p className="text-xs text-amber-700/80 mb-3">
              These faults commonly appear alongside your selections. Tap to add.
            </p>
            <div className="flex flex-wrap gap-2">
              {brotherSisterFaults.map((f) => (
                <button
                  key={f!.id}
                  onClick={() => toggleFault(f!.id)}
                  className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded border border-amber-300 hover:bg-amber-200 transition-colors"
                >
                  + {f!.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {recommendations && (
          <>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 shadow-lg space-y-4">
              <div>
                <h2 className="font-bold text-emerald-800 text-sm mb-1">
                  Recommended SFMA Top-Tier Tests
                </h2>
                <p className="text-xs text-emerald-700/80 mb-3">
                  Based on selected swing faults, ordered per standard SFMA sequence.
                </p>
                {recommendations.topTierTests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recommendations.topTierTests.map((t) => (
                      <span
                        key={t}
                        className="bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No specific tests identified.</p>
                )}
              </div>

              <div className="border-t border-emerald-200 pt-3">
                <h3 className="font-bold text-orange-900 text-xs mb-1.5 uppercase tracking-wide">
                  Mobility (MD) Hypotheses
                </h3>
                {recommendations.topTierTestsMd.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recommendations.topTierTestsMd.map((t) => (
                      <span key={`md-${t}`} className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">None from current selection.</p>
                )}
              </div>

              <div className="border-t border-emerald-200 pt-3">
                <h3 className="font-bold text-blue-900 text-xs mb-1.5 uppercase tracking-wide">
                  Stability / Motor Control (SMCD) Hypotheses
                </h3>
                {recommendations.topTierTestsSmcd.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {recommendations.topTierTestsSmcd.map((t) => (
                      <span key={`smcd-${t}`} className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">None from current selection.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-orange-50 border border-orange-200 p-5 shadow-lg">
              <h2 className="font-bold text-orange-800 text-sm mb-2">
                Breakout Chains to Investigate
              </h2>
              {recommendations.breakoutChains.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recommendations.breakoutChains.map((c) => (
                    <span key={c} className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No specific chains identified.</p>
              )}
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 shadow-lg">
              <h2 className="font-bold text-slate-700 text-sm mb-2">
                Dysfunctions to Screen For
              </h2>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                {recommendations.dysfunctions.length > 0 ? (
                  recommendations.dysfunctions.map((d, i) => (
                    <div key={i} className="text-sm text-slate-600">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold mr-1.5 ${
                          d.type === "MD"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {d.type}
                      </span>
                      {d.description}
                      <span className="text-slate-400 ml-1 text-xs">({d.laterality})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No remaining dysfunction rows — all linked SFMA tests are covered in the loaded
                    assessment.
                  </p>
                )}
              </div>
            </div>

            {linkedL1Screens.length > 0 && (
              <div className="rounded-xl bg-purple-50 border border-purple-200 p-5 shadow-lg">
                <h2 className="font-bold text-purple-800 text-sm mb-2">
                  TPI Level 1 Screens to Check
                </h2>
                <div className="flex flex-wrap gap-2">
                  {linkedL1Screens.map((s) => (
                    <span key={s.id} className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-lg text-center space-y-3">
              <p className="text-sm text-slate-600 font-semibold">
                Ready to run the SFMA based on these findings?
              </p>
              <button
                onClick={proceedToSFMA}
                className="w-full rounded-md bg-spark-fn py-4 text-white font-bold text-base uppercase tracking-wide hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Proceed to Full SFMA Assessment
              </button>
            </div>
          </>
        )}

        {!recommendations && (
          <div className="rounded-xl bg-white border border-slate-200 p-8 shadow-lg text-center">
            <p className="text-slate-400 italic text-sm">
              Select one or more swing faults above to see SFMA recommendations.
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            &larr; Back to intake
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SwingAuditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500 font-bold">Loading swing audit...</div>
        </div>
      }
    >
      <SwingAuditContent />
    </Suspense>
  );
}
