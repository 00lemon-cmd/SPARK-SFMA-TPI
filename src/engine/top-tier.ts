export const TT_ORDER = [
  "Cervical Flexion", "Cervical Extension", "Cervical Rotation L", "Cervical Rotation R",
  "UE Pattern 1 L", "UE Pattern 1 R", "UE Pattern 2 L", "UE Pattern 2 R",
  "Multi-Segmental Flexion", "Multi-Segmental Extension", "MS Rotation L", "MS Rotation R",
  "SLS L", "SLS R", "Deep Squat",
] as const;
export type TopTierTest = (typeof TT_ORDER)[number];
