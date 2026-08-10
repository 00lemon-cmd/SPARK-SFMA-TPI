/**
 * High-yield SFMA region summaries aligned with “Swing characteristics vs common SFMA findings”
 * Body–Swing Connection charts (quick reference — full SFMA still required for classification).
 */
export interface SfmaFindingSummary {
  mobility: string[];
  stability: string[];
}

export const SWING_FAULT_SFMA_SUMMARY: Record<string, SfmaFindingSummary> = {
  s_posture: {
    mobility: ["Hip extension", "Lumbar flexion / hip flexion", "Thoracic extension rotation"],
    stability: ["Thoracic extension SMCD", "Core / pelvic orientation SMCD", "Weight-bearing hip control"],
  },
  c_posture: {
    mobility: ["C-spine flexion", "C-spine rotation", "Thoracic extension rotation"],
    stability: ["Thoracic extension SMCD", "Core SMCD"],
  },
  reverse_spine_angle: {
    mobility: [
      "Trail thoracic ER",
      "Trail hip IR",
      "Lead hip IR",
      "Lumbar flexion",
      "Thoracic ER bilateral",
    ],
    stability: [
      "Core SMCD",
      "Weight-bearing trail hip SMCD",
      "Weight-bearing lead hip rotation/flexion SMCD",
    ],
  },
  loss_of_posture: {
    mobility: ["C-spine rotation", "Trail hip IR", "Trail ankle eversion", "Thoracic ER"],
    stability: ["Core SMCD", "Weight-bearing lead hip SMCD"],
  },
  flat_shoulder_plane: {
    mobility: [
      "Bilateral thoracic ER",
      "C-spine extension",
      "Lumbar flexion",
      "Trail shoulder extension rotation",
    ],
    stability: ["Core SMCD", "Thoracic extension SMCD"],
  },
  flying_elbow: {
    mobility: [
      "Bilateral thoracic ER",
      "Lead hip extension",
      "Trail tibial IR",
      "Lead shoulder flexion",
    ],
    stability: ["Lumbar flexion SMCD"],
  },
  sway: {
    mobility: ["Lead shoulder flexion", "Lumbar flexion"],
    stability: ["Lumbar flexion SMCD", "Core SMCD"],
  },
  early_extension: {
    mobility: ["Hip IR", "Ankle DF", "Thoracic rotation", "Hip flexor length"],
    stability: ["Glute/core SMCD", "Deep squat pattern SMCD"],
  },
  hiking: {
    mobility: ["Lateral chain / hip", "Thoracic side-bend drivers"],
    stability: ["Lateral core / pelvis SMCD"],
  },
  reverse_pivot: {
    mobility: ["Knee / hip strategy", "Weight shift ROM"],
    stability: ["Balance & motor control SMCD"],
  },
  slide: {
    mobility: ["Lead hip IR", "Ankle", "Thoracic rotation"],
    stability: ["Lateral stability / core SMCD"],
  },
  over_the_top: {
    mobility: ["Thoracic rotation", "Shoulder IR/ER", "Hip rotation"],
    stability: ["Sequencing / core SMCD"],
  },
  casting: {
    mobility: ["Wrist/forearm", "Lead arm path"],
    stability: ["Wrist & release SMCD"],
  },
  hanging_back: {
    mobility: ["Hip IR lead", "Ankle DF", "Thoracic toward target"],
    stability: ["Weight-shift / glute SMCD"],
  },
  scooping: {
    mobility: ["Thoracic", "Hip/ankle"],
    stability: ["UE–core sequencing SMCD"],
  },
  chicken_winging: {
    mobility: ["Shoulder ER/IR", "Thoracic rotation"],
    stability: ["Scapular / RTC SMCD"],
  },
  excessive_spinal_rotation: {
    mobility: ["Thoracic rotation", "Hip IR bilaterally", "Lumbar strategy"],
    stability: ["Core / dissociation SMCD"],
  },
  excessive_sidebend: {
    mobility: ["Lateral chain", "Lead hip IR", "Thoracic lateral flexion"],
    stability: ["Oblique / lateral core SMCD"],
  },
  limited_follow_through: {
    mobility: ["Thoracic rotation", "Shoulder mobility", "Hip extension"],
    stability: ["Decel / follow-through SMCD", "Core SMCD"],
  },
  square_feet_stance: {
    mobility: ["Hip ER/IR", "Ankle", "Lower-quarter rotation"],
    stability: ["Stance / weight-bearing SMCD"],
  },
  right_hip_high: {
    mobility: ["Pelvic asymmetry / hip flexors", "Lumbar–pelvic drivers"],
    stability: ["Pelvic tilt / core orientation SMCD"],
  },
  straightening_trail_leg: {
    mobility: ["Trail hip IR/ER", "Ankle", "Thoracic rotation"],
    stability: ["Trail leg stability SMCD", "Weight-shift SMCD"],
  },
  fat_divots: {
    mobility: ["Thoracic", "Hip/ankle", "Wrist-release mechanics"],
    stability: ["Sequencing / early extension SMCD"],
  },
  steep_swing_plane: {
    mobility: ["Thoracic / shoulder path", "Lumbar extension strategy"],
    stability: ["Swing-plane control SMCD"],
  },
  trail_arm_vertical: {
    mobility: ["Shoulder IR/ER", "Thoracic rotation"],
    stability: ["Arm elevation / RTC SMCD"],
  },
  rolling_wrists: {
    mobility: ["Forearm/wrist ROM"],
    stability: ["Wrist control / release SMCD"],
  },
};

export function getSfmaSummaryForFault(faultId: string): SfmaFindingSummary | undefined {
  return SWING_FAULT_SFMA_SUMMARY[faultId];
}
