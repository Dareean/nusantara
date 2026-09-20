# AGENT.md — NUSANTARA: BEFORE IT'S GONE

Instructions for any AI coding agent (Claude Code, Cursor, etc.) working on this repository. Read `PRD.md`, `design.md`, and `database_schema.sql` in this same folder before writing code — they are the source of truth for scope, visuals, and data model.

---

## 1. Project Summary

A Next.js web app for a cultural competition (deadline ~Oct 1–2, 2026). It is **not** a content archive — every feature must reinforce the core loop:

```
Capture → Structure (Knowledge DNA) → Learn (Teach Me) → Practice (Apprenticeship) → Transfer (Become the Next) → Continuity
```

If a feature you're about to build doesn't visibly serve this loop, stop and check the PRD's MVP scope (§9) before building it.

## 2. Tech Stack (fixed — do not substitute without asking)

- **Framework:** Next.js, App Router (`app/` directory, Server Components by default, Client Components only where interactivity requires it)
- **Styling:** Tailwind CSS, using tokens defined in `design.md` §2–3 as CSS variables / `tailwind.config` theme extension — never hardcode hex colors in components
- **Database:** PostgreSQL via Supabase, schema in `database_schema.sql`
- **Auth:** Supabase Auth, mapped to `users.auth_user_id`
- **AI:** Single-purpose LLM calls with structured JSON output (see §5) — do not build a chat interface; AI is a background structuring tool, not a chatbot persona
- **Hosting:** Vercel

## 3. Repository Conventions

- **Filename casing matters — be exact.** Use consistent casing for hooks/components (e.g. `useKnowledgeRisk.ts`, not `useknowledgeRisk.ts` or inconsistent casing across imports vs. filenames). Mismatched casing works on case-insensitive local filesystems but breaks on Vercel's case-sensitive Linux builds.
- Component structure: `app/(routes)/...`, shared UI in `components/ui/`, feature-specific components in `components/<feature>/` (e.g. `components/knowledge-dna/`, `components/risk-radar/`).
- Server actions / data access in `lib/data/<entity>.ts`, one file per main table group (e.g. `lib/data/knowledge.ts`, `lib/data/apprenticeships.ts`).
- Types generated or hand-written in `types/database.ts` mirroring `database_schema.sql` exactly — if you change the schema, update both files together in the same change.

## 4. Data Model Notes (see database_schema.sql for full DDL)

- `knowledge` is the top-level cultural entity; everything else hangs off `knowledge_id`.
- `knowledge_dna_nodes` uses a single polymorphic table with `node_type` enum (`technique`, `knowledge_fact`, `meaning`, `story`, `people`, `variation`, `warning`, `terminology`) rather than 6+ separate tables — query by `node_type` when rendering each Knowledge DNA section.
- Current risk for a knowledge item is always read from the `v_knowledge_current_risk` view (latest snapshot), never by querying `knowledge_risk_snapshots` directly and assuming order.
- `consent_level` on `knowledge` is the default gate; `consent_grants` are exceptions. Always check consent server-side before rendering any non-public knowledge content — never trust a client-side check alone.
- `apprenticeships.status` is the canonical "Become the Next" state machine: `learner → apprentice → verified_carrier`. Do not invent parallel status fields elsewhere.

## 5. AI Structuring (Capture Memory feature)

Keep this to **one well-scoped LLM call**, not an agentic pipeline:

- Input: raw interview transcript (`interview_sessions.raw_transcript`) + the fixed list of guided interview questions asked.
- Output: strict JSON matching this shape (map directly to `knowledge_dna_nodes` rows):

```json
{
  "technique": [{"title": "", "content": ""}],
  "knowledge_fact": [{"title": "", "content": ""}],
  "meaning": [{"title": "", "content": ""}],
  "story": [{"title": "", "content": ""}],
  "people": [{"title": "", "content": "", "role_in_knowledge": ""}],
  "variation": [{"title": "", "content": ""}],
  "warning": [{"title": "", "content": ""}]
}
```

- Always store the raw LLM output against `interview_dna_outputs` for traceability, and require `reviewed_by_human = true` before the generated nodes are shown as published knowledge — a human (the interviewer or holder) confirms accuracy before anything goes live. This matters for a cultural-sensitivity competition entry: never auto-publish AI-structured content about someone's living heritage without review.
- If AI structuring isn't finished in time for the deadline, the Capture Memory flow must still work as a manual structured-entry form (the AI step is an enhancement, not a hard dependency for MVP demo-ability).

## 6. Mentor Matching (Find My Mentor)

Start with a transparent, explainable heuristic — not a black-box model:

```
score = w1*expertise_match + w2*location_proximity + w3*language_match + w4*availability_match
```

Store the breakdown in `mentor_match_results.score_breakdown` (jsonb) so the UI can show *why* a match scored well — this supports the design principle of clarity over gimmick. Do not present this as "AI matching" in copy unless it genuinely uses a model; a heuristic is fine and should be described plainly.

## 7. Risk Score Computation

Formula and thresholds live in application config (e.g. `lib/config/risk.ts`), **not** hardcoded in SQL or scattered across components, so juries/reviewers and future contributors can find and adjust the logic in one place. Reference formula is in `database_schema.sql` §4 comments — implement it there, write a snapshot row on each recompute, never mutate old snapshots.

## 8. Build Priority Order (align with PRD §9 MVP scope)

Build in this order so there is always a demoable product, even if time runs out:

1. Landing page + Knowledge at Risk feed (seed data OK)
2. One complete Knowledge DNA page for a real case study
3. Teach Me learning path + progress tracking
4. Knowledge Lineage timeline
5. Become the Next status flow (manual admin verification is fine for MVP)
6. Find My Mentor (heuristic matching)
7. Capture Memory (manual form first, AI structuring layered in after)
8. Cultural Consent controls

Do not start feature 7 or 8 before 1–6 are demoable end-to-end — a working narrow slice beats several half-built features when presenting to judges.

## 9. What Not to Build for This Competition

Per PRD §9, treat these as out-of-scope unless there is spare time after the list above is solid: Knowledge Gap analytics, Culture Lab, Cultural Connection graph, Cultural Continuity Index dashboard. If asked to add these, confirm it's intentional scope creep before building, since the deadline is tight.

## 10. Design Compliance

Every UI surface must follow `design.md`: neutral palette + single terracotta accent, serif display type for emotional headlines, sans for UI/body, risk colors used only semantically (never decoratively), minimal motion, and documentary-register copy (no tourism-brochure language, no exclamation-heavy microcopy). When in doubt, prefer removing an element over adding a decorative one.
