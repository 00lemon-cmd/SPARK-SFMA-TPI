import type { CompletedAssessment, Handedness, ResultEntry } from "@/lib/types";

/** Hash marker consumed by SPARK-WEBSITE `/staff/sfma`. */
export const TRAINING_APP_IMPORT_HASH = "spark-sfma-import";

const DEFAULT_TRAINING_APP_URL = "https://app.sparkmovementstudio.com.au";

/** Soft ceiling — Chrome handles more, but keep headroom for proxies. */
const MAX_HANDOFF_URL_LENGTH = 18_000;

export function getTrainingAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_TRAINING_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return DEFAULT_TRAINING_APP_URL;
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function buildCompletedAssessmentPayload(input: {
  id?: number;
  client: string;
  handedness: Handedness;
  date?: string;
  results: ResultEntry[];
}): CompletedAssessment {
  return {
    id: input.id,
    client: input.client,
    handedness: input.handedness,
    date: input.date ?? new Date().toISOString(),
    results: input.results,
  };
}

export function buildTrainingAppHandoffUrl(assessment: CompletedAssessment): {
  url: string;
  tooLarge: boolean;
  json: string;
} {
  const json = JSON.stringify(assessment);
  const encoded = toBase64Url(json);
  const base = getTrainingAppBaseUrl();
  const url = `${base}/staff/sfma#${TRAINING_APP_IMPORT_HASH}=${encoded}`;
  return {
    url,
    tooLarge: url.length > MAX_HANDOFF_URL_LENGTH,
    json,
  };
}

/**
 * Open the training app SFMA generator with this assessment preloaded.
 * Falls back to copying JSON + opening the page if the URL would be too long.
 */
export async function sendAssessmentToTrainingApp(
  assessment: CompletedAssessment,
): Promise<"opened" | "copied_fallback"> {
  const { url, tooLarge, json } = buildTrainingAppHandoffUrl(assessment);

  if (!tooLarge) {
    window.open(url, "_blank", "noopener,noreferrer");
    return "opened";
  }

  try {
    await navigator.clipboard.writeText(json);
  } catch {
    // Clipboard may be blocked; still open the page so the coach can paste manually if they copied another way.
  }
  window.open(`${getTrainingAppBaseUrl()}/staff/sfma`, "_blank", "noopener,noreferrer");
  return "copied_fallback";
}
