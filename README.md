In house SFMA clinical assessment tool with smart programming and clinical reporting - referencing SFMA V26.5

## Work-ready baseline included

- Staff-only access gate via password login (`/login`) when `STAFF_ACCESS_PASSWORD` is set.
- Informed consent confirmation required before starting an assessment.
- Local audit trail (assessment/report/export events) with JSON export.
- Local retention pruning for saved assessments (default `90` days).

## Environment variables

Create `.env.local` for local development, and set the same values in production:

```bash
STAFF_ACCESS_PASSWORD=replace-with-strong-password
NEXT_PUBLIC_RETENTION_DAYS=90
```

If `STAFF_ACCESS_PASSWORD` is missing, the app stays open (no login gate) to avoid accidental lockout during setup.
