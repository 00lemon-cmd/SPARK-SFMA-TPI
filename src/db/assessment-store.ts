import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompletedAssessment, Handedness, ResultEntry } from "@/lib/types";

interface AssessmentStore {
  assessments: CompletedAssessment[];
  save: (client: string, handedness: Handedness, results: ResultEntry[]) => CompletedAssessment;
  remove: (id: number) => void;
  getById: (id: number) => CompletedAssessment | undefined;
  clear: () => void;
}

function nextId(assessments: CompletedAssessment[]): number {
  if (assessments.length === 0) return 1;
  return Math.max(...assessments.map((a) => a.id ?? 0)) + 1;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      assessments: [],

      save(client, handedness, results) {
        const id = nextId(get().assessments);
        const entry: CompletedAssessment = {
          id,
          client,
          handedness,
          date: new Date().toISOString(),
          results,
        };
        set((state) => ({
          assessments: [entry, ...state.assessments],
        }));
        return entry;
      },

      remove(id) {
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        }));
      },

      getById(id) {
        return get().assessments.find((a) => a.id === id);
      },

      clear() {
        set({ assessments: [] });
      },
    }),
    {
      name: "spark-sfma-assessments",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);
