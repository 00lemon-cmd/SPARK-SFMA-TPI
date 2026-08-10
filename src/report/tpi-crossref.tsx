"use client";

import { useMemo, useState } from "react";
import type { Handedness, ResultEntry, SwingPhase } from "@/lib/types";
import { resolveLeadTrail } from "@/lib/types";
import { predictSwingFaults } from "@/tpi/sfma-to-tpi";
import { recommendSFMATests } from "@/tpi/tpi-to-sfma";
import { SWING_FAULTS } from "@/tpi/swing-faults";
import { L1_SCREENS } from "@/tpi/level1-screens";
import { BROTHER_SISTER } from "@/tpi/brother-sister";

interface Props {
  client: string;
  handedness: Handedness;
  agg: {
    topTier: ResultEntry[];
    breakouts: Map<string, ResultEntry[]>;
    terminalDiagnoses: ResultEntry[];
  };
  /** When provided (e.g. from completed SFMA), TPI→SFMA lists omit tests/chains already FN or already broken out. */
  assessmentResults?: ResultEntry[];
}

type TPITab = "sfma_to_tpi" | "tpi_to_sfma";

const SWING_AUDIT_PHASE_ORDER: Record<SwingPhase, number> = {
  setup: 0,
  backswing: 1,
  downswing: 2,
  through_swing: 3,
  other: 4,
};

