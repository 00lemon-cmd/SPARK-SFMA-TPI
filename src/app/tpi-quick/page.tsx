"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Handedness, SwingPhase } from "@/lib/types";
import { resolveLeadTrail } from "@/lib/types";
import { SWING_FAULTS } from "@/tpi/swing-faults";
import { L1_SCREENS } from "@/tpi/level1-screens";
import { recommendSFMATests } from "@/tpi/tpi-to-sfma";
import { getBscRelatedFaultIds } from "@/tpi/bsc-crossref";
import { getSfmaSummaryForFault } from "@/tpi/body-swing-sfma-summaries";
import { buildQuickProgramFromSwingFaults } from "@/exercise/matcher";
import { useAuditStore } from "@/db/audit-store";

const PHASE_LABELS: Record<SwingPhase, string> = {
  setup: "Setup",
  backswing: "Backswing",
  downswing: "Downswing",
  through_swing: "Through Swing",
  other: "Other",
};

const PHASE_ORDER: SwingPhase[] = [
  "setup",
  "backswing",
  "downswing",
  "through_swing",
];

function TpiQuickContent() {
  const params = useSearchParams();
  const router = useRouter();
  const client = params.get("client")?.trim() || "Quick lookup";
  const addAudit = useAuditStore((s) => s.add);

  const [handedness, setHandedness] = useState<Handedness>(
    (params.get("hand") as Handedness) || "right"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [audited, setAudited] = useState(false);

  useEffect(() => {
    if (audited) return;
    addAudit({
      action: "tpi_quick_started",
      client: client !== "Quick lookup" ? client : undefined,
      notes: "TPI quick lookup dashboard",
    });
    setAudited(true);
  }, [addAudit, audited, client]);

  const sides = resolveLeadTrail(handedness);

  const faultsByPhase = useMemo(() => {
    const m = new Map<SwingPhase, typeof SWING_FAULTS>();
    for (const ph of PHASE_ORDER) {
      m.set(
        ph,
        SWING_FAULTS.filter((f) => f.phase === ph).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    }
    const other = SWING_FAULTS.filter(
      (f) => !PHASE_ORDER.includes(f.phase as (typeof PHASE_ORDER)[number])
    );
    if (other.length) m.set("other", other);
    return m;
  }, []);

  const sfmaRec = useMemo(() => {
    if (selected.size === 0) return null;
    return recommendSFMATests(Array.from(selected), handedness, null);
  }, [selected, handedness]);

  const exercises = useMemo(() => {
    if (selected.size === 0) return [];
    return buildQuickProgramFromSwingFaults(Array.from(selected), handedness);
  }, [selected, handedness]);

  const l1Screens = useMemo(
    () =>
      L1_SCREENS.filter((s) =>
        s.linkedFaults.some((id) => selected.has(id))
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [selected]
  );

  const bscRelated = useMemo(() => {
    const acc = new Map<string, { name: string; phase: SwingPhase }>();
    for (const id of Array.from(selected)) {
      const f = SWING_FAULTS.find((x) => x.id === id);
      if (!f) continue;
      for (const rel of getBscRelatedFaultIds(id, f.phase)) {
        if (selected.has(rel)) continue;
        const rf = SWING_FAULTS.find((x) => x.id === rel);
        if (rf) acc.set(rel, { name: rf.name, phase: rf.phase });
      }
    }
    return Array.from(acc.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(([id, v]) => ({ id, ...v }));
  }, [selected]);

  function toggleFault(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function openSfmaSession() {
    const p = new URLSearchParams();
    if (client && client !== "Quick lookup") p.set("client", client);
    p.set("hand", handedness);
    router.push(`/assessment?${p.toString()}`);
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 sm:px-5 pt-6 sm:pt-10 pb-16">
      <div className="w-full max-w-[920px] space-y-5">
        <div className="rounded-xl bg-spark-card p-4 sm:p-6 shadow-lg">
          <div className="rounded-md bg-indigo-700 px-4 py-3 sm:py-4 text-white font-bold text-base sm:text-lg tracking-wide mb-1 text-center">
            TPI QUICK LOOKUP
          </div>
          <p className="text-center text-xs text-slate-500 mt-2 max-w-xl mx-auto">
            Body–Swing Connection reference: pick observed swing characteristics (no SFMA required).
            SFMA top-tier priorities, Level 1 screens, related patterns, and starter exercises update from
            your selection and dominant hand.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              {client}
            </span>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span>Dominant:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="handq"
                  checked={handedness === "right"}
                  onChange={() => setHandedness("right")}
                  className="accent-indigo-600"
                />
                Right
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="handq"
                  checked={handedness === "left"}
                  onChange={() => setHandedness("left")}
                  className="accent-indigo-600"
                />
                Left
              </label>
              <span className="text-slate-400">
                Lead {sides.lead} / Trail {sides.trail}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-lg">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Swing characteristics
          </h2>
          {[...PHASE_ORDER, ...(faultsByPhase.has("other") ? (["other"] as const) : [])].map(
            (phase) => {
              const list = faultsByPhase.get(phase) ?? [];
              if (list.length === 0) return null;
              return (
                <div key={phase} className="mb-5 last:mb-0">
                  <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2 border-b border-slate-100 pb-1">
                    {PHASE_LABELS[phase]}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {list.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFault(f.id)}
                        title={f.injuryRiskAreas.join(", ")}
                        className={`px-2.5 py-2 rounded-md text-left text-[11px] sm:text-xs font-bold border transition-all leading-tight ${
                          selected.has(f.id)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
          )}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="mt-2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear selection ({selected.size})
            </button>
          )}
        </div>

        {selected.size === 0 ? (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center text-sm text-slate-500 italic">
            Select one or more characteristics above to see SFMA priorities, screens, and exercises.
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-950 leading-snug">
              <b>Clinical note:</b> This tool encodes TPI Body–Swing Connection charts and L2 medical
              hypotheses for fast triage. SFMA classification (FN/DN/DP/FP) and full breakout logic still
              require a formal assessment when you need documented findings.
            </div>

            {bscRelated.length > 0 && (
              <div className="rounded-xl bg-violet-50 border border-violet-200 p-4 shadow-sm">
                <h3 className="font-bold text-violet-900 text-sm mb-2">
                  Related patterns to screen (BSC)
                </h3>
                <p className="text-xs text-violet-800/90 mb-2">
                  When you see the selected fault in its phase, these characteristics often co-restrict
                  (brother–sister / phase matrix).
                </p>
                <div className="flex flex-wrap gap-2">
                  {bscRelated.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleFault(r.id)}
                      className="text-xs font-bold px-2.5 py-1 rounded border border-violet-300 bg-white text-violet-800 hover:bg-violet-100"
                    >
                      + {r.name}
                      <span className="text-violet-500 font-normal ml-1">
                        ({PHASE_LABELS[r.phase]})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                <h3 className="font-bold text-emerald-900 text-sm mb-2">
                  SFMA top-tier priorities
                </h3>
                {sfmaRec && sfmaRec.topTierTests.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {sfmaRec.topTierTests.map((t) => (
                      <span
                        key={t}
                        className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">None mapped.</p>
                )}
                {sfmaRec && sfmaRec.topTierTestsMd.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <span className="text-[10px] font-bold text-orange-800 uppercase">MD lean</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {sfmaRec.topTierTestsMd.map((t) => (
                        <span
                          key={`md-${t}`}
                          className="bg-orange-100 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {sfmaRec && sfmaRec.topTierTestsSmcd.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <span className="text-[10px] font-bold text-blue-800 uppercase">SMCD lean</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {sfmaRec.topTierTestsSmcd.map((t) => (
                        <span
                          key={`s-${t}`}
                          className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
                <h3 className="font-bold text-purple-900 text-sm mb-2">
                  TPI Level 1 screens
                </h3>
                {l1Screens.length > 0 ? (
                  <ul className="text-xs text-purple-950 space-y-1 list-disc list-inside">
                    {l1Screens.map((s) => (
                      <li key={s.id}>
                        <span className="font-bold">{s.name}</span>
                        <span className="text-purple-700/80"> · {s.category}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">None linked for this selection.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <h3 className="font-bold text-slate-800 text-sm mb-2">
                Common SFMA regions (chart summary)
              </h3>
              <div className="space-y-3">
                {Array.from(selected).map((id) => {
                  const f = SWING_FAULTS.find((x) => x.id === id);
                  const sum = getSfmaSummaryForFault(id);
                  if (!f || !sum) return null;
                  return (
                    <div key={id} className="text-xs border-b border-slate-200 pb-2 last:border-0">
                      <div className="font-bold text-slate-800">{f.name}</div>
                      <div className="mt-1 text-orange-800">
                        <span className="font-bold">MD: </span>
                        {sum.mobility.join("; ") || "—"}
                      </div>
                      <div className="text-blue-800 mt-0.5">
                        <span className="font-bold">SMCD: </span>
                        {sum.stability.join("; ") || "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {sfmaRec && sfmaRec.breakoutChains.length > 0 && (
              <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
                <h3 className="font-bold text-orange-900 text-sm mb-2">SFMA breakout chains</h3>
                <div className="flex flex-wrap gap-1.5">
                  {sfmaRec.breakoutChains.map((c) => (
                    <span
                      key={c}
                      className="bg-orange-100 text-orange-900 text-xs font-bold px-2 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-lg">
              <h3 className="font-bold text-slate-800 text-sm mb-2">
                Suggested correctives (from L2 hypotheses)
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Matched to the exercise library using the same rules as the post-SFMA program builder
                (priority caps apply).
              </p>
              {exercises.length > 0 ? (
                <ul className="space-y-2">
                  {exercises.map((p, i) => (
                    <li
                      key={`${p.exercise.name}-${i}`}
                      className="text-xs border border-slate-100 rounded-lg px-3 py-2 bg-slate-50"
                    >
                      <div className="font-bold text-slate-800">{p.exercise.name}</div>
                      <div className="text-slate-600 mt-0.5">
                        {p.exercise.category} · {p.sets}× {p.reps}
                        {p.side ? ` · ${p.side}` : ""}
                      </div>
                      <div className="text-slate-400 mt-0.5 text-[10px]">{p.forDiagnosis}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No library matches for this combination (expand SFMA mapping if needed).
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={openSfmaSession}
                className="flex-1 rounded-md bg-spark-fn py-3.5 text-white font-bold text-sm uppercase tracking-wide hover:brightness-110 transition-all"
              >
                Run full SFMA assessment
              </button>
              <Link
                href="/"
                className="flex-1 rounded-md bg-slate-200 py-3.5 text-slate-800 font-bold text-sm text-center uppercase tracking-wide hover:bg-slate-300 transition-all"
              >
                Intake home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TpiQuickPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-slate-500 font-bold">Loading…</div>
        </div>
      }
    >
      <TpiQuickContent />
    </Suspense>
  );
}
