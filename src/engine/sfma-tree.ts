import type { BreakoutChain } from "@/lib/types";

export const SFMA_LOGIC: Record<string, BreakoutChain> = {
  "Cervical Flexion": {
    start: "Active Supine Cervical Flexion Test (Chin to Chest)",
    nodes: {
      "Active Supine Cervical Flexion Test (Chin to Chest)": { "FN": { diag: "Postural SMCD affecting cervical flexion.", next: "EXIT" }, "any": { next: "Passive Supine Cervical Flexion Test" } },
      "Passive Supine Cervical Flexion Test": { "FN": { diag: "Active cervical spine flexion SMCD.", next: "EXIT" }, "any": { next: "Active Supine OA Cervical Flexion Test (Nod)" } },
      "Active Supine OA Cervical Flexion Test (Nod)": { "FN": { diag: "Mid-to-lower cervical spine MD.", next: "EXIT" }, "DN": { diag: "OA/Upper cervical flexion MD.", next: "EXIT" }, "any": { diag: "OA/Upper cervical flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "Cervical Extension": {
    start: "Supine Cervical Extension",
    nodes: {
      "Supine Cervical Extension": { "FN": { diag: "Postural and/or active cervical extension SMCD.", next: "EXIT" }, "DN": { diag: "Cervical spine extension MD.", next: "EXIT" }, "any": { diag: "Cervical spine extension pain/dysfunction.", next: "EXIT" } },
    },
  },
  "Cervical Rotation L": {
    start: "Active Supine Cervical Rotation Test L",
    nodes: {
      "Active Supine Cervical Rotation Test L": { "FN": { diag: "Left postural and/or active cervical rotation SMCD.", next: "EXIT" }, "any": { next: "Passive Supine Cervical Rotation Test L" } },
      "Passive Supine Cervical Rotation Test L": { "FN": { diag: "Left active cervical spine rotation SMCD.", next: "EXIT" }, "any": { next: "C1-C2 Cervical Rotation Test (Flexion-Rotation) L" } },
      "C1-C2 Cervical Rotation Test (Flexion-Rotation) L": { "FN": { diag: "Left complex: Mid-lower cervical spine SMCD/MD.", next: "EXIT" }, "DN": { diag: "Left C1-C2 (Upper Cervical) rotation MD.", next: "EXIT" }, "any": { diag: "Left C1-C2 (Upper Cervical) rotation pain/dysfunction.", next: "EXIT" } },
    },
  },
  "Cervical Rotation R": {
    start: "Active Supine Cervical Rotation Test R",
    nodes: {
      "Active Supine Cervical Rotation Test R": { "FN": { diag: "Right postural and/or active cervical rotation SMCD.", next: "EXIT" }, "any": { next: "Passive Supine Cervical Rotation Test R" } },
      "Passive Supine Cervical Rotation Test R": { "FN": { diag: "Right active cervical spine rotation SMCD.", next: "EXIT" }, "any": { next: "C1-C2 Cervical Rotation Test (Flexion-Rotation) R" } },
      "C1-C2 Cervical Rotation Test (Flexion-Rotation) R": { "FN": { diag: "Right complex: Mid-lower cervical spine SMCD/MD.", next: "EXIT" }, "DN": { diag: "Right C1-C2 (Upper Cervical) rotation MD.", next: "EXIT" }, "any": { diag: "Right C1-C2 (Upper Cervical) rotation pain/dysfunction.", next: "EXIT" } },
    },
  },
  "UE Pattern 1 L": {
    start: "Active Lumbar Locked (IR) Ext/Rot L",
    nodes: {
      "Active Lumbar Locked (IR) Ext/Rot L": { "FN": { next: "Active Prone UE Pattern 1 L" }, "any": { next: "Passive Lumbar Locked Ext/Rot L" } },
      "Passive Lumbar Locked Ext/Rot L": { "FN": { diag: "Left Thorax ext/rot SMCD.", next: "Active Prone UE Pattern 1 L" }, "DN": { diag: "Left Thorax ext/rot MD.", next: "Active Prone UE Pattern 1 L" }, "any": { diag: "Left Thorax pain.", next: "Active Prone UE Pattern 1 L" } },
      "Active Prone UE Pattern 1 L": { "FN": { diag: "Left Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Passive Prone UE Pattern 1 L" } },
      "Passive Prone UE Pattern 1 L": { "FN": { diag: "Left Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Active Prone Shoulder 90/90 IR L" } },
      "Active Prone Shoulder 90/90 IR L": { "FN": { next: "Active Prone Shoulder Extension L" }, "any": { next: "Passive Prone Shoulder IR L" } },
      "Passive Prone Shoulder IR L": { "FN": { diag: "Left Shoulder IR SMCD.", next: "Active Prone Shoulder Extension L" }, "DN": { diag: "Left Shoulder IR MD.", next: "Active Prone Shoulder Extension L" }, "any": { next: "Active Prone Shoulder Extension L" } },
      "Active Prone Shoulder Extension L": { "FN": { next: "Active Prone Elbow Flexion L" }, "any": { next: "Passive Prone Shoulder Extension L" } },
      "Passive Prone Shoulder Extension L": { "FN": { diag: "Left Shoulder extension SMCD.", next: "Active Prone Elbow Flexion L" }, "DN": { diag: "Left Shoulder extension MD.", next: "Active Prone Elbow Flexion L" }, "any": { next: "Active Prone Elbow Flexion L" } },
      "Active Prone Elbow Flexion L": { "FN": { diag: "Left Elbow Flexion Normal.", next: "EXIT" }, "any": { next: "Passive Prone Elbow Flexion L" } },
      "Passive Prone Elbow Flexion L": { "FN": { diag: "Left Elbow flexion SMCD.", next: "EXIT" }, "DN": { diag: "Left Elbow flexion MD.", next: "EXIT" }, "any": { diag: "Left Elbow flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "UE Pattern 1 R": {
    start: "Active Lumbar Locked (IR) Ext/Rot R",
    nodes: {
      "Active Lumbar Locked (IR) Ext/Rot R": { "FN": { next: "Active Prone UE Pattern 1 R" }, "any": { next: "Passive Lumbar Locked Ext/Rot R" } },
      "Passive Lumbar Locked Ext/Rot R": { "FN": { diag: "Right Thorax ext/rot SMCD.", next: "Active Prone UE Pattern 1 R" }, "DN": { diag: "Right Thorax ext/rot MD.", next: "Active Prone UE Pattern 1 R" }, "any": { diag: "Right Thorax pain.", next: "Active Prone UE Pattern 1 R" } },
      "Active Prone UE Pattern 1 R": { "FN": { diag: "Right Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Passive Prone UE Pattern 1 R" } },
      "Passive Prone UE Pattern 1 R": { "FN": { diag: "Right Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Active Prone Shoulder 90/90 IR R" } },
      "Active Prone Shoulder 90/90 IR R": { "FN": { next: "Active Prone Shoulder Extension R" }, "any": { next: "Passive Prone Shoulder IR R" } },
      "Passive Prone Shoulder IR R": { "FN": { diag: "Right Shoulder IR SMCD.", next: "Active Prone Shoulder Extension R" }, "DN": { diag: "Right Shoulder IR MD.", next: "Active Prone Shoulder Extension R" }, "any": { next: "Active Prone Shoulder Extension R" } },
      "Active Prone Shoulder Extension R": { "FN": { next: "Active Prone Elbow Flexion R" }, "any": { next: "Passive Prone Shoulder Extension R" } },
      "Passive Prone Shoulder Extension R": { "FN": { diag: "Right Shoulder extension SMCD.", next: "Active Prone Elbow Flexion R" }, "DN": { diag: "Right Shoulder extension MD.", next: "Active Prone Elbow Flexion R" }, "any": { next: "Active Prone Elbow Flexion R" } },
      "Active Prone Elbow Flexion R": { "FN": { diag: "Right Elbow Flexion Normal.", next: "EXIT" }, "any": { next: "Passive Prone Elbow Flexion R" } },
      "Passive Prone Elbow Flexion R": { "FN": { diag: "Right Elbow flexion SMCD.", next: "EXIT" }, "DN": { diag: "Right Elbow flexion MD.", next: "EXIT" }, "any": { diag: "Right Elbow flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "UE Pattern 2 L": {
    start: "Active Lumbar Locked (IR) Ext/Rot L",
    nodes: {
      "Active Lumbar Locked (IR) Ext/Rot L": { "FN": { next: "Active Prone UE Pattern 2 L" }, "any": { next: "Passive Lumbar Locked Ext/Rot L" } },
      "Passive Lumbar Locked Ext/Rot L": { "FN": { diag: "Left Thorax ext/rot SMCD.", next: "Active Prone UE Pattern 2 L" }, "DN": { diag: "Left Thorax ext/rot MD.", next: "Active Prone UE Pattern 2 L" }, "any": { next: "Active Prone UE Pattern 2 L" } },
      "Active Prone UE Pattern 2 L": { "FN": { diag: "Left Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Passive Prone UE Pattern 2 L" } },
      "Passive Prone UE Pattern 2 L": { "FN": { diag: "Left Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Active Prone Shoulder 90/90 ER L" } },
      "Active Prone Shoulder 90/90 ER L": { "FN": { next: "Active Prone Shoulder Flexion/Abduction L" }, "any": { next: "Passive Prone Shoulder ER L" } },
      "Passive Prone Shoulder ER L": { "FN": { diag: "Left Shoulder ER SMCD.", next: "Active Prone Shoulder Flexion/Abduction L" }, "DN": { diag: "Left Shoulder ER MD.", next: "Active Prone Shoulder Flexion/Abduction L" }, "any": { next: "Active Prone Shoulder Flexion/Abduction L" } },
      "Active Prone Shoulder Flexion/Abduction L": { "FN": { next: "Active Prone Elbow Flexion L" }, "any": { next: "Passive Prone Shoulder Flexion/Abduction L" } },
      "Passive Prone Shoulder Flexion/Abduction L": { "FN": { diag: "Left Shoulder flex/abd SMCD.", next: "Active Prone Elbow Flexion L" }, "DN": { diag: "Left Shoulder flex/abd MD.", next: "Active Prone Elbow Flexion L" }, "any": { next: "Active Prone Elbow Flexion L" } },
      "Active Prone Elbow Flexion L": { "FN": { diag: "Left Elbow Flexion Normal.", next: "EXIT" }, "any": { next: "Passive Prone Elbow Flexion L" } },
      "Passive Prone Elbow Flexion L": { "FN": { diag: "Left Elbow flexion SMCD.", next: "EXIT" }, "DN": { diag: "Left Elbow flexion MD.", next: "EXIT" }, "any": { diag: "Left Elbow flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "UE Pattern 2 R": {
    start: "Active Lumbar Locked (IR) Ext/Rot R",
    nodes: {
      "Active Lumbar Locked (IR) Ext/Rot R": { "FN": { next: "Active Prone UE Pattern 2 R" }, "any": { next: "Passive Lumbar Locked Ext/Rot R" } },
      "Passive Lumbar Locked Ext/Rot R": { "FN": { diag: "Right Thorax ext/rot SMCD.", next: "Active Prone UE Pattern 2 R" }, "DN": { diag: "Right Thorax ext/rot MD.", next: "Active Prone UE Pattern 2 R" }, "any": { next: "Active Prone UE Pattern 2 R" } },
      "Active Prone UE Pattern 2 R": { "FN": { diag: "Right Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Passive Prone UE Pattern 2 R" } },
      "Passive Prone UE Pattern 2 R": { "FN": { diag: "Right Postural/Shoulder SMCD.", next: "EXIT" }, "any": { next: "Active Prone Shoulder 90/90 ER R" } },
      "Active Prone Shoulder 90/90 ER R": { "FN": { next: "Active Prone Shoulder Flexion/Abduction R" }, "any": { next: "Passive Prone Shoulder ER R" } },
      "Passive Prone Shoulder ER R": { "FN": { diag: "Right Shoulder ER SMCD.", next: "Active Prone Shoulder Flexion/Abduction R" }, "DN": { diag: "Right Shoulder ER MD.", next: "Active Prone Shoulder Flexion/Abduction R" }, "any": { next: "Active Prone Shoulder Flexion/Abduction R" } },
      "Active Prone Shoulder Flexion/Abduction R": { "FN": { next: "Active Prone Elbow Flexion R" }, "any": { next: "Passive Prone Shoulder Flexion/Abduction R" } },
      "Passive Prone Shoulder Flexion/Abduction R": { "FN": { diag: "Right Shoulder flex/abd SMCD.", next: "Active Prone Elbow Flexion R" }, "DN": { diag: "Right Shoulder flex/abd MD.", next: "Active Prone Elbow Flexion R" }, "any": { next: "Active Prone Elbow Flexion R" } },
      "Active Prone Elbow Flexion R": { "FN": { diag: "Right Elbow Flexion Normal.", next: "EXIT" }, "any": { next: "Passive Prone Elbow Flexion R" } },
      "Passive Prone Elbow Flexion R": { "FN": { diag: "Right Elbow flexion SMCD.", next: "EXIT" }, "DN": { diag: "Right Elbow flexion MD.", next: "EXIT" }, "any": { diag: "Right Elbow flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "Multi-Segmental Flexion": {
    start: "Long Sitting Flexion",
    nodes: {
      "Long Sitting Flexion": { "FN": { diag: "Weight-bearing hip flexion SMCD.", next: "EXIT" }, "any": { next: "Active SLR L" } },
      // Active SLR L/R first, then Stabilized→Passive→KTC deep-dive per failed side
      "Active SLR L": { "FN": { next: "Active SLR R" }, "any": { next: "Active SLR R" } },
      "Active SLR R": {
        "FN": { next: "CHECK_Active SLR L|Stabilized ASLR L|CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" },
        "any": { next: "CHECK_Active SLR L|Stabilized ASLR L|CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" },
      },
      "Stabilized ASLR L": { "FN": { diag: "Left Core (Pelvic) SMCD.", next: "CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" }, "any": { next: "Passive SLR L" } },
      "Passive SLR L": { "FN": { diag: "Left Hip flexion SMCD.", next: "CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" }, "any": { next: "Supine Knee to Chest L (Thighs)" } },
      "Supine Knee to Chest L (Thighs)": { "FN": { diag: "Left Posterior chain MD.", next: "CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" }, "DN": { diag: "Left Hip flexion MD.", next: "CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" }, "any": { diag: "Left Hip joint pain.", next: "CHECK_Active SLR R|Stabilized ASLR R|Prone Rocking" } },
      "Stabilized ASLR R": { "FN": { diag: "Right Core (Pelvic) SMCD.", next: "Prone Rocking" }, "any": { next: "Passive SLR R" } },
      "Passive SLR R": { "FN": { diag: "Right Hip flexion SMCD.", next: "Prone Rocking" }, "any": { next: "Supine Knee to Chest R (Thighs)" } },
      "Supine Knee to Chest R (Thighs)": { "FN": { diag: "Right Posterior chain MD.", next: "Prone Rocking" }, "DN": { diag: "Right Hip flexion MD.", next: "Prone Rocking" }, "any": { diag: "Right Hip joint pain.", next: "Prone Rocking" } },
      "Prone Rocking": { "FN": { diag: "Spine flexion normal.", next: "EXIT" }, "DN": { diag: "Spine flexion MD.", next: "EXIT" }, "any": { diag: "Spine flexion pain/dysfunction.", next: "EXIT" } },
    },
  },
  "Multi-Segmental Extension": {
    start: "Prone Press-Up",
    nodes: {
      "Prone Press-Up": { "FN": { next: "Active Prone Shoulder Girdle Flexion L" }, "any": { next: "Active Lumbar Locked (IR) Ext/Rot L" } },
      // Lumbar-locked thorax: Active L/R then Passive L/R as needed
      "Active Lumbar Locked (IR) Ext/Rot L": { "FN": { next: "Active Lumbar Locked (IR) Ext/Rot R" }, "any": { next: "Active Lumbar Locked (IR) Ext/Rot R" } },
      "Active Lumbar Locked (IR) Ext/Rot R": {
        "FN": { next: "CHECK_Active Lumbar Locked (IR) Ext/Rot L|Passive Lumbar Locked Ext/Rot L|CHECK_Active Lumbar Locked (IR) Ext/Rot R|Passive Lumbar Locked Ext/Rot R|Active Prone on Elbow Ext/Rot L" },
        "any": { next: "CHECK_Active Lumbar Locked (IR) Ext/Rot L|Passive Lumbar Locked Ext/Rot L|CHECK_Active Lumbar Locked (IR) Ext/Rot R|Passive Lumbar Locked Ext/Rot R|Active Prone on Elbow Ext/Rot L" },
      },
      "Passive Lumbar Locked Ext/Rot L": { "FN": { diag: "Left Thorax ext/rot SMCD.", next: "CHECK_Active Lumbar Locked (IR) Ext/Rot R|Passive Lumbar Locked Ext/Rot R|Active Prone on Elbow Ext/Rot L" }, "DN": { diag: "Left Thorax ext/rot MD.", next: "CHECK_Active Lumbar Locked (IR) Ext/Rot R|Passive Lumbar Locked Ext/Rot R|Active Prone on Elbow Ext/Rot L" }, "any": { diag: "Left Thorax pain.", next: "CHECK_Active Lumbar Locked (IR) Ext/Rot R|Passive Lumbar Locked Ext/Rot R|Active Prone on Elbow Ext/Rot L" } },
      "Passive Lumbar Locked Ext/Rot R": { "FN": { diag: "Right Thorax ext/rot SMCD.", next: "Active Prone on Elbow Ext/Rot L" }, "DN": { diag: "Right Thorax ext/rot MD.", next: "Active Prone on Elbow Ext/Rot L" }, "any": { diag: "Right Thorax pain.", next: "Active Prone on Elbow Ext/Rot L" } },
      // Prone on elbow: Active L/R then Passive L/R
      "Active Prone on Elbow Ext/Rot L": { "FN": { diag: "Left WB extension SMCD.", next: "Active Prone on Elbow Ext/Rot R" }, "any": { next: "Active Prone on Elbow Ext/Rot R" } },
      "Active Prone on Elbow Ext/Rot R": {
        "FN": { diag: "Right WB extension SMCD.", next: "CHECK_Active Prone on Elbow Ext/Rot L|Passive Prone on Elbow Ext/Rot L|CHECK_Active Prone on Elbow Ext/Rot R|Passive Prone on Elbow Ext/Rot R|Active Prone Shoulder Girdle Flexion L" },
        "any": { next: "CHECK_Active Prone on Elbow Ext/Rot L|Passive Prone on Elbow Ext/Rot L|CHECK_Active Prone on Elbow Ext/Rot R|Passive Prone on Elbow Ext/Rot R|Active Prone Shoulder Girdle Flexion L" },
      },
      "Passive Prone on Elbow Ext/Rot L": { "FN": { diag: "Left Lumbar ext/rot SMCD.", next: "CHECK_Active Prone on Elbow Ext/Rot R|Passive Prone on Elbow Ext/Rot R|Active Prone Shoulder Girdle Flexion L" }, "DN": { diag: "Left Lumbar ext/rot MD.", next: "CHECK_Active Prone on Elbow Ext/Rot R|Passive Prone on Elbow Ext/Rot R|Active Prone Shoulder Girdle Flexion L" }, "any": { diag: "Left Lumbar pain.", next: "CHECK_Active Prone on Elbow Ext/Rot R|Passive Prone on Elbow Ext/Rot R|Active Prone Shoulder Girdle Flexion L" } },
      "Passive Prone on Elbow Ext/Rot R": { "FN": { diag: "Right Lumbar ext/rot SMCD.", next: "Active Prone Shoulder Girdle Flexion L" }, "DN": { diag: "Right Lumbar ext/rot MD.", next: "Active Prone Shoulder Girdle Flexion L" }, "any": { diag: "Right Lumbar pain.", next: "Active Prone Shoulder Girdle Flexion L" } },
      // Shoulder girdle: Active L/R then Passive L/R
      "Active Prone Shoulder Girdle Flexion L": { "FN": { next: "Active Prone Shoulder Girdle Flexion R" }, "any": { next: "Active Prone Shoulder Girdle Flexion R" } },
      "Active Prone Shoulder Girdle Flexion R": {
        "FN": { next: "CHECK_Active Prone Shoulder Girdle Flexion L|Passive Prone Shoulder Flexion L|CHECK_Active Prone Shoulder Girdle Flexion R|Passive Prone Shoulder Flexion R|FABER Test L" },
        "any": { next: "CHECK_Active Prone Shoulder Girdle Flexion L|Passive Prone Shoulder Flexion L|CHECK_Active Prone Shoulder Girdle Flexion R|Passive Prone Shoulder Flexion R|FABER Test L" },
      },
      "Passive Prone Shoulder Flexion L": { "FN": { diag: "Left Shoulder flexion SMCD.", next: "CHECK_Active Prone Shoulder Girdle Flexion R|Passive Prone Shoulder Flexion R|FABER Test L" }, "any": { diag: "Left Shoulder flexion MD.", next: "CHECK_Active Prone Shoulder Girdle Flexion R|Passive Prone Shoulder Flexion R|FABER Test L" } },
      "Passive Prone Shoulder Flexion R": { "FN": { diag: "Right Shoulder flexion SMCD.", next: "FABER Test L" }, "any": { diag: "Right Shoulder flexion MD.", next: "FABER Test L" } },
      // FABER: both sides then Stabilized for failed sides
      "FABER Test L": { "FN": { next: "FABER Test R" }, "any": { next: "FABER Test R" } },
      "FABER Test R": {
        "FN": { next: "CHECK_FABER Test L|Stabilized FABER Test L|CHECK_FABER Test R|Stabilized FABER Test R|Modified Thomas Test L" },
        "any": { next: "CHECK_FABER Test L|Stabilized FABER Test L|CHECK_FABER Test R|Stabilized FABER Test R|Modified Thomas Test L" },
      },
      "Stabilized FABER Test L": { "FN": { diag: "Left Core (Pelvic Orientation) SMCD.", next: "CHECK_FABER Test R|Stabilized FABER Test R|Modified Thomas Test L" }, "DN": { diag: "Left Hip/SI Joint MD.", next: "CHECK_FABER Test R|Stabilized FABER Test R|Modified Thomas Test L" }, "any": { diag: "Left hip/SI pain/dysfunction.", next: "CHECK_FABER Test R|Stabilized FABER Test R|Modified Thomas Test L" } },
      "Stabilized FABER Test R": { "FN": { diag: "Right Core (Pelvic Orientation) SMCD.", next: "Modified Thomas Test L" }, "DN": { diag: "Right Hip/SI Joint MD.", next: "Modified Thomas Test L" }, "any": { diag: "Right hip/SI pain/dysfunction.", next: "Modified Thomas Test L" } },
      "Modified Thomas Test L": { "FN": { next: "Modified Thomas Test R" }, "any": { diag: "Left Hip Extension MD (Thomas).", next: "Modified Thomas Test R" } },
      "Modified Thomas Test R": { "FN": { next: "Active Prone Hip Extension L" }, "any": { diag: "Right Hip Extension MD (Thomas).", next: "Active Prone Hip Extension L" } },
      // Prone hip extension: Active L/R then Passive L/R
      "Active Prone Hip Extension L": { "FN": { next: "Active Prone Hip Extension R" }, "any": { next: "Active Prone Hip Extension R" } },
      "Active Prone Hip Extension R": {
        // No "Bilateral Extension Normal" here — it would fire even when L still needs Passive.
        "FN": { next: "CHECK_Active Prone Hip Extension L|Passive Prone Hip Extension L|EXIT" },
        "any": { next: "CHECK_Active Prone Hip Extension L|Passive Prone Hip Extension L|CHECK_Active Prone Hip Extension R|Passive Prone Hip Extension R|EXIT" },
      },
      "Passive Prone Hip Extension L": { "FN": { diag: "Left hip extension SMCD.", next: "CHECK_Active Prone Hip Extension R|Passive Prone Hip Extension R|EXIT" }, "DN": { diag: "Left hip extension MD.", next: "CHECK_Active Prone Hip Extension R|Passive Prone Hip Extension R|EXIT" }, "any": { diag: "Left hip extension pain.", next: "CHECK_Active Prone Hip Extension R|Passive Prone Hip Extension R|EXIT" } },
      "Passive Prone Hip Extension R": { "FN": { diag: "Right hip extension SMCD.", next: "EXIT" }, "DN": { diag: "Right hip extension MD.", next: "EXIT" }, "any": { diag: "Right hip extension pain.", next: "EXIT" } },
    },
  },
  "MS Rotation L": {
    start: "Seated Torso Rotation L",
    nodes: {
      "Seated Torso Rotation L": { "FN": { next: "Lower Quarter ER Flow" }, "any": { next: "Active Lumbar Locked (IR) Ext/Rot L" } },
      "Active Lumbar Locked (IR) Ext/Rot L": { "FN": { next: "Active Prone on Elbow Ext/Rot L" }, "any": { next: "Passive Lumbar Locked Ext/Rot L" } },
      "Passive Lumbar Locked Ext/Rot L": { "FN": { diag: "Left Thorax ext/rot SMCD.", next: "Active Prone on Elbow Ext/Rot L" }, "DN": { diag: "Left Thorax ext/rot MD.", next: "Lower Quarter ER Flow" }, "any": { diag: "Left Thorax pain.", next: "Lower Quarter ER Flow" } },
      "Active Prone on Elbow Ext/Rot L": { "FN": { diag: "Left Lumbar ext/rot SMCD.", next: "Lower Quarter ER Flow" }, "any": { next: "Passive Prone on Elbow Ext/Rot L" } },
      "Passive Prone on Elbow Ext/Rot L": { "FN": { diag: "Left Lumbar ext/rot SMCD.", next: "Lower Quarter ER Flow" }, "DN": { diag: "Left Lumbar ext/rot MD.", next: "Lower Quarter ER Flow" }, "any": { diag: "Left Lumbar pain.", next: "Lower Quarter ER Flow" } },
    },
  },
  "MS Rotation R": {
    start: "Seated Torso Rotation R",
    nodes: {
      "Seated Torso Rotation R": { "FN": { next: "Lower Quarter ER Flow" }, "any": { next: "Active Lumbar Locked (IR) Ext/Rot R" } },
      "Active Lumbar Locked (IR) Ext/Rot R": { "FN": { next: "Active Prone on Elbow Ext/Rot R" }, "any": { next: "Passive Lumbar Locked Ext/Rot R" } },
      "Passive Lumbar Locked Ext/Rot R": { "FN": { diag: "Right Thorax ext/rot SMCD.", next: "Active Prone on Elbow Ext/Rot R" }, "DN": { diag: "Right Thorax ext/rot MD.", next: "Lower Quarter ER Flow" }, "any": { diag: "Right Thorax pain.", next: "Lower Quarter ER Flow" } },
      "Active Prone on Elbow Ext/Rot R": { "FN": { diag: "Right Lumbar ext/rot SMCD.", next: "Lower Quarter ER Flow" }, "any": { next: "Passive Prone on Elbow Ext/Rot R" } },
      "Passive Prone on Elbow Ext/Rot R": { "FN": { diag: "Right Lumbar ext/rot SMCD.", next: "Lower Quarter ER Flow" }, "DN": { diag: "Right Lumbar ext/rot MD.", next: "Lower Quarter ER Flow" }, "any": { diag: "Right Lumbar pain.", next: "Lower Quarter ER Flow" } },
    },
  },
  "Lower Quarter ER Flow": {
    start: "Active Prone Hip ER L",
    nodes: {
      // Prone hip ER: Active L/R then Stabilized/Passive for failed sides
      "Active Prone Hip ER L": { "FN": { next: "Active Prone Hip ER R" }, "any": { next: "Active Prone Hip ER R" } },
      "Active Prone Hip ER R": {
        "FN": { next: "CHECK_Active Prone Hip ER L|Stabilized Prone External Hip Rotation L|CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" },
        "any": { next: "CHECK_Active Prone Hip ER L|Stabilized Prone External Hip Rotation L|CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" },
      },
      "Stabilized Prone External Hip Rotation L": { "FN": { diag: "Left Core (Pelvic Orientation) SMCD.", next: "CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" }, "any": { next: "Passive Prone Hip ER L" } },
      "Passive Prone Hip ER L": { "FN": { diag: "Left WB/active hip ER SMCD.", next: "CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" }, "DN": { diag: "Left hip ER MD.", next: "CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" }, "any": { diag: "Left hip ER pain/dysfunction.", next: "CHECK_Active Prone Hip ER R|Stabilized Prone External Hip Rotation R|Active Seated Tibial ER L" } },
      "Stabilized Prone External Hip Rotation R": { "FN": { diag: "Right Core (Pelvic Orientation) SMCD.", next: "Active Seated Tibial ER L" }, "any": { next: "Passive Prone Hip ER R" } },
      "Passive Prone Hip ER R": { "FN": { diag: "Right WB/active hip ER SMCD.", next: "Active Seated Tibial ER L" }, "DN": { diag: "Right hip ER MD.", next: "Active Seated Tibial ER L" }, "any": { diag: "Right hip ER pain/dysfunction.", next: "Active Seated Tibial ER L" } },
      // Seated tibial ER both sides, then prone passives (avoids seated↔prone flip per side)
      "Active Seated Tibial ER L": { "FN": { next: "Active Seated Tibial ER R" }, "any": { next: "Active Seated Tibial ER R" } },
      "Active Seated Tibial ER R": {
        "FN": { next: "CHECK_Active Seated Tibial ER L|Passive Prone Tibial ER L|CHECK_Active Seated Tibial ER R|Passive Prone Tibial ER R|Lower Quarter IR Flow" },
        "any": { next: "CHECK_Active Seated Tibial ER L|Passive Prone Tibial ER L|CHECK_Active Seated Tibial ER R|Passive Prone Tibial ER R|Lower Quarter IR Flow" },
      },
      "Passive Prone Tibial ER L": { "FN": { diag: "Left tibial ER SMCD.", next: "CHECK_Active Seated Tibial ER R|Passive Prone Tibial ER R|Lower Quarter IR Flow" }, "DN": { diag: "Left tibial ER MD.", next: "CHECK_Active Seated Tibial ER R|Passive Prone Tibial ER R|Lower Quarter IR Flow" }, "any": { next: "CHECK_Active Seated Tibial ER R|Passive Prone Tibial ER R|Lower Quarter IR Flow" } },
      "Passive Prone Tibial ER R": { "FN": { diag: "Right tibial ER SMCD.", next: "Lower Quarter IR Flow" }, "DN": { diag: "Right tibial ER MD.", next: "Lower Quarter IR Flow" }, "any": { diag: "Right tibial ER pain/dysfunction.", next: "Lower Quarter IR Flow" } },
    },
  },
  "Lower Quarter IR Flow": {
    start: "Active Prone Hip IR L",
    nodes: {
      "Active Prone Hip IR L": { "FN": { next: "Active Prone Hip IR R" }, "any": { next: "Active Prone Hip IR R" } },
      "Active Prone Hip IR R": {
        "FN": { next: "CHECK_Active Prone Hip IR L|Stabilized Prone Internal Hip Rotation L|CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" },
        "any": { next: "CHECK_Active Prone Hip IR L|Stabilized Prone Internal Hip Rotation L|CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" },
      },
      "Stabilized Prone Internal Hip Rotation L": { "FN": { diag: "Left Core (Pelvic Orientation) SMCD.", next: "CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" }, "any": { next: "Passive Prone Hip IR L" } },
      "Passive Prone Hip IR L": { "FN": { diag: "Left WB/active hip IR SMCD.", next: "CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" }, "DN": { diag: "Left hip IR MD.", next: "CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" }, "any": { diag: "Left hip IR pain/dysfunction.", next: "CHECK_Active Prone Hip IR R|Stabilized Prone Internal Hip Rotation R|Active Seated Tibial IR L" } },
      "Stabilized Prone Internal Hip Rotation R": { "FN": { diag: "Right Core (Pelvic Orientation) SMCD.", next: "Active Seated Tibial IR L" }, "any": { next: "Passive Prone Hip IR R" } },
      "Passive Prone Hip IR R": { "FN": { diag: "Right WB/active hip IR SMCD.", next: "Active Seated Tibial IR L" }, "DN": { diag: "Right hip IR MD.", next: "Active Seated Tibial IR L" }, "any": { diag: "Right hip IR pain/dysfunction.", next: "Active Seated Tibial IR L" } },
      "Active Seated Tibial IR L": { "FN": { next: "Active Seated Tibial IR R" }, "any": { next: "Active Seated Tibial IR R" } },
      "Active Seated Tibial IR R": {
        "FN": { next: "CHECK_Active Seated Tibial IR L|Passive Prone Tibial IR L|CHECK_Active Seated Tibial IR R|Passive Prone Tibial IR R|EXIT" },
        "any": { next: "CHECK_Active Seated Tibial IR L|Passive Prone Tibial IR L|CHECK_Active Seated Tibial IR R|Passive Prone Tibial IR R|EXIT" },
      },
      "Passive Prone Tibial IR L": { "FN": { diag: "Left tibial IR SMCD.", next: "CHECK_Active Seated Tibial IR R|Passive Prone Tibial IR R|EXIT" }, "DN": { diag: "Left tibial IR MD.", next: "CHECK_Active Seated Tibial IR R|Passive Prone Tibial IR R|EXIT" }, "any": { next: "CHECK_Active Seated Tibial IR R|Passive Prone Tibial IR R|EXIT" } },
      "Passive Prone Tibial IR R": { "FN": { diag: "Right tibial IR SMCD.", next: "EXIT" }, "DN": { diag: "Right tibial IR MD.", next: "EXIT" }, "any": { diag: "Right tibial IR pain/dysfunction.", next: "EXIT" } },
    },
  },
  "SLS": {
    start: "Vestibular Test - CTSIB (Static)",
    nodes: {
      "Vestibular Test - CTSIB (Static)": { "FN": { next: "CTSIB (Dynamic)" }, "any": { diag: "Static vestibular SMCD.", next: "Half-Kneeling Narrow Base L" } },
      "CTSIB (Dynamic)": { "FN": { next: "Half-Kneeling Narrow Base L" }, "any": { diag: "Dynamic vestibular SMCD.", next: "Half-Kneeling Narrow Base L" } },
      "Half-Kneeling Narrow Base L": { "FN": { next: "Half-Kneeling Narrow Base R" }, "any": { next: "Half-Kneeling Narrow Base R" } },
      "Half-Kneeling Narrow Base R": { "FN": { next: "CHECK_Half-Kneeling Narrow Base L|Quadruped Diagonals L|CHECK_Half-Kneeling Narrow Base R|Quadruped Diagonals R|Active Tandem Dorsiflexion L" }, "any": { next: "CHECK_Half-Kneeling Narrow Base L|Quadruped Diagonals L|CHECK_Half-Kneeling Narrow Base R|Quadruped Diagonals R|Active Tandem Dorsiflexion L" } },
      "Quadruped Diagonals L": { "FN": { diag: "Left WB spine/core SMCD.", next: "CHECK_Half-Kneeling Narrow Base R|Quadruped Diagonals R|Active Tandem Dorsiflexion L" }, "any": { diag: "Left WB hip/core SMCD.", next: "CHECK_Half-Kneeling Narrow Base R|Quadruped Diagonals R|Active Tandem Dorsiflexion L" } },
      "Quadruped Diagonals R": { "FN": { diag: "Right WB spine/core SMCD.", next: "Active Tandem Dorsiflexion L" }, "any": { diag: "Right WB hip/core SMCD.", next: "Active Tandem Dorsiflexion L" } },
      // Ankle DF: Active stand L/R then prone passives
      "Active Tandem Dorsiflexion L": { "FN": { next: "Active Tandem Dorsiflexion R" }, "any": { next: "Active Tandem Dorsiflexion R" } },
      "Active Tandem Dorsiflexion R": {
        "FN": { next: "CHECK_Active Tandem Dorsiflexion L|Passive Prone Dorsiflexion L (Knee Ext)|CHECK_Active Tandem Dorsiflexion R|Passive Prone Dorsiflexion R (Knee Ext)|Active Tandem Plantarflexion L" },
        "any": { next: "CHECK_Active Tandem Dorsiflexion L|Passive Prone Dorsiflexion L (Knee Ext)|CHECK_Active Tandem Dorsiflexion R|Passive Prone Dorsiflexion R (Knee Ext)|Active Tandem Plantarflexion L" },
      },
      "Passive Prone Dorsiflexion L (Knee Ext)": { "FN": { diag: "Left Ankle dorsiflexion SMCD.", next: "CHECK_Active Tandem Dorsiflexion R|Passive Prone Dorsiflexion R (Knee Ext)|Active Tandem Plantarflexion L" }, "any": { diag: "Left Ankle dorsiflexion MD.", next: "CHECK_Active Tandem Dorsiflexion R|Passive Prone Dorsiflexion R (Knee Ext)|Active Tandem Plantarflexion L" } },
      "Passive Prone Dorsiflexion R (Knee Ext)": { "FN": { diag: "Right Ankle dorsiflexion SMCD.", next: "Active Tandem Plantarflexion L" }, "any": { diag: "Right Ankle dorsiflexion MD.", next: "Active Tandem Plantarflexion L" } },
      // Ankle PF: Active L/R then passives
      "Active Tandem Plantarflexion L": { "FN": { next: "Active Tandem Plantarflexion R" }, "any": { next: "Active Tandem Plantarflexion R" } },
      "Active Tandem Plantarflexion R": {
        "FN": { next: "CHECK_Active Tandem Plantarflexion L|Passive Plantarflexion L|CHECK_Active Tandem Plantarflexion R|Passive Plantarflexion R|Active Seated Ankle Inversion L" },
        "any": { next: "CHECK_Active Tandem Plantarflexion L|Passive Plantarflexion L|CHECK_Active Tandem Plantarflexion R|Passive Plantarflexion R|Active Seated Ankle Inversion L" },
      },
      "Passive Plantarflexion L": { "FN": { diag: "Left Ankle plantarflexion SMCD.", next: "CHECK_Active Tandem Plantarflexion R|Passive Plantarflexion R|Active Seated Ankle Inversion L" }, "any": { diag: "Left Ankle plantarflexion MD.", next: "CHECK_Active Tandem Plantarflexion R|Passive Plantarflexion R|Active Seated Ankle Inversion L" } },
      "Passive Plantarflexion R": { "FN": { diag: "Right Ankle plantarflexion SMCD.", next: "Active Seated Ankle Inversion L" }, "any": { diag: "Right Ankle plantarflexion MD.", next: "Active Seated Ankle Inversion L" } },
      // Seated inversion: Active L/R then passives
      "Active Seated Ankle Inversion L": { "FN": { next: "Active Seated Ankle Inversion R" }, "any": { next: "Active Seated Ankle Inversion R" } },
      "Active Seated Ankle Inversion R": {
        "FN": { next: "CHECK_Active Seated Ankle Inversion L|Passive Ankle Inversion L|CHECK_Active Seated Ankle Inversion R|Passive Ankle Inversion R|Active Seated Ankle Eversion L" },
        "any": { next: "CHECK_Active Seated Ankle Inversion L|Passive Ankle Inversion L|CHECK_Active Seated Ankle Inversion R|Passive Ankle Inversion R|Active Seated Ankle Eversion L" },
      },
      "Passive Ankle Inversion L": { "FN": { diag: "Left Ankle inversion SMCD.", next: "CHECK_Active Seated Ankle Inversion R|Passive Ankle Inversion R|Active Seated Ankle Eversion L" }, "any": { diag: "Left Ankle inversion MD.", next: "CHECK_Active Seated Ankle Inversion R|Passive Ankle Inversion R|Active Seated Ankle Eversion L" } },
      "Passive Ankle Inversion R": { "FN": { diag: "Right Ankle inversion SMCD.", next: "Active Seated Ankle Eversion L" }, "any": { diag: "Right Ankle inversion MD.", next: "Active Seated Ankle Eversion L" } },
      // Seated eversion: Active L/R then passives
      "Active Seated Ankle Eversion L": { "FN": { next: "Active Seated Ankle Eversion R" }, "any": { next: "Active Seated Ankle Eversion R" } },
      "Active Seated Ankle Eversion R": {
        "FN": { next: "CHECK_Active Seated Ankle Eversion L|Passive Ankle Eversion L|CHECK_Active Seated Ankle Eversion R|Passive Ankle Eversion R|EXIT" },
        "any": { next: "CHECK_Active Seated Ankle Eversion L|Passive Ankle Eversion L|CHECK_Active Seated Ankle Eversion R|Passive Ankle Eversion R|EXIT" },
      },
      "Passive Ankle Eversion L": { "FN": { diag: "Left Ankle eversion SMCD.", next: "CHECK_Active Seated Ankle Eversion R|Passive Ankle Eversion R|EXIT" }, "any": { diag: "Left Ankle eversion MD.", next: "CHECK_Active Seated Ankle Eversion R|Passive Ankle Eversion R|EXIT" } },
      "Passive Ankle Eversion R": { "FN": { diag: "Right Ankle eversion SMCD.", next: "EXIT" }, "any": { diag: "Right Ankle eversion MD.", next: "EXIT" } },
    },
  },
  "Deep Squat": {
    start: "Active Tandem Dorsiflexion - Knee Flexed L",
    nodes: {
      "Active Tandem Dorsiflexion - Knee Flexed L": { "FN": { next: "Active Tandem Dorsiflexion - Knee Flexed R" }, "any": { next: "Active Tandem Dorsiflexion - Knee Flexed R" } },
      "Active Tandem Dorsiflexion - Knee Flexed R": {
        "FN": { next: "CHECK_Active Tandem Dorsiflexion - Knee Flexed L|Passive Prone Dorsiflexion - Knee Flexed L|CHECK_Active Tandem Dorsiflexion - Knee Flexed R|Passive Prone Dorsiflexion - Knee Flexed R|Active Seated Ankle Inversion/Eversion L" },
        "any": { next: "CHECK_Active Tandem Dorsiflexion - Knee Flexed L|Passive Prone Dorsiflexion - Knee Flexed L|CHECK_Active Tandem Dorsiflexion - Knee Flexed R|Passive Prone Dorsiflexion - Knee Flexed R|Active Seated Ankle Inversion/Eversion L" },
      },
      "Passive Prone Dorsiflexion - Knee Flexed L": { "FN": { diag: "Left ankle dorsiflexion SMCD (knee flexed).", next: "CHECK_Active Tandem Dorsiflexion - Knee Flexed R|Passive Prone Dorsiflexion - Knee Flexed R|Active Seated Ankle Inversion/Eversion L" }, "DN": { diag: "Left ankle dorsiflexion MD (knee flexed).", next: "CHECK_Active Tandem Dorsiflexion - Knee Flexed R|Passive Prone Dorsiflexion - Knee Flexed R|Active Seated Ankle Inversion/Eversion L" }, "any": { diag: "Left ankle dorsiflexion pain/dysfunction.", next: "CHECK_Active Tandem Dorsiflexion - Knee Flexed R|Passive Prone Dorsiflexion - Knee Flexed R|Active Seated Ankle Inversion/Eversion L" } },
      "Passive Prone Dorsiflexion - Knee Flexed R": { "FN": { diag: "Right ankle dorsiflexion SMCD (knee flexed).", next: "Active Seated Ankle Inversion/Eversion L" }, "DN": { diag: "Right ankle dorsiflexion MD (knee flexed).", next: "Active Seated Ankle Inversion/Eversion L" }, "any": { diag: "Right ankle dorsiflexion pain/dysfunction.", next: "Active Seated Ankle Inversion/Eversion L" } },
      "Active Seated Ankle Inversion/Eversion L": { "FN": { next: "Active Seated Ankle Inversion/Eversion R" }, "any": { next: "Active Seated Ankle Inversion/Eversion R" } },
      "Active Seated Ankle Inversion/Eversion R": {
        "FN": { next: "CHECK_Active Seated Ankle Inversion/Eversion L|Passive Ankle Inversion/Eversion L|CHECK_Active Seated Ankle Inversion/Eversion R|Passive Ankle Inversion/Eversion R|Supine Knees to Chest (Shins)" },
        "any": { next: "CHECK_Active Seated Ankle Inversion/Eversion L|Passive Ankle Inversion/Eversion L|CHECK_Active Seated Ankle Inversion/Eversion R|Passive Ankle Inversion/Eversion R|Supine Knees to Chest (Shins)" },
      },
      "Passive Ankle Inversion/Eversion L": { "FN": { diag: "Left ankle inversion/eversion SMCD.", next: "CHECK_Active Seated Ankle Inversion/Eversion R|Passive Ankle Inversion/Eversion R|Supine Knees to Chest (Shins)" }, "DN": { diag: "Left ankle inversion/eversion MD.", next: "CHECK_Active Seated Ankle Inversion/Eversion R|Passive Ankle Inversion/Eversion R|Supine Knees to Chest (Shins)" }, "any": { next: "CHECK_Active Seated Ankle Inversion/Eversion R|Passive Ankle Inversion/Eversion R|Supine Knees to Chest (Shins)" } },
      "Passive Ankle Inversion/Eversion R": { "FN": { diag: "Right ankle inversion/eversion SMCD.", next: "Supine Knees to Chest (Shins)" }, "DN": { diag: "Right ankle inversion/eversion MD.", next: "Supine Knees to Chest (Shins)" }, "any": { next: "Supine Knees to Chest (Shins)" } },
      "Supine Knees to Chest (Shins)": { "FN": { next: "Active Seated Hip IR L" }, "any": { next: "Supine Knees to Chest (Thighs)" } },
      "Supine Knees to Chest (Thighs)": { "FN": { diag: "Knee flexion MD.", next: "Active Seated Hip IR L" }, "DN": { diag: "Hip flexion MD and possible knee flexion MD.", next: "Active Seated Hip IR L" }, "any": { diag: "Hip flexion pain/dysfunction.", next: "Active Seated Hip IR L" } },
      "Active Seated Hip IR L": { "FN": { next: "Active Seated Hip IR R" }, "any": { next: "Active Seated Hip IR R" } },
      "Active Seated Hip IR R": {
        "FN": { next: "CHECK_Active Seated Hip IR L|Passive Seated Hip IR L|CHECK_Active Seated Hip IR R|Passive Seated Hip IR R|Active Seated Hip ER L" },
        "any": { next: "CHECK_Active Seated Hip IR L|Passive Seated Hip IR L|CHECK_Active Seated Hip IR R|Passive Seated Hip IR R|Active Seated Hip ER L" },
      },
      "Passive Seated Hip IR L": { "FN": { diag: "Left hip IR SMCD.", next: "CHECK_Active Seated Hip IR R|Passive Seated Hip IR R|Active Seated Hip ER L" }, "DN": { diag: "Left hip IR MD.", next: "CHECK_Active Seated Hip IR R|Passive Seated Hip IR R|Active Seated Hip ER L" }, "any": { next: "CHECK_Active Seated Hip IR R|Passive Seated Hip IR R|Active Seated Hip ER L" } },
      "Passive Seated Hip IR R": { "FN": { diag: "Right hip IR SMCD.", next: "Active Seated Hip ER L" }, "DN": { diag: "Right hip IR MD.", next: "Active Seated Hip ER L" }, "any": { next: "Active Seated Hip ER L" } },
      "Active Seated Hip ER L": { "FN": { next: "Active Seated Hip ER R" }, "any": { next: "Active Seated Hip ER R" } },
      "Active Seated Hip ER R": {
        "FN": { next: "CHECK_Active Seated Hip ER L|Passive Seated Hip ER L|CHECK_Active Seated Hip ER R|Passive Seated Hip ER R|EXIT" },
        "any": { next: "CHECK_Active Seated Hip ER L|Passive Seated Hip ER L|CHECK_Active Seated Hip ER R|Passive Seated Hip ER R|EXIT" },
      },
      "Passive Seated Hip ER L": { "FN": { diag: "Left hip ER SMCD.", next: "CHECK_Active Seated Hip ER R|Passive Seated Hip ER R|EXIT" }, "DN": { diag: "Left hip ER MD.", next: "CHECK_Active Seated Hip ER R|Passive Seated Hip ER R|EXIT" }, "any": { next: "CHECK_Active Seated Hip ER R|Passive Seated Hip ER R|EXIT" } },
      "Passive Seated Hip ER R": { "FN": { diag: "Right hip ER SMCD.", next: "EXIT" }, "DN": { diag: "Right hip ER MD.", next: "EXIT" }, "any": { diag: "Right hip ER pain/dysfunction.", next: "EXIT" } },
    },
  },
};
