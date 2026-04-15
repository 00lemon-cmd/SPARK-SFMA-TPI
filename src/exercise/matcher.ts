import type { Exercise, ResultEntry, DysfunctionType } from "@/lib/types";
import { EXERCISE_LIBRARY } from "./library";

export interface PrescribedExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  priority: number;
  forDiagnosis: string;
  side: string;
}

export const PATTERN_MAP: Record<string, string> = {
  "Cervical": "Cervical Patterns",
  "UE Pattern": "Upper Extremity Patterns",
  "Flexion": "Multi-Segmental Flexion",
  "SLR": "Multi-Segmental Flexion",
  "Forward Bend": "Multi-Segmental Flexion",
  "Extension": "Multi-Segmental Extension",
  "FABER": "Multi-Segmental Extension",
  "Thomas": "Multi-Segmental Extension",
  "Hip Extension": "Multi-Segmental Extension",
  "Rotation": "Multi-Segmental Rotation",
  "Thoracic Rotation": "Multi-Segmental Rotation",
  "SLS": "Single Leg Stance",
  "Hurdle Step": "Hurdle Step",
  "Inline Lunge": "Inline Lunge",
  "Ankle": "Single Leg Stance",
  "Vestibular": "Single Leg Stance",
  "Deep Squat": "Overhead Deep Squat",
  "Overhead Squat": "Overhead Deep Squat",
  "Rotary Stability": "Rotary Stability",
  "Shoulder Mobility": "Shoulder Mobility",
  "Trunk Stability Push-Up": "Trunk Stability Push-Up",
  "Active Straight Leg Raise": "Active Straight Leg Raise",
};

function resolveDysfunctionType(diag: string): DysfunctionType | null {
  if (diag.includes("SMCD")) return "SMCD";
  if (diag.includes("MD")) return "MD";
  return null;
}

export function resolvePattern(pattern: string): string {
  if (PATTERN_MAP[pattern]) return PATTERN_MAP[pattern];
  for (const [key, mapped] of Object.entries(PATTERN_MAP)) {
    if (pattern.toLowerCase().includes(key.toLowerCase())) return mapped;
  }
  return pattern;
}

export function matchExercises(terminalDiagnoses: ResultEntry[], sfmaPattern: string): Exercise[] {
  const libraryPattern = resolvePattern(sfmaPattern);
  const dysfunctionTypes = new Set<DysfunctionType>();
  for (const entry of terminalDiagnoses) {
    if (entry.diag) {
      const dt = resolveDysfunctionType(entry.diag);
      if (dt) dysfunctionTypes.add(dt);
    }
  }
  if (dysfunctionTypes.size === 0) return [];
  return EXERCISE_LIBRARY.filter(
    (ex) => ex.sfmaPattern === libraryPattern && dysfunctionTypes.has(ex.dysfunctionType)
  );
}

const CATEGORY_PRIORITY: Record<string, number> = {
  "Soft Tissue Mobilization": 10,
  "Thoracic Mobility": 9,
  "Hip Mobility": 9,
  "Hip Flexion Mobility": 9,
  "Ankle Mobility": 9,
  "Cervical Mobility": 9,
  "Glenohumeral Mobility": 9,
  "Anterior Shoulder Mobility": 9,
  "Posterior Chain Mobility": 9,
  "Integrated Mobility": 8,
  "Glute Activation & Hip Extension": 7,
  "Glute Activation": 7,
  "Rolling Patterns": 7,
  "Core Stability & Motor Control": 6,
  "Core Stability": 6,
  "Deep Cervical Stability": 6,
  "Cervical Motor Control": 6,
  "Balance & Proprioception": 5,
  "Dynamic Balance": 5,
  "Hip Stability & Strength": 5,
  "Hip Stability": 5,
  "Hip Motor Control": 5,
  "Ankle Stability": 5,
  "Foot & Ankle Stability": 5,
  "Scapular Stability": 5,
  "Shoulder Stability": 5,
  "Rotator Cuff Activation": 5,
  "Anti-Rotation": 5,
  "Rotational Motor Control": 4,
  "Cervical Strengthening": 4,
  "Rotator Cuff Strengthening": 4,
  "Transitional Patterns": 3,
  "Overhead Patterns": 3,
  "Integrated Patterns": 3,
  "Pressing Patterns": 3,
  "Squat Patterns": 3,
  "Lunge Patterns": 3,
  "Squat Strength": 2,
  "Functional Strength": 2,
};

function prescribeReps(category: string): { sets: number; reps: string } {
  const cat = category.toLowerCase();
  if (cat.includes("soft tissue") || cat.includes("mobilization"))
    return { sets: 1, reps: "90-120s per area" };
  if (cat.includes("mobility"))
    return { sets: 2, reps: "8-10 reps / 30s hold" };
  if (cat.includes("rolling"))
    return { sets: 3, reps: "5 reps each direction" };
  if (cat.includes("balance") || cat.includes("proprioception"))
    return { sets: 3, reps: "20-30s hold" };
  if (cat.includes("glute activation") || cat.includes("activation"))
    return { sets: 2, reps: "10-12 reps" };
  if (cat.includes("stability") || cat.includes("motor control") || cat.includes("anti-rotation"))
    return { sets: 2, reps: "8 reps / 5s hold" };
  if (cat.includes("strength") || cat.includes("pressing") || cat.includes("squat") || cat.includes("lunge"))
    return { sets: 2, reps: "8-10 reps" };
  return { sets: 2, reps: "8-10 reps" };
}

const MAX_TODAY_EXERCISES = 8;

export function buildTodaysProgram(terminalDiagnoses: ResultEntry[]): PrescribedExercise[] {
  const candidates: PrescribedExercise[] = [];
  const seen = new Set<string>();

  for (const r of terminalDiagnoses) {
    if (!r.diag) continue;
    const pattern = resolvePattern(r.pattern);
    const matched = matchExercises([r], pattern);

    let side = "";
    if (r.test.endsWith(" L")) side = "LEFT";
    else if (r.test.endsWith(" R")) side = "RIGHT";

    const isMD = r.diag.includes("MD");

    for (const ex of matched) {
      const key = `${ex.name}__${side}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const catPriority = CATEGORY_PRIORITY[ex.category] ?? 1;
      const typePriority = isMD ? 20 : 10;
      const priority = typePriority + catPriority;
      const rx = prescribeReps(ex.category);

      candidates.push({
        exercise: ex,
        sets: rx.sets,
        reps: rx.reps,
        priority,
        forDiagnosis: r.diag,
        side,
      });
    }
  }

  candidates.sort((a, b) => b.priority - a.priority);

  const selected: PrescribedExercise[] = [];
  const usedCategories = new Map<string, number>();

  for (const c of candidates) {
    if (selected.length >= MAX_TODAY_EXERCISES) break;
    const catCount = usedCategories.get(c.exercise.category) ?? 0;
    if (catCount >= 2) continue;
    usedCategories.set(c.exercise.category, catCount + 1);
    selected.push(c);
  }

  return selected;
}
