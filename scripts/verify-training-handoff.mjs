/**
 * Round-trip check for SFMA → training app handoff encoding.
 * Run: node scripts/verify-training-handoff.mjs
 */

function toBase64Url(json) {
  return Buffer.from(json, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

const assessment = {
  client: "Test Client",
  handedness: "right",
  date: "2026-08-11T00:00:00.000Z",
  results: [
    {
      phase: "TOP_TIER",
      pattern: "",
      test: "Multi-Segmental Extension",
      score: "DN",
    },
    {
      phase: "BREAKOUT",
      pattern: "Multi-Segmental Extension",
      test: "Passive Lumbar Locked Ext/Rot L",
      score: "DN",
      diag: "Left Thorax ext/rot MD.",
    },
  ],
};

const json = JSON.stringify(assessment);
const encoded = toBase64Url(json);
const decoded = JSON.parse(fromBase64Url(encoded));
const url = `https://app.sparkmovementstudio.com.au/staff/sfma#spark-sfma-import=${encoded}`;

if (decoded.client !== assessment.client) throw new Error("client mismatch");
if (decoded.results.length !== 2) throw new Error("results mismatch");
if (!url.includes("spark-sfma-import=")) throw new Error("hash missing");

console.log("OK handoff round-trip");
console.log("url length:", url.length);