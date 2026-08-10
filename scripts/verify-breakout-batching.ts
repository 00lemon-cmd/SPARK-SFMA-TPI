import { SFMA_LOGIC } from "../src/engine/sfma-tree";
import { processBreakoutStep } from "../src/engine/breakout-processor";
import type { ResultEntry, Score } from "../src/lib/types";

function walkTs(
  chainName: string,
  scoreFn: (test: string, log: ResultEntry[]) => Score
) {
  const chain = SFMA_LOGIC[chainName];
  const log: ResultEntry[] = [];
  const order: string[] = [];
  const diags: string[] = [];
  let test = chain.start;
  for (let i = 0; i < 120; i++) {
    if (!test || test === "EXIT") break;
    if (test.includes("Flow") && test !== chainName) {
      order.push(`=> ${test}`);
      break;
    }
    const score = scoreFn(test, log);
    order.push(test);
    const step = processBreakoutStep(chain, test, score, log);
    log.push({
      phase: "BREAKOUT",
      pattern: chainName,
      test,
      score,
      diag: step.diag,
    });
    if (step.diag) diags.push(`${test}: ${step.diag}`);
    if (step.nextTest === "EXIT") break;
    if (step.subPatternSwitch) {
      order.push(`=> ${step.subPatternSwitch}`);
      break;
    }
    test = step.nextTest;
  }
  return { order, diags };
}

function assertIncludesInOrder(order: string[], expected: string[], label: string) {
  let from = 0;
  for (const name of expected) {
    const idx = order.indexOf(name, from);
    if (idx === -1) {
      console.error(`FAIL ${label}: missing "${name}" after index ${from}`);
      console.error("  order:", order.join(" -> "));
      process.exitCode = 1;
      return;
    }
    from = idx + 1;
  }
  console.log(`OK   ${label}`);
}

function assertNoThrash(order: string[], aL: string, pL: string, aR: string, label: string) {
  const iAL = order.indexOf(aL);
  const iPL = order.indexOf(pL);
  const iAR = order.indexOf(aR);
  if (iAL !== -1 && iPL !== -1 && iAR !== -1 && iPL < iAR) {
    console.error(`FAIL ${label}: Passive L before Active R (thrash)`);
    console.error("  order:", order.join(" -> "));
    process.exitCode = 1;
    return;
  }
  console.log(`OK   ${label} (no L-passive-before-R-active thrash)`);
}

const allDN = () => "DN" as Score;

{
  const { order, diags } = walkTs("Multi-Segmental Extension", allDN);
  assertIncludesInOrder(
    order,
    [
      "Active Lumbar Locked (IR) Ext/Rot L",
      "Active Lumbar Locked (IR) Ext/Rot R",
      "Passive Lumbar Locked Ext/Rot L",
      "Passive Lumbar Locked Ext/Rot R",
      "Active Prone on Elbow Ext/Rot L",
      "Active Prone on Elbow Ext/Rot R",
      "Passive Prone on Elbow Ext/Rot L",
      "Passive Prone on Elbow Ext/Rot R",
    ],
    "MS Ext DN: lumbar-locked + prone-elbow batched"
  );
  assertNoThrash(
    order,
    "Active Prone on Elbow Ext/Rot L",
    "Passive Prone on Elbow Ext/Rot L",
    "Active Prone on Elbow Ext/Rot R",
    "MS Ext prone-elbow"
  );
  if (!diags.some((d) => d.includes("Left Lumbar"))) {
    console.error("FAIL MS Ext: missing Left Lumbar diag", diags);
    process.exitCode = 1;
  } else {
    console.log("OK   MS Ext diags fire");
  }
}

{
  const { order } = walkTs("SLS", (test) => {
    if (
      test.includes("Vestibular") ||
      test.includes("CTSIB") ||
      test.includes("Half-Kneeling") ||
      test.includes("Quadruped")
    )
      return "FN";
    return "DN";
  });
  assertIncludesInOrder(
    order,
    [
      "Active Tandem Dorsiflexion L",
      "Active Tandem Dorsiflexion R",
      "Passive Prone Dorsiflexion L (Knee Ext)",
      "Passive Prone Dorsiflexion R (Knee Ext)",
      "Active Tandem Plantarflexion L",
      "Active Tandem Plantarflexion R",
    ],
    "SLS DN: DF then PF batched"
  );
}

{
  const { order } = walkTs("Lower Quarter ER Flow", allDN);
  assertIncludesInOrder(
    order,
    [
      "Active Prone Hip ER L",
      "Active Prone Hip ER R",
      "Stabilized Prone External Hip Rotation L",
      "Passive Prone Hip ER L",
      "Stabilized Prone External Hip Rotation R",
      "Passive Prone Hip ER R",
      "Active Seated Tibial ER L",
      "Active Seated Tibial ER R",
      "Passive Prone Tibial ER L",
      "Passive Prone Tibial ER R",
    ],
    "LQ ER DN: hip then seated tibial then prone passives"
  );
}

{
  const { order, diags } = walkTs("Multi-Segmental Flexion", () => "DN");
  assertIncludesInOrder(
    order,
    [
      "Active SLR L",
      "Active SLR R",
      "Stabilized ASLR L",
      "Passive SLR L",
      "Supine Knee to Chest L (Thighs)",
      "Stabilized ASLR R",
    ],
    "MS Flex DN: Active SLR L/R before deep-dives"
  );
  if (
    !diags.some(
      (d) => d.includes("Left Hip flexion MD") || d.includes("Left Posterior")
    )
  ) {
    console.error("FAIL MS Flex diags:", diags);
    process.exitCode = 1;
  } else {
    console.log("OK   MS Flex diags fire");
  }
}

{
  const { order } = walkTs("Deep Squat", allDN);
  assertIncludesInOrder(
    order,
    [
      "Active Tandem Dorsiflexion - Knee Flexed L",
      "Active Tandem Dorsiflexion - Knee Flexed R",
      "Passive Prone Dorsiflexion - Knee Flexed L",
      "Passive Prone Dorsiflexion - Knee Flexed R",
      "Active Seated Ankle Inversion/Eversion L",
      "Active Seated Ankle Inversion/Eversion R",
    ],
    "Deep Squat DN: DF batched"
  );
}

{
  const { order } = walkTs("Multi-Segmental Extension", (test) => {
    if (test === "Prone Press-Up") return "DN";
    return "FN";
  });
  if (order.includes("Passive Lumbar Locked Ext/Rot L")) {
    console.error("FAIL MS Ext FN should skip passives:", order.join(" -> "));
    process.exitCode = 1;
  } else {
    console.log("OK   MS Ext FN skips thorax/lumbar passives");
  }
}

if (!process.exitCode) console.log("\nAll breakout batching checks passed.");
else console.log("\nSome checks failed.");