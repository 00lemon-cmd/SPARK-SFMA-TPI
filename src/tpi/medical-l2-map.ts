import type { SwingFaultMapping } from "@/lib/types";

export const MEDICAL_L2_MAP: SwingFaultMapping[] = [
  {
    faultId: "s_posture",
    mobilityDysfunctions: [
      { description: "Limited hip flexion range", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Flexion"], type: "MD" },
      { description: "Hip flexor tightness (Thomas test positive)", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
      { description: "Thoracic extension restriction", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor lower abdominal activation / pelvic tilt control", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Flexion", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Glute inhibition affecting pelvic posture", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "SMCD" },
    ],
  },
  {
    faultId: "reverse_spine_angle",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited hip internal rotation (trail side)", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited hip external rotation (lead side)", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Lat/shoulder tightness limiting backswing", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor core stability in rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Inability to separate upper and lower body", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Glute weakness on trail side", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Extension", "SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "excessive_spinal_rotation",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited hip internal rotation", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited hip external rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor core stability allowing excessive lumbar rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Inability to dissociate pelvis from thorax", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "excessive_sidebend",
    mobilityDysfunctions: [
      { description: "Limited thoracic lateral flexion/rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor lateral core stability / oblique control", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Glute medius weakness (lead side)", laterality: "LEAD", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "early_extension",
    mobilityDysfunctions: [
      { description: "Limited hip internal rotation (lead side)", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited ankle dorsiflexion", laterality: "BILATERAL", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Hip flexor tightness", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor glute activation / inhibition", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "SMCD" },
      { description: "Poor core stability in the downswing", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Inability to squat properly", laterality: "BILATERAL", sfmaTests: ["Deep Squat"], type: "SMCD" },
    ],
  },
  {
    faultId: "hanging_back",
    mobilityDysfunctions: [
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited ankle dorsiflexion (lead)", laterality: "LEAD", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
      { description: "Limited thoracic rotation toward target", laterality: "LEAD", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor weight shift / lateral stability", laterality: "LEAD", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
      { description: "Glute weakness (lead side)", laterality: "LEAD", sfmaTests: ["Multi-Segmental Extension", "SLS L", "SLS R"], type: "SMCD" },
      { description: "Core instability limiting forward weight transfer", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "square_feet_stance",
    mobilityDysfunctions: [
      { description: "Limited hip external rotation", laterality: "BILATERAL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited hip internal rotation", laterality: "BILATERAL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Ankle mobility restriction", laterality: "BILATERAL", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor proprioception / body awareness in stance", laterality: "BILATERAL", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "right_hip_high",
    mobilityDysfunctions: [
      { description: "Hip hiking due to lateral pelvic tilt from QL tightness", laterality: "EITHER", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
      { description: "Asymmetric hip ER/IR range", laterality: "EITHER", sfmaTests: ["Deep Squat"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Lateral core imbalance / oblique asymmetry", laterality: "EITHER", sfmaTests: ["MS Rotation L", "MS Rotation R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Glute medius weakness creating pelvic drop", laterality: "EITHER", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "sway",
    mobilityDysfunctions: [
      { description: "Limited trail hip internal rotation", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited trail hip adductor flexibility", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited ankle mobility (trail)", laterality: "TRAIL", sfmaTests: ["SLS L", "SLS R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Weak trail-side glute / hip abductor", laterality: "TRAIL", sfmaTests: ["SLS L", "SLS R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Poor single-leg stability on trail leg", laterality: "TRAIL", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
      { description: "Core instability allowing lateral drift", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "slide",
    mobilityDysfunctions: [
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited lead ankle dorsiflexion", laterality: "LEAD", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
      { description: "Limited lead hip adductor flexibility", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Weak lead glute / hip abductor", laterality: "LEAD", sfmaTests: ["SLS L", "SLS R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Poor single-leg stability on lead leg", laterality: "LEAD", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
      { description: "Core instability allowing excessive lateral shift", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "straightening_trail_leg",
    mobilityDysfunctions: [
      { description: "Limited trail hip internal rotation", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited trail hip flexion", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Flexion"], type: "MD" },
      { description: "Limited trail ankle dorsiflexion", laterality: "TRAIL", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor trail-side glute/hamstring co-contraction", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Extension", "SLS L", "SLS R"], type: "SMCD" },
      { description: "Inability to load trail hip in flexion", laterality: "TRAIL", sfmaTests: ["Deep Squat", "Multi-Segmental Flexion"], type: "SMCD" },
    ],
  },
  {
    faultId: "fat_divots",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited wrist extension", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor sequencing / early casting pattern", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Core instability causing compensatory arm path", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "over_the_top",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited trail hip internal rotation", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited shoulder external rotation (trail arm)", laterality: "TRAIL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor lower body sequencing in downswing", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Core instability preventing proper sequencing", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Lat/posterior shoulder motor control deficit", laterality: "TRAIL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "SMCD" },
    ],
  },
  {
    faultId: "casting",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited trail shoulder external rotation", laterality: "TRAIL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited wrist mobility", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor timing / sequencing of the downswing", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Forearm/wrist motor control deficit", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
    ],
  },
  {
    faultId: "chicken_winging",
    mobilityDysfunctions: [
      { description: "Limited lead shoulder internal rotation", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "MD" },
      { description: "Limited thoracic rotation toward target", laterality: "LEAD", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor lead arm coordination through impact", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "SMCD" },
      { description: "Core instability preventing proper body rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "steep_swing_plane",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited trail shoulder ER", laterality: "TRAIL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited lat flexibility (trail)", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Upper body dominance over lower body in downswing", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Poor scapular stability", laterality: "TRAIL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
    ],
  },
  {
    faultId: "trail_arm_vertical",
    mobilityDysfunctions: [
      { description: "Limited trail shoulder external rotation", laterality: "TRAIL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited thoracic extension/rotation", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R", "Multi-Segmental Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor scapular stability (trail side)", laterality: "TRAIL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
      { description: "Lat inhibition or motor control deficit", laterality: "TRAIL", sfmaTests: ["Multi-Segmental Extension"], type: "SMCD" },
    ],
  },
  {
    faultId: "rolling_wrists",
    mobilityDysfunctions: [
      { description: "Limited forearm pronation/supination", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited wrist extension", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor grip strength / forearm motor control", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
      { description: "Core instability forcing compensatory wrist action", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "limited_follow_through",
    mobilityDysfunctions: [
      { description: "Limited lead hip internal rotation", laterality: "LEAD", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited thoracic rotation toward target", laterality: "LEAD", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited lead shoulder mobility", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Cervical rotation restriction", laterality: "LEAD", sfmaTests: ["Cervical Rotation L", "Cervical Rotation R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor deceleration strength (lead side)", laterality: "LEAD", sfmaTests: ["SLS L", "SLS R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Core instability limiting full rotation to finish", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "loss_of_posture",
    mobilityDysfunctions: [
      { description: "Limited hinge / hip flexion mobility", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Flexion", "Deep Squat"], type: "MD" },
      { description: "Limited thoracic extension", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
      { description: "Limited ankle dorsiflexion", laterality: "BILATERAL", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor anterior core / anti-extension control during shoulder turn", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Flexion", "Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Glute inhibition limiting stable pelvis", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "SMCD" },
    ],
  },
  {
    faultId: "flat_shoulder_plane",
    mobilityDysfunctions: [
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
      { description: "Limited shoulder elevation / scapular upward rotation", laterality: "BILATERAL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor serratus / lower trapezius timing", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
    ],
  },
  {
    faultId: "flying_elbow",
    mobilityDysfunctions: [
      { description: "Limited trail shoulder external rotation", laterality: "TRAIL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited thoracic rotation", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor trail scapular stability in elevation", laterality: "TRAIL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "SMCD" },
    ],
  },
  {
    faultId: "hiking",
    mobilityDysfunctions: [
      { description: "Limited lateral line / QL mobility", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R", "Multi-Segmental Extension"], type: "MD" },
      { description: "Asymmetric hip or adductor mobility", laterality: "EITHER", sfmaTests: ["Deep Squat", "SLS L", "SLS R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor lateral core / oblique control in downswing", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "SMCD" },
      { description: "Glute medius weakness affecting lateral stability", laterality: "BILATERAL", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "reverse_pivot",
    mobilityDysfunctions: [
      { description: "Limited trail hip internal rotation for load", laterality: "TRAIL", sfmaTests: ["Deep Squat"], type: "MD" },
      { description: "Limited thoracic rotation in backswing", laterality: "TRAIL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor pressure shift / sequencing into trail side", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R", "Multi-Segmental Extension"], type: "SMCD" },
      { description: "Balance or single-leg stability limiting pivot", laterality: "BILATERAL", sfmaTests: ["SLS L", "SLS R"], type: "SMCD" },
    ],
  },
  {
    faultId: "scooping",
    mobilityDysfunctions: [
      { description: "Limited lead wrist extension / forearm mobility", laterality: "LEAD", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Limited thoracic rotation", laterality: "BILATERAL", sfmaTests: ["MS Rotation L", "MS Rotation R"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Early hand release / timing deficit", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R"], type: "SMCD" },
      { description: "Core instability forcing compensatory hand flip", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension", "MS Rotation L", "MS Rotation R"], type: "SMCD" },
    ],
  },
  {
    faultId: "c_posture",
    mobilityDysfunctions: [
      { description: "Thoracic kyphosis / limited thoracic extension", laterality: "BILATERAL", sfmaTests: ["Multi-Segmental Extension"], type: "MD" },
      { description: "Tight pectorals limiting shoulder retraction", laterality: "BILATERAL", sfmaTests: ["UE Pattern 2 L", "UE Pattern 2 R"], type: "MD" },
      { description: "Cervical extension restriction", laterality: "BILATERAL", sfmaTests: ["Cervical Extension"], type: "MD" },
    ],
    smcdDysfunctions: [
      { description: "Poor scapular retraction / lower trapezius activation", laterality: "BILATERAL", sfmaTests: ["UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R"], type: "SMCD" },
      { description: "Poor deep cervical flexor control", laterality: "BILATERAL", sfmaTests: ["Cervical Flexion", "Cervical Extension"], type: "SMCD" },
    ],
  },
];