export default function TPICrossRef({ client, handedness, agg, assessmentResults }: Props) {
  const [tpiTab, setTpiTab] = useState<TPITab>("sfma_to_tpi");
  const [selectedFaults, setSelectedFaults] = useState<Set<string>>(new Set());
  const sides = resolveLeadTrail(handedness);

  const swingAuditFaults = useMemo(() => {
    const phases: SwingPhase[] = [
      "setup",
      "backswing",
      "downswing",
      "through_swing",
      "other",
    ];
    return [...SWING_FAULTS]
      .filter((f) => phases.includes(f.phase))
      .sort(
        (a, b) =>
          SWING_AUDIT_PHASE_ORDER[a.phase] - SWING_AUDIT_PHASE_ORDER[b.phase] ||
          a.name.localeCompare(b.name)
      );
  }, []);

  const allPredictions = useMemo(
    () => predictSwingFaults(agg.terminalDiagnoses, handedness),
    [agg.terminalDiagnoses, handedness]
  );

  const predictions = useMemo(
    () => allPredictions.filter((p) => p.confidence !== "low"),
    [allPredictions]
  );

  const sfmaRecommendations = useMemo(() => {
    if (selectedFaults.size === 0) return null;
    return recommendSFMATests(
      Array.from(selectedFaults),
      handedness,
      assessmentResults
    );
  }, [selectedFaults, handedness, assessmentResults]);

  function toggleFault(id: string) {
    setSelectedFaults((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const date = new Date().toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="p-6">
      <div className="bg-blue-700 text-white rounded-md px-6 py-4 text-center mb-2">
        <h1 className="text-lg font-bold tracking-wider">
          TPI CROSS-REFERENCE REPORT
        </h1>
      </div>
      <div className="flex justify-between px-1 py-2 text-sm font-bold text-slate-700 mb-2">
        <span>PATIENT: {client}</span>
        <span>
          {handedness === "right" ? "Right" : "Left"}-handed golfer
          &middot; Lead: {sides.lead} / Trail: {sides.trail}
        </span>
      </div>
      <div className="text-right text-xs text-slate-400 mb-4">
        DATE: {date}
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTpiTab("sfma_to_tpi")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            tpiTab === "sfma_to_tpi"
              ? "bg-blue-700 text-white"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          SFMA &rarr; Predicted Swing Faults
        </button>
        <button
          onClick={() => setTpiTab("tpi_to_sfma")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
            tpiTab === "tpi_to_sfma"
              ? "bg-blue-700 text-white"
              : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          Swing Audit &rarr; SFMA Tests
        </button>
      </div>

      {tpiTab === "sfma_to_tpi" && (
        <div>
          <div className="bg-slate-700 text-white rounded-md px-4 py-2.5 text-center font-bold text-sm mb-3 tracking-wide">
            PREDICTED SWING FAULTS FROM SFMA FINDINGS
          </div>

          {predictions.length === 0 ? (
            <div className="text-center text-slate-400 italic py-8 text-sm">
              No significant swing fault predictions from current SFMA findings.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 text-center mb-1">
                Showing {predictions.length} relevant prediction{predictions.length !== 1 ? "s" : ""}
                {allPredictions.length > predictions.length && (
                  <span> ({allPredictions.length - predictions.length} low-confidence filtered out)</span>
                )}
              </div>
              {predictions.map((p, i) => {
                const brothers =
                  BROTHER_SISTER[p.fault.id]?.filter((bId) =>
                    predictions.some((pp) => pp.fault.id === bId)
                  ) || [];

                return (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-red-50 px-4 py-3 border-b border-slate-200 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-800">
                          {p.fault.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Phase: {p.fault.phase.replace("_", " ")} &middot;
                          Injury risk:{" "}
                          {p.injuryRisk.join(", ").replace(/_/g, " ")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded font-bold ${
                          p.confidence === "high" ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                        }`}>
                          {p.confidence === "high" ? "HIGH" : "MODERATE"}
                        </span>
                        <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded font-bold">
                          {p.evidence.length} evidence
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-2 space-y-1.5">
                      {p.matchedDysfunctions.map((d, j) => (
                        <div key={j} className="text-sm text-slate-600">
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
                          <span className="text-slate-400 ml-1 text-xs">
                            ({d.laterality})
                          </span>
                        </div>
                      ))}
                    </div>
                    {brothers.length > 0 && (
                      <div className="px-4 py-2 bg-amber-50 border-t border-slate-200 text-xs text-amber-700">
                        <b>Brother-sister faults also predicted:</b>{" "}
                        {brothers
                          .map(
                            (bId) =>
                              SWING_FAULTS.find((f) => f.id === bId)
                                ?.name || bId
                          )
                          .join(", ")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tpiTab === "tpi_to_sfma" && (
        <div>
          <div className="bg-slate-700 text-white rounded-md px-4 py-2.5 text-center font-bold text-sm mb-3 tracking-wide">
            SELECT OBSERVED SWING FAULTS
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5 max-h-[min(420px,50vh)] overflow-y-auto pr-1">
            {swingAuditFaults.map((f) => (
              <button
                key={f.id}
                type="button"
                title={`${f.phase.replace("_", " ")} · ${f.injuryRiskAreas.join(", ")}`}
                onClick={() => toggleFault(f.id)}
                className={`px-3 py-2 rounded-md text-xs font-bold border transition-all text-left ${
                  selectedFaults.has(f.id)
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {sfmaRecommendations && (
            <div className="space-y-4">
              {assessmentResults && assessmentResults.length > 0 && (
                <p className="text-xs text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-3 py-2">
                  SFMA tests and breakout chains below omit items already cleared (FN) or already
                  performed in this assessment&apos;s log.
                </p>
              )}
              {sfmaRecommendations.topTierTests.length === 0 &&
                sfmaRecommendations.topTierTestsMd.length === 0 &&
                sfmaRecommendations.topTierTestsSmcd.length === 0 &&
                sfmaRecommendations.breakoutChains.length === 0 &&
                sfmaRecommendations.dysfunctions.length === 0 && (
                  <p className="text-sm text-slate-600 italic border border-slate-200 rounded-md px-3 py-2 bg-white">
                    No remaining SFMA targets for this fault selection — everything mapped here was
                    already FN or already broken out in this assessment.
                  </p>
                )}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-emerald-800 text-sm mb-1">
                    SFMA top-tier — run in standard order (TT_ORDER)
                  </h3>
                  <p className="text-xs text-emerald-700/90 mb-2">
                    Combined unique tests from selected swing faults, ordered as in assessment.
                  </p>
                  {sfmaRecommendations.topTierTests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sfmaRecommendations.topTierTests.map((t) => (
                        <span
                          key={t}
                          className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No specific tests identified.
                    </p>
                  )}
                </div>
                <div className="border-t border-emerald-200 pt-3">
                  <h4 className="font-bold text-orange-900 text-xs mb-1.5 uppercase tracking-wide">
                    Target MD (mobility) hypotheses
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    Prioritize breakouts on these patterns when ruling in/out tissue or joint restriction.
                  </p>
                  {sfmaRecommendations.topTierTestsMd.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sfmaRecommendations.topTierTestsMd.map((t) => (
                        <span
                          key={`md-${t}`}
                          className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">None from current selection.</p>
                  )}
                </div>
                <div className="border-t border-emerald-200 pt-3">
                  <h4 className="font-bold text-blue-900 text-xs mb-1.5 uppercase tracking-wide">
                    Target SMCD (stability / motor control) hypotheses
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    Use these top-tier patterns when screening for motor control or stability-driven drivers.
                  </p>
                  {sfmaRecommendations.topTierTestsSmcd.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sfmaRecommendations.topTierTestsSmcd.map((t) => (
                        <span
                          key={`smcd-${t}`}
                          className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">None from current selection.</p>
                  )}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-bold text-orange-800 text-sm mb-2">
                  Breakout Chains to Investigate
                </h3>
                {sfmaRecommendations.breakoutChains.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {sfmaRecommendations.breakoutChains.map((c) => (
                      <span
                        key={c}
                        className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    No specific chains identified.
                  </p>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-bold text-slate-700 text-sm mb-2">
                  Dysfunctions to Screen For
                </h3>
                <div className="space-y-1">
                  {sfmaRecommendations.dysfunctions.length > 0 ? (
                    sfmaRecommendations.dysfunctions.map((d, i) => (
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
                        <span className="text-slate-400 ml-1 text-xs">
                          ({d.laterality})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No remaining dysfunction rows for this selection relative to the current
                      assessment log.
                    </p>
                  )}
                </div>
              </div>

              {/* L1 Screen recommendations */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-800 text-sm mb-2">
                  TPI Level 1 Screens to Check
                </h3>
                <div className="flex flex-wrap gap-2">
                  {L1_SCREENS.filter((s) =>
                    s.linkedFaults.some((fId) =>
                      selectedFaults.has(fId)
                    )
                  ).map((s) => (
                    <span
                      key={s.id}
                      className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!sfmaRecommendations && (
            <div className="text-center text-slate-400 italic py-8 text-sm">
              Select one or more swing faults above to see SFMA recommendations.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
