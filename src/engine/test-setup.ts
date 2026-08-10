/**
 * Client position + clinician cues for SFMA tests.
 * Lookup is exact first, then pattern / family fallbacks.
 */

export interface TestSetup {
  position: string;
  instructions: string;
}

const EXACT: Record<string, TestSetup> = {
  "Cervical Flexion": {
    position: "Standing, feet together",
    instructions:
      "Ask client to tuck chin and bring chin toward chest. Watch for uniform cervical curve, effort, and pain.",
  },
  "Cervical Extension": {
    position: "Standing, feet together",
    instructions:
      "Ask client to look up toward ceiling so face approaches parallel to floor. Note effort, hinge point, and pain.",
  },
  "Cervical Rotation L": {
    position: "Standing, feet together",
    instructions:
      "Rotate head LEFT so chin/nose approaches mid-clavicle (~80°). Compare quality, ROM, and pain to the right.",
  },
  "Cervical Rotation R": {
    position: "Standing, feet together",
    instructions:
      "Rotate head RIGHT so chin/nose approaches mid-clavicle (~80°). Compare quality, ROM, and pain to the left.",
  },
  "UE Pattern 1 L": {
    position: "Standing",
    instructions:
      "Pattern #1 (MRE): reach LEFT hand behind back toward inferior angle of scapula. Note reach, effort, and pain.",
  },
  "UE Pattern 1 R": {
    position: "Standing",
    instructions:
      "Pattern #1 (MRE): reach RIGHT hand behind back toward inferior angle of scapula. Note reach, effort, and pain.",
  },
  "UE Pattern 2 L": {
    position: "Standing",
    instructions:
      "Pattern #2 (LRF): reach LEFT hand over shoulder toward spine of scapula. Note reach, effort, and pain.",
  },
  "UE Pattern 2 R": {
    position: "Standing",
    instructions:
      "Pattern #2 (LRF): reach RIGHT hand over shoulder toward spine of scapula. Note reach, effort, and pain.",
  },
  "Multi-Segmental Flexion": {
    position: "Standing, feet together, toes forward",
    instructions:
      "Bend forward to touch toes with knees straight. Note sacral angle (~70°), spinal curve, weight shift, and pain.",
  },
  "Multi-Segmental Extension": {
    position: "Standing, feet together, arms overhead",
    instructions:
      "Reach arms up/back and extend spine. ASIS should clear toes; scapular spine clear heels; UE ~170°. Note curve and pain.",
  },
  "MS Rotation L": {
    position: "Standing, feet together",
    instructions:
      "Rotate trunk LEFT — pelvis and shoulders each ~50°. Note spinal–pelvic deviation, knee bend, effort, and pain.",
  },
  "MS Rotation R": {
    position: "Standing, feet together",
    instructions:
      "Rotate trunk RIGHT — pelvis and shoulders each ~50°. Note spinal–pelvic deviation, knee bend, effort, and pain.",
  },
  "SLS L": {
    position: "Standing on LEFT leg",
    instructions:
      "Single-leg stance LEFT, eyes open then closed (~10 s each). Note height loss, sway, effort, and pain.",
  },
  "SLS R": {
    position: "Standing on RIGHT leg",
    instructions:
      "Single-leg stance RIGHT, eyes open then closed (~10 s each). Note height loss, sway, effort, and pain.",
  },
  "Deep Squat": {
    position: "Standing, feet shoulder-width, arms overhead",
    instructions:
      "Descend into deep squat keeping arms up and heels down. Thighs to/below parallel; tibia/torso parallel or better.",
  },

  "Long Sitting Flexion": {
    position: "Long sitting, legs extended",
    instructions:
      "Reach toward toes with knees extended. Compare to standing MSF; differentiates weight-bearing hip flexion SMCD.",
  },
  "Prone Press-Up": {
    position: "Prone, hands under shoulders",
    instructions:
      "Press chest up into extension (cobra). Compare spinal extension availability unloaded vs standing MSE.",
  },
  "Prone Rocking": {
    position: "Quadruped / child’s pose rock",
    instructions:
      "Rock pelvis toward heels with spine flexing. Isolates spine flexion mobility from hip contribution.",
  },
  "Seated Torso Rotation L": {
    position: "Seated, feet supported, arms crossed",
    instructions:
      "Rotate trunk LEFT without lifting pelvis. Clears seated torso contribution before lumbar-locked breakouts.",
  },
  "Seated Torso Rotation R": {
    position: "Seated, feet supported, arms crossed",
    instructions:
      "Rotate trunk RIGHT without lifting pelvis. Clears seated torso contribution before lumbar-locked breakouts.",
  },
  "Modified Thomas Test L": {
    position: "Supine at table edge, LEFT thigh off edge",
    instructions:
      "Hold RIGHT knee to chest; allow LEFT thigh to hang. Assess hip extension (and related structures) on LEFT.",
  },
  "Modified Thomas Test R": {
    position: "Supine at table edge, RIGHT thigh off edge",
    instructions:
      "Hold LEFT knee to chest; allow RIGHT thigh to hang. Assess hip extension (and related structures) on RIGHT.",
  },
  "FABER Test L": {
    position: "Supine, LEFT ankle on RIGHT thigh (figure-4)",
    instructions:
      "Lower LEFT knee toward table. Note ROM and pain; stabilize pelvis if needed for follow-up.",
  },
  "FABER Test R": {
    position: "Supine, RIGHT ankle on LEFT thigh (figure-4)",
    instructions:
      "Lower RIGHT knee toward table. Note ROM and pain; stabilize pelvis if needed for follow-up.",
  },
  "Stabilized FABER Test L": {
    position: "Supine figure-4 LEFT, pelvis stabilized",
    instructions:
      "Repeat FABER with pelvis fixed. FN with prior fail suggests core/pelvic orientation SMCD; DN suggests hip/SI MD.",
  },
  "Stabilized FABER Test R": {
    position: "Supine figure-4 RIGHT, pelvis stabilized",
    instructions:
      "Repeat FABER with pelvis fixed. FN with prior fail suggests core/pelvic orientation SMCD; DN suggests hip/SI MD.",
  },
  "Supine Knees to Chest (Shins)": {
    position: "Supine, both knees flexed",
    instructions:
      "Pull knees to chest holding shins. Clears knee-flexion strategy before deeper hip flexion testing.",
  },
  "Supine Knees to Chest (Thighs)": {
    position: "Supine, both knees flexed",
    instructions:
      "Pull knees to chest holding thighs. Differentiates hip flexion MD vs residual knee flexion limitation.",
  },
  "Vestibular Test - CTSIB (Static)": {
    position: "Standing, feet together",
    instructions:
      "Static balance with progressive sensory challenge (firm/foam, eyes open/closed per clinic CTSIB protocol).",
  },
  "CTSIB (Dynamic)": {
    position: "Standing",
    instructions:
      "Dynamic balance / head-turn or perturbation challenge per clinic CTSIB dynamic protocol.",
  },
};

