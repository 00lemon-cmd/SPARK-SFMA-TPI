import type { SwingPhase } from "@/lib/types";
import { BROTHER_SISTER } from "@/tpi/brother-sister";
import { SWING_FAULTS } from "@/tpi/swing-faults";

/**
 * TPI Body–Swing Connection: backswing matrix — when this characteristic is observed on the backswing,
 * statistically related patterns to consider screening (TPI Level 1 manual / BSC charts).
 */
export const BSC_BACKSWING_RELATED: Record<string, string[]> = {
  s_posture: ["early_extension", "reverse_spine_angle", "loss_of_posture", "sway", "slide"],
  c_posture: ["flat_shoulder_plane", "flying_elbow", "loss_of_posture", "reverse_spine_angle"],
  reverse_spine_angle: [
    "early_extension",
    "loss_of_posture",
    "flat_shoulder_plane",
    "sway",
    "s_posture",
  ],
  loss_of_posture: ["early_extension", "sway", "reverse_spine_angle", "s_posture", "slide"],
  flat_shoulder_plane: ["reverse_spine_angle", "early_extension", "c_posture", "steep_swing_plane"],
  flying_elbow: ["c_posture", "chicken_winging", "over_the_top", "casting"],
  sway: ["slide", "early_extension", "loss_of_posture", "reverse_pivot", "straightening_trail_leg"],
  reverse_pivot: ["sway", "straightening_trail_leg", "loss_of_posture", "slide"],
  excessive_spinal_rotation: [
    "reverse_spine_angle",
    "early_extension",
    "loss_of_posture",
    "flat_shoulder_plane",
  ],
  straightening_trail_leg: ["sway", "reverse_pivot", "loss_of_posture", "early_extension"],
  trail_arm_vertical: ["flying_elbow", "steep_swing_plane", "over_the_top"],
};

/**
 * BSC: downswing / through-swing emphasis — related characteristics to screen when observed on downswing.
 */
export const BSC_DOWNSWING_THROUGH_RELATED: Record<string, string[]> = {
  early_extension: [
    "loss_of_posture",
    "over_the_top",
    "slide",
    "sway",
    "s_posture",
    "hanging_back",
  ],
  hiking: ["excessive_sidebend", "sway", "reverse_spine_angle", "slide"],
  slide: ["sway", "early_extension", "hanging_back", "over_the_top", "loss_of_posture"],
  over_the_top: [
    "casting",
    "early_extension",
    "steep_swing_plane",
    "reverse_spine_angle",
    "scooping",
    "chicken_winging",
    "fat_divots",
  ],
  casting: [
    "over_the_top",
    "scooping",
    "fat_divots",
    "chicken_winging",
    "early_extension",
    "rolling_wrists",
  ],
  hanging_back: ["slide", "early_extension", "scooping", "fat_divots", "casting"],
  scooping: ["casting", "chicken_winging", "rolling_wrists", "slide", "over_the_top"],
  chicken_winging: ["flying_elbow", "scooping", "casting", "limited_follow_through"],
  fat_divots: ["casting", "early_extension", "hanging_back", "over_the_top"],
  steep_swing_plane: ["over_the_top", "flat_shoulder_plane", "trail_arm_vertical"],
  excessive_sidebend: ["reverse_spine_angle", "hiking", "early_extension", "excessive_spinal_rotation"],
  rolling_wrists: ["casting", "scooping", "fat_divots"],
  limited_follow_through: ["chicken_winging", "hanging_back", "early_extension"],
};

const SETUP_FAULT_IDS = new Set(
  SWING_FAULTS.filter((f) => f.phase === "setup").map((f) => f.id)
);

function relatedForPhase(faultId: string, phase: SwingPhase): Set<string> {
  const acc = new Set<string>();
  const fromBs =
    phase === "backswing"
      ? BSC_BACKSWING_RELATED[faultId]
      : phase === "downswing" || phase === "through_swing"
        ? BSC_DOWNSWING_THROUGH_RELATED[faultId]
        : undefined;
  for (const id of fromBs ?? []) acc.add(id);
  for (const id of BROTHER_SISTER[faultId] ?? []) acc.add(id);
  acc.delete(faultId);
  return acc;
}

/**
 * Statistically related swing characteristics to consider (BSC phase matrices + brother–sister map).
 */
export function getBscRelatedFaultIds(
  faultId: string,
  phase: SwingPhase
): string[] {
  const primary = relatedForPhase(faultId, phase);
  if (SETUP_FAULT_IDS.has(faultId)) {
    for (const id of BROTHER_SISTER[faultId] ?? []) primary.add(id);
    primary.delete(faultId);
    return Array.from(primary);
  }
  return Array.from(primary);
}
