/**
 * Expected movement criteria aligned with SFMA flowcharts (incl. degree benchmarks).
 * Top-tier rows mirror the SFMA top-tier checklist; breakout tests use breakout chart callouts.
 */
export const SFMA_TEST_CRITERIA: Record<string, string> = {
  "Cervical Flexion":
    "Painful; or cannot touch sternum to chin; or non-uniform spinal curve; or excessive effort / motor control deficit.",
  "Cervical Extension":
    "Painful; or torso not within ~10° of parallel to floor; or excessive effort / motor control deficit.",
  "Cervical Rotation L":
    "Painful left; or chin/nose not toward mid-clavicle (~80° rotation benchmark for supine active test); or excessive effort, asymmetry, or motor control deficit.",
  "Cervical Rotation R":
    "Painful right; or chin/nose not toward mid-clavicle (~80° rotation benchmark for supine active test); or excessive effort, asymmetry, or motor control deficit.",
  "UE Pattern 1 L":
    "Pattern #1 (MRE): painful left; or does not reach inferior angle of scapula; or excessive effort / asymmetry / motor control deficit.",
  "UE Pattern 1 R":
    "Pattern #1 (MRE): painful right; or does not reach inferior angle of scapula; or excessive effort / asymmetry / motor control deficit.",
  "UE Pattern 2 L":
    "Pattern #2 (LRF): painful left; or does not reach spine of scapula; or excessive effort / asymmetry / motor control deficit.",
  "UE Pattern 2 R":
    "Pattern #2 (LRF): painful right; or does not reach spine of scapula; or excessive effort / asymmetry / motor control deficit.",
  "Multi-Segmental Flexion":
    "Painful; or cannot touch toes; or sacral angle <70°; or non-uniform spinal curve; or lack of posterior weight shift; or excessive effort / asymmetry / motor control deficit.",
  "Multi-Segmental Extension":
    "Painful; or UE does not achieve/maintain ~170°; or ASIS not clear of toes; or scapular spine not clear of heels; or non-uniform spinal curve; or excessive effort / motor control deficit.",
  "MS Rotation L":
    "Painful left; or pelvis rotation <~50°; or shoulder rotation <~50°; or spine–pelvic deviation; or excessive knee flexion; or excessive effort / motor control deficit.",
  "MS Rotation R":
    "Painful right; or pelvis rotation <~50°; or shoulder rotation <~50°; or spine–pelvic deviation; or excessive knee flexion; or excessive effort / motor control deficit.",
  "SLS L":
    "Painful left; or eyes open <10 s; or eyes closed <10 s; or loss of height; or excessive effort / asymmetry / motor control deficit.",
  "SLS R":
    "Painful right; or eyes open <10 s; or eyes closed <10 s; or loss of height; or excessive effort / asymmetry / motor control deficit.",
  "Deep Squat":
    "Painful; or loss of UE start position; or tibia/torso not parallel or better; or thighs not to/below parallel; or loss of sagittal plane alignment; or excessive effort / weight shift / motor control deficit.",

  "Active Supine Cervical Flexion Test (Chin to Chest)":
    "Chin to chest; uniform cervical flexion; minimal excess effort (flowchart: FN clears without passive/segmental follow-up).",
  "Passive Supine Cervical Flexion Test":
    "Full available passive flexion; compare to active for SMCD vs MD classification.",
  "Active Supine OA Cervical Flexion Test (Nod)":
    "Occipito–atlantal nod ~20° benchmark (flowchart callout); compare segmental vs lower cervical findings.",
  "Supine Cervical Extension":
    "Torso ~within 10° of parallel; pain-free, controlled extension.",
  "Active Supine Cervical Rotation Test":
    "Active supine rotation ~80° benchmark toward each side (flowchart); nose/chin toward mid-clavicle.",
  "Passive Supine Cervical Rotation Test":
    "Passive rotation benchmark ~80°; compare to active rotation.",
  "C1-C2 Cervical Rotation Test (Flexion-Rotation)":
    "Flexion–rotation isolation for upper cervical rotation; compare to multi-segment findings.",
  "Active Supine Cervical Rotation Test L":
    "Active supine rotation LEFT ~80° benchmark; nose/chin toward left mid-clavicle.",
  "Passive Supine Cervical Rotation Test L":
    "Passive rotation LEFT ~80°; compare to active left rotation.",
  "C1-C2 Cervical Rotation Test (Flexion-Rotation) L":
    "Flexion–rotation isolation for LEFT upper cervical rotation; compare to multi-segment findings.",
  "Active Supine Cervical Rotation Test R":
    "Active supine rotation RIGHT ~80° benchmark; nose/chin toward right mid-clavicle.",
  "Passive Supine Cervical Rotation Test R":
    "Passive rotation RIGHT ~80°; compare to active right rotation.",
  "C1-C2 Cervical Rotation Test (Flexion-Rotation) R":
    "Flexion–rotation isolation for RIGHT upper cervical rotation; compare to multi-segment findings.",

  "Active Lumbar Locked (IR) Ext/Rot L":
    "Lumbar locked (IR) active extension/rotation ~50° thorax benchmark (flowchart: ‘Lumbar Locked (IR) – Active Extension/Rotation (50°)’).",
  "Passive Lumbar Locked Ext/Rot L":
    "Passive lumbar locked IR extension/rotation ~50°; differentiate thorax vs lumbar drivers.",
  "Active Lumbar Locked (IR) Ext/Rot R":
    "Lumbar locked (IR) active extension/rotation ~50° thorax benchmark (right side).",
  "Passive Lumbar Locked Ext/Rot R":
    "Passive lumbar locked IR extension/rotation ~50° (right side).",

  "Active Prone UE Pattern 1 L":
    "Reach/rotate pattern #1 (MRE/IR line); compare to passive for shoulder vs postural drivers.",
  "Passive Prone UE Pattern 1 L":
    "Passive pattern #1; clearing passive with failed active → SMCD / postural classification per flowchart.",
  "Active Prone UE Pattern 1 R": "Same as left; right side pattern #1 (MRE).",
  "Passive Prone UE Pattern 1 R": "Passive pattern #1 (right).",

  "Active Prone Shoulder 90/90 IR L":
    "Prone 90/90 IR ~60° and/or total arc ~150° (flowchart callout).",
  "Passive Prone Shoulder IR L": "Passive IR ~60° benchmark; pain vs loss of motion.",
  "Active Prone Shoulder Extension L": "Prone shoulder extension ~50° benchmark.",
  "Passive Prone Shoulder Extension L": "Passive shoulder extension ~50°.",
  "Active Prone Elbow Flexion L": "Elbow flexion — hand toward / touches shoulder (flowchart: ‘touches’).",
  "Passive Prone Elbow Flexion L": "Passive elbow flexion end-range; pain vs mechanical loss.",

  "Active Prone Shoulder 90/90 IR R": "Prone 90/90 IR ~60° / arc ~150° (right).",
  "Passive Prone Shoulder IR R": "Passive IR (right).",
  "Active Prone Shoulder Extension R": "Prone shoulder extension ~50° (right).",
  "Passive Prone Shoulder Extension R": "Passive shoulder extension ~50° (right).",
  "Active Prone Elbow Flexion R": "Elbow flexion — touches (right).",
  "Passive Prone Elbow Flexion R": "Passive elbow flexion (right).",

  "Active Prone UE Pattern 2 L": "Pattern #2 (LRF/ER line); active prone reach.",
  "Passive Prone UE Pattern 2 L": "Passive pattern #2 (left).",
  "Active Prone UE Pattern 2 R": "Pattern #2 active (right).",
  "Passive Prone UE Pattern 2 R": "Passive pattern #2 (right).",

  "Active Prone Shoulder 90/90 ER L":
    "Prone 90/90 ER ~90° and/or total arc ~150° (flowchart callout).",
  "Passive Prone Shoulder ER L": "Passive ER ~90° / arc criteria.",
  "Active Prone Shoulder Flexion/Abduction L":
    "Combined flexion/abduction ~170° benchmark.",
  "Passive Prone Shoulder Flexion/Abduction L": "Passive flex/abd ~170°.",
  "Active Prone Shoulder 90/90 ER R": "Prone 90/90 ER ~90° / arc ~150° (right).",
  "Passive Prone Shoulder ER R": "Passive ER (right).",
  "Active Prone Shoulder Flexion/Abduction R": "Flex/abduction ~170° (right).",
  "Passive Prone Shoulder Flexion/Abduction R": "Passive flex/abd ~170° (right).",

  "Long Sitting Flexion":
    "Long-sitting flexion; sacral angle ~80°+ (FN) vs <70° dysfunctional per flexion breakout chart.",
  "Active SLR L": "Active straight leg raise; hip flexion without lumbar compensation.",
  "Stabilized ASLR L": "ASLR with pelvis stabilized; core vs hip flexion drivers.",
  "Passive SLR L": "Passive SLR; posterior chain vs hip mobility.",
  "Supine Knee to Chest L (Thighs)": "Hip/knee flexion end-range; thigh vs shin line tests.",
  "Active SLR R": "Active SLR (right).",
  "Stabilized ASLR R": "Stabilized ASLR (right).",
  "Passive SLR R": "Passive SLR (right).",
  "Supine Knee to Chest R (Thighs)": "Knee-to-chest (right).",
  "Prone Rocking": "Prone rocking for spinal flexion pattern; uniform vs segmental loss.",

  "Prone Press-Up":
    "Extension breakout entry; pain/height criteria per chart (>1 Airex pad context in manual).",
  "Active Prone on Elbow Ext/Rot L":
    "Prone on elbow unilateral extension/rotation ~30° benchmark.",
  "Passive Prone on Elbow Ext/Rot L": "Passive prone-on-elbow uni rotation ~30°.",
  "Active Prone on Elbow Ext/Rot R": "Prone on elbow uni ext/rot ~30° (right).",
  "Passive Prone on Elbow Ext/Rot R": "Passive prone-on-elbow ~30° (right).",
  "Active Prone Shoulder Girdle Flexion L": "Unilateral shoulder girdle flexion/extension pattern (UB extension sub-chart).",
  "Passive Prone Shoulder Flexion L": "Passive shoulder flexion clearing.",
  "Active Prone Shoulder Girdle Flexion R": "Shoulder girdle flexion (right).",
  "Passive Prone Shoulder Flexion R": "Passive shoulder flexion (right).",

  "FABER Test L": "FABER / hip–SI screening (left).",
  "Stabilized FABER Test L": "Stabilized FABER to separate core vs hip–SI drivers.",
  "FABER Test R": "FABER (right).",
  "Stabilized FABER Test R": "Stabilized FABER (right).",
  "Modified Thomas Test L": "Thomas / hip extension alignment (left).",
  "Modified Thomas Test R": "Thomas test (right).",
  "Active Prone Hip Extension L":
    "Prone active hip extension ~10° benchmark vs femoral height (flowchart).",
  "Passive Prone Hip Extension L": "Passive hip extension ~10° / hip height criterion.",
  "Active Prone Hip Extension R": "Prone active hip extension ~10° (right).",
  "Passive Prone Hip Extension R": "Passive hip extension (right).",

  "Seated Torso Rotation L":
    "Seated rotation ~50° pelvis and ~50° shoulders benchmark; compare sides.",
  "Seated Torso Rotation R": "Seated rotation benchmarks (right lead).",

  "Active Prone Hip ER L": "Prone active hip ER ~40° benchmark.",
  "Stabilized Prone External Hip Rotation L": "Stabilized prone hip ER for pelvic control.",
  "Passive Prone Hip ER L": "Passive prone hip ER ~40°.",
  "Active Prone Hip ER R": "Prone hip ER (right).",
  "Stabilized Prone External Hip Rotation R": "Stabilized prone ER (right).",
  "Passive Prone Hip ER R": "Passive hip ER ~40° (right).",
  "Active Seated Tibial ER L": "Seated active tibial ER ~20°.",
  "Passive Prone Tibial ER L": "Passive / prone tibial external rotation benchmarks.",
  "Active Seated Tibial ER R": "Seated tibial ER ~20° (right).",
  "Passive Prone Tibial ER R": "Passive tibial ER (right).",

  "Active Prone Hip IR L": "Prone active hip IR ~30° benchmark.",
  "Stabilized Prone Internal Hip Rotation L": "Stabilized prone IR.",
  "Passive Prone Hip IR L": "Passive prone hip IR ~30°.",
  "Active Prone Hip IR R": "Hip IR (right).",
  "Stabilized Prone Internal Hip Rotation R": "Stabilized IR (right).",
  "Passive Prone Hip IR R": "Passive IR (right).",
  "Active Seated Tibial IR L": "Seated active tibial IR ~20°.",
  "Passive Prone Tibial IR L": "Passive tibial IR.",
  "Active Seated Tibial IR R": "Seated tibial IR (right).",
  "Passive Prone Tibial IR R": "Passive tibial IR (right).",

  "Vestibular Test - CTSIB (Static)": "CTSIB static conditions; balance / vestibular screening.",
  "CTSIB (Dynamic)": "CTSIB dynamic head movement conditions.",
  "Half-Kneeling Narrow Base L": "Half-kneeling narrow base balance (left lead).",
  "Half-Kneeling Narrow Base R": "Half-kneeling narrow base (right lead).",
  "Quadruped Diagonals L": "Quadruped diagonal reach/stability (left).",
  "Quadruped Diagonals R": "Quadruped diagonals (right).",

  "Active Tandem Dorsiflexion L": "Tandem stance active dorsiflexion (knee extended context).",
  "Passive Prone Dorsiflexion L (Knee Ext)": "Passive prone DF with knee extended.",
  "Active Tandem Dorsiflexion R": "Active tandem DF (right).",
  "Passive Prone Dorsiflexion R (Knee Ext)": "Passive prone DF (right).",
  "Active Tandem Plantarflexion L": "Tandem plantarflexion screening.",
  "Passive Plantarflexion L": "Passive plantarflexion ROM.",
  "Active Tandem Plantarflexion R": "Tandem plantarflexion (right).",
  "Passive Plantarflexion R": "Passive PF (right).",
  "Active Seated Ankle Inversion L": "Seated inversion active.",
  "Passive Ankle Inversion L": "Passive inversion.",
  "Active Seated Ankle Inversion R": "Inversion (right).",
  "Passive Ankle Inversion R": "Passive inversion (right).",
  "Active Seated Ankle Eversion L": "Seated eversion active.",
  "Passive Ankle Eversion L": "Passive eversion.",
  "Active Seated Ankle Eversion R": "Eversion (right).",
  "Passive Ankle Eversion R": "Passive eversion (right).",

  "Active Tandem Dorsiflexion - Knee Flexed L":
    "Deep-squat sub-chart: tandem DF with knee flexed (ankle strategy for squat).",
  "Passive Prone Dorsiflexion - Knee Flexed L":
    "Passive prone DF, knee flexed; squat-related ankle mobility.",
  "Active Tandem Dorsiflexion - Knee Flexed R": "Tandem DF knee flexed (right).",
  "Passive Prone Dorsiflexion - Knee Flexed R": "Passive DF knee flexed (right).",
  "Active Seated Ankle Inversion/Eversion L": "Combined inversion/eversion (squat ankle).",
  "Passive Ankle Inversion/Eversion L": "Passive inv/ev (left).",
  "Active Seated Ankle Inversion/Eversion R": "Inv/ev active (right).",
  "Passive Ankle Inversion/Eversion R": "Passive inv/ev (right).",
  "Supine Knees to Chest (Shins)": "Knees to chest holding shins (ankle strategy vs hip flexion).",
  "Supine Knees to Chest (Thighs)": "Thigh-supported knee-to-chest line for hip vs knee flexion.",

  "Active Seated Hip IR L": "Seated hip IR ~30° context (squat hip isolation).",
  "Passive Seated Hip IR L": "Passive seated hip IR.",
  "Active Seated Hip IR R": "Hip IR active (right).",
  "Passive Seated Hip IR R": "Passive hip IR (right).",
  "Active Seated Hip ER L": "Seated hip ER ~40° context.",
  "Passive Seated Hip ER L": "Passive hip ER.",
  "Active Seated Hip ER R": "Hip ER active (right).",
  "Passive Seated Hip ER R": "Passive hip ER (right).",
};

export function getTestCriteria(testName: string): string | undefined {
  return SFMA_TEST_CRITERIA[testName];
}
