import type { L1Screen } from "@/lib/types";

export const L1_SCREENS: L1Screen[] = [
  {
    id: "overhead_deep_squat",
    name: "Overhead Deep Squat",
    category: "Lower Body",
    linkedFaults: ["early_extension", "loss_of_posture", "sway", "slide", "hanging_back", "s_posture"],
  },
  {
    id: "single_leg_balance",
    name: "Single Leg Balance",
    category: "Balance",
    linkedFaults: ["sway", "slide", "hanging_back", "reverse_pivot", "straightening_trail_leg"],
  },
  {
    id: "toe_touch",
    name: "Toe Touch",
    category: "Flexion",
    linkedFaults: ["loss_of_posture", "early_extension", "s_posture", "reverse_spine_angle"],
  },
  {
    id: "pelvic_tilt",
    name: "Pelvic Tilt Test",
    category: "Core",
    linkedFaults: ["s_posture", "early_extension", "loss_of_posture", "reverse_spine_angle", "right_hip_high"],
  },
  {
    id: "pelvic_rotation",
    name: "Pelvic Rotation Test",
    category: "Core",
    linkedFaults: ["sway", "slide", "early_extension", "reverse_spine_angle", "hanging_back"],
  },
  {
    id: "torso_rotation",
    name: "Torso Rotation Test",
    category: "Rotation",
    linkedFaults: ["reverse_spine_angle", "over_the_top", "casting", "flat_shoulder_plane", "excessive_spinal_rotation", "limited_follow_through"],
  },
  {
    id: "seated_torso_rotation",
    name: "Seated Trunk Rotation",
    category: "Rotation",
    linkedFaults: ["reverse_spine_angle", "over_the_top", "excessive_spinal_rotation", "limited_follow_through"],
  },
  {
    id: "lower_quarter_rotation",
    name: "Lower Quarter Rotation (90/90)",
    category: "Hip Rotation",
    linkedFaults: ["early_extension", "sway", "slide", "loss_of_posture", "reverse_spine_angle", "straightening_trail_leg", "square_feet_stance"],
  },
  {
    id: "lat_length",
    name: "Lat Length Test",
    category: "Upper Body",
    linkedFaults: ["flat_shoulder_plane", "loss_of_posture", "c_posture", "reverse_spine_angle", "steep_swing_plane"],
  },
  {
    id: "reach_roll_lift",
    name: "Reach, Roll, and Lift Test",
    category: "Upper Body",
    linkedFaults: ["flying_elbow", "chicken_winging", "over_the_top", "casting", "trail_arm_vertical", "limited_follow_through"],
  },
  {
    id: "cervical_rotation",
    name: "Cervical Rotation Screen",
    category: "Cervical",
    linkedFaults: ["loss_of_posture", "c_posture", "limited_follow_through", "flat_shoulder_plane"],
  },
  {
    id: "bridge_w_leg_extension",
    name: "Bridge with Leg Extension",
    category: "Core / Glute",
    linkedFaults: ["early_extension", "s_posture", "loss_of_posture", "reverse_spine_angle", "sway", "slide"],
  },
  {
    id: "wrist_patterns",
    name: "Wrist Flexion/Extension & Ulnar/Radial Deviation",
    category: "Upper Extremity",
    linkedFaults: ["casting", "scooping", "rolling_wrists", "fat_divots"],
  },
  {
    id: "forearm_rotation",
    name: "Forearm Pronation/Supination",
    category: "Upper Extremity",
    linkedFaults: ["rolling_wrists", "casting", "scooping"],
  },
  {
    id: "half_kneeling_dorsiflexion",
    name: "Half-Kneeling Dorsiflexion",
    category: "Lower Body",
    linkedFaults: ["early_extension", "sway", "slide", "loss_of_posture", "hanging_back", "straightening_trail_leg"],
  },
];