type FamilyRule = { match: RegExp; setup: TestSetup };

const FAMILIES: FamilyRule[] = [
  {
    match: /Active Supine Cervical Flexion|Passive Supine Cervical Flexion|OA Cervical Flexion/i,
    setup: {
      position: "Supine, head supported",
      instructions:
        "Client supine. Cue chin-to-chest (active) or guide passively; OA nod isolates upper cervical flexion (~20°).",
    },
  },
  {
    match: /Supine Cervical Extension/i,
    setup: {
      position: "Supine / supported extension",
      instructions:
        "Assess cervical extension with torso approaching ~10° of parallel; compare to standing extension findings.",
    },
  },
  {
    match: /Cervical Rotation Test|C1-C2 Cervical Rotation/i,
    setup: {
      position: "Supine",
      instructions:
        "Rotate toward the tested side (~80° active/passive). Flexion–rotation (C1–C2) isolates upper cervical rotation.",
    },
  },
  {
    match: /Lumbar Locked/i,
    setup: {
      position: "Side-lying / lumbar-locked (IR) setup",
      instructions:
        "Lock lumbar spine in IR; assess thorax extension/rotation (~50°) active then passive on the tested side.",
    },
  },
  {
    match: /Prone on Elbow|Prone UE Pattern|Prone Shoulder|Prone Elbow/i,
    setup: {
      position: "Prone (forearms / prone shoulder setup)",
      instructions:
        "Client prone. Keep both sides in this position when possible — complete L and R actives before passives.",
    },
  },
  {
    match: /Prone Hip Extension|Prone Hip (ER|IR)|Prone External Hip|Prone Internal Hip/i,
    setup: {
      position: "Prone",
      instructions:
        "Client prone. Test hip extension or rotation as named; stabilize pelvis when indicated for SMCD vs MD.",
    },
  },
  {
    match: /Active SLR|Stabilized ASLR|Passive SLR|Knee to Chest/i,
    setup: {
      position: "Supine",
      instructions:
        "Straight leg raise (active → stabilized → passive → knee-to-chest as branched). Batch L/R actives when both needed.",
    },
  },
  {
    match: /Half-Kneeling Narrow Base/i,
    setup: {
      position: "Half-kneeling, narrow base",
      instructions:
        "Half-kneel with narrow base of support on the named side. Note control before progressing to quadruped/ankle tests.",
    },
  },
  {
    match: /Quadruped Diagonals/i,
    setup: {
      position: "Quadruped",
      instructions:
        "Opposite arm/leg reach (bird-dog diagonal) on the named side. Differentiates WB spine/core vs hip/core SMCD.",
    },
  },
  {
    match: /Tandem Dorsiflexion|Prone Dorsiflexion|Plantarflexion|Ankle Inversion|Ankle Eversion/i,
    setup: {
      position: "Standing tandem → seated / prone for passives",
      instructions:
        "Active ankle tests in standing/seated first for both sides, then move to passive prone/seated as branched.",
    },
  },
  {
    match: /Seated Tibial|Seated Hip IR|Seated Hip ER|Seated Ankle/i,
    setup: {
      position: "Seated, hips/knees ~90°",
      instructions:
        "Seated isolation. Complete both sides actively before changing to prone passives when the tree batches that way.",
    },
  },
  {
    match: /Shoulder Girdle Flexion|Shoulder Flexion/i,
    setup: {
      position: "Prone or supine per test name",
      instructions:
        "Elevate/flex the shoulder on the named side; compare active to passive for SMCD vs MD.",
    },
  },
];

export function getTestSetup(testName: string): TestSetup | undefined {
  if (EXACT[testName]) return EXACT[testName];
  for (const rule of FAMILIES) {
    if (rule.match.test(testName)) return rule.setup;
  }
  return {
    position: "Per SFMA flowchart",
    instructions:
      "Position the client as required for this breakout test. Score FN / DN / DP / FP using the criteria below.",
  };
}
