import type { ResultEntry, Handedness, SwingFault, TPIDysfunction } from "@/lib/types";
import { MEDICAL_L2_MAP } from "./medical-l2-map";
import { SWING_FAULTS } from "./swing-faults";
import { resolveLeadTrail } from "@/lib/types";

export interface FaultPrediction {
  fault: SwingFault;
  matchedDysfunctions: TPIDysfunction[];
  injuryRisk: string[];
  confidence: "high" | "medium" | "low";
  evidence: string[];
}

const KEYWORD_FAULT_MAP: Record<string, string[]> = {
  "thorax ext/rot": ["reverse_spine_angle", "over_the_top", "steep_swing_plane", "excessive_spinal_rotation"],
  "Thorax ext/rot": ["reverse_spine_angle", "over_the_top", "steep_swing_plane", "excessive_spinal_rotation"],
  "Lumbar ext/rot": ["early_extension", "s_posture", "reverse_spine_angle"],
  "hip ER": ["sway", "slide", "early_extension", "square_feet_stance"],
  "hip IR": ["early_extension", "sway", "slide", "straightening_trail_leg", "over_the_top"],
  "hip extension": ["s_posture", "early_extension", "hanging_back", "reverse_spine_angle"],
  "Hip Extension MD": ["s_posture", "early_extension", "reverse_spine_angle"],
  "Shoulder flexion": ["flat_shoulder_plane", "c_posture", "steep_swing_plane"],
  "Shoulder IR": ["chicken_winging", "over_the_top", "limited_follow_through"],
  "Shoulder ER": ["flying_elbow", "trail_arm_vertical", "over_the_top", "steep_swing_plane"],
  "Shoulder extension": ["c_posture", "flat_shoulder_plane"],
  "Shoulder flex/abd": ["flying_elbow", "trail_arm_vertical"],
  "ankle dorsiflexion": ["early_extension", "sway", "slide", "hanging_back", "straightening_trail_leg"],
  "Ankle dorsiflexion": ["early_extension", "sway", "slide", "hanging_back"],
  "Pelvic SMCD": ["s_posture", "early_extension", "loss_of_posture"],
  "Hip/SI Joint": ["s_posture", "right_hip_high", "loss_of_posture"],
  "Core (Pelvic) SMCD": ["s_posture", "early_extension", "loss_of_posture", "reverse_spine_angle"],
  "cervical": ["c_posture", "loss_of_posture", "limited_follow_through"],
  "Cervical": ["c_posture", "loss_of_posture", "limited_follow_through"],
  "WB extension SMCD": ["early_extension", "reverse_spine_angle", "loss_of_posture"],
  "WB spine/core": ["loss_of_posture", "early_extension", "reverse_spine_angle"],
  "WB hip/core": ["sway", "slide", "early_extension"],
  "vestibular": ["loss_of_posture", "sway", "reverse_pivot"],
  "Postural/Shoulder SMCD": ["c_posture", "flat_shoulder_plane", "flying_elbow"],
  "Elbow flexion": ["flying_elbow", "chicken_winging"],
  "tibial": ["sway", "slide", "early_extension"],
  "Posterior chain MD": ["s_posture", "loss_of_posture", "reverse_spine_angle"],
  "Spine flexion": ["s_posture", "loss_of_posture", "reverse_spine_angle"],
  "inversion": ["sway", "slide"],
  "eversion": ["sway", "slide"],
  "plantarflexion": ["sway", "slide"],
  "Squat Isolation": [],
  "Rolling": [],
};

function matchKeywords(diag: string): string[] {
  const matched: string[] = [];
  for (const [keyword, faultIds] of Object.entries(KEYWORD_FAULT_MAP)) {
    if (diag.includes(keyword)) {
      for (const id of faultIds) {
        if (!matched.includes(id)) matched.push(id);
      }
    }
  }
  return matched;
}

export function predictSwingFaults(
  terminalDiagnoses: ResultEntry[],
  handedness: Handedness
): FaultPrediction[] {
  const { lead, trail } = resolveLeadTrail(handedness);
  const faultHits = new Map<string, string[]>();

  for (const entry of terminalDiagnoses) {
    if (!entry.diag) continue;
    const matchedFaultIds = matchKeywords(entry.diag);
    for (const faultId of matchedFaultIds) {
      const existing = faultHits.get(faultId) ?? [];
      existing.push(entry.diag);
      faultHits.set(faultId, existing);
    }
  }

  for (const mapping of MEDICAL_L2_MAP) {
    const allDysfunctions = [...mapping.mobilityDysfunctions, ...mapping.smcdDysfunctions];
    for (const dysfunction of allDysfunctions) {
      for (const entry of terminalDiagnoses) {
        if (!entry.diag) continue;
        const diagLower = entry.diag.toLowerCase();
        const descLower = dysfunction.description.toLowerCase();

        const hasKeywordOverlap =
          descLower.split(" ").filter((w) => w.length > 3).some((w) => diagLower.includes(w));

        if (hasKeywordOverlap) {
          let lateralityMatch = true;
          if (dysfunction.laterality === "LEAD") {
            lateralityMatch = entry.diag.includes(lead) || entry.diag.toLowerCase().includes("left") && lead === "L" || entry.diag.toLowerCase().includes("right") && lead === "R";
          } else if (dysfunction.laterality === "TRAIL") {
            lateralityMatch = entry.diag.includes(trail) || entry.diag.toLowerCase().includes("left") && trail === "L" || entry.diag.toLowerCase().includes("right") && trail === "R";
          }

          if (lateralityMatch) {
            const existing = faultHits.get(mapping.faultId) ?? [];
            const evidence = `${dysfunction.description} <- ${entry.diag}`;
            if (!existing.includes(evidence)) {
              existing.push(evidence);
              faultHits.set(mapping.faultId, existing);
            }
          }
        }
      }
    }
  }

  const predictions: FaultPrediction[] = [];
  for (const [faultId, evidence] of Array.from(faultHits.entries())) {
    const fault = SWING_FAULTS.find((f) => f.id === faultId);
    if (!fault) continue;
    const confidence: "high" | "medium" | "low" =
      evidence.length >= 4 ? "high" : evidence.length >= 2 ? "medium" : "low";

    const mapping = MEDICAL_L2_MAP.find((m) => m.faultId === faultId);
    const matchedDysfunctions: TPIDysfunction[] = [];
    if (mapping) {
      for (const d of [...mapping.mobilityDysfunctions, ...mapping.smcdDysfunctions]) {
        const isMatched = evidence.some((e) =>
          e.toLowerCase().includes(d.description.toLowerCase().split(" ").filter((w) => w.length > 3)[0] ?? "")
        );
        if (isMatched) matchedDysfunctions.push(d);
      }
      if (matchedDysfunctions.length === 0 && mapping.mobilityDysfunctions.length > 0) {
        matchedDysfunctions.push(mapping.mobilityDysfunctions[0]);
      }
    }

    predictions.push({ fault, matchedDysfunctions, injuryRisk: fault.injuryRiskAreas, confidence, evidence });
  }

  predictions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.confidence] - order[b.confidence] || b.evidence.length - a.evidence.length;
  });

  return predictions;
}
