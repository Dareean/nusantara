# DESIGN.md — NUSANTARA: BEFORE IT'S GONE

Design direction: **minimalist, clean, sophisticated, immersive.** The site should feel closer to a quiet documentary than a busy cultural-tourism site. Culture is treated with weight and dignity — not decorated with folkloric clichés (no generic batik-pattern borders, no stock "tropical" gradients).

---

## 1. Design Principles

1. **Restraint over decoration.** Large whitespace, a strong single focal point per screen, typography as the primary design tool.
2. **Gravity, not gimmick.** Risk indicators and lineage visuals should feel serious and human — never gamified with confetti or loud badges.
3. **Content earns color.** The palette stays neutral by default; color is reserved almost entirely for risk states and calls to action, so it carries real meaning instead of decoration.
4. **One idea per screen.** Landing sections, DNA views, and journey steps reveal one concept at a time (progressive disclosure), matching the platform's step-by-step "Capture → Structure → Learn → Practice → Transfer" logic.

---

## 2. Color System

Neutral-first palette with a single warm accent (rooted in natural fiber/wood tones, evoking craft) and a strict semantic risk scale.

```
--color-bg:            #FAF9F6   /* warm off-white, not pure white */
--color-bg-dark:       #14120F   /* near-black warm dark mode bg */
--color-surface:       #FFFFFF
--color-surface-dark:  #1E1B17

--color-text-primary:   #1A1815
--color-text-secondary: #6B655C
--color-text-inverse:   #F5F2EC

--color-accent:         #A8522E   /* terracotta / burnt clay — craft, earth, warmth */
--color-accent-hover:   #8C4425

--color-border:          #E7E2D8
```

**Risk scale (semantic — used only for risk levels, never decoratively):**
```
--risk-critical: #C23B22   /* red-clay red */
--risk-high:     #D98A3D   /* amber-orange */
--risk-warning:  #D9B23D   /* muted gold */
--risk-healthy:  #4E7A51   /* deep sage green */
```

Dark mode inverts backgrounds/text but keeps the accent and risk colors identical for consistency of meaning.

---

## 3. Typography

- **Display / headings:** a serif with quiet authority (e.g. "Fraunces," "Source Serif 4," or "Lora") — used for hero statements like *"What if tomorrow, nobody remembers how?"*. Large size, generous line-height, never bold-heavy — let scale carry weight instead of boldness.
- **Body / UI:** a clean humanist sans (e.g. "Inter," "Public Sans") for readability in dense knowledge content, forms, and interview transcripts.
- **Scale (approx., desktop):**
  - Hero: 56–72px, serif, line-height 1.05
  - H1: 40px / H2: 28px / H3: 20px — serif for H1–H2, sans for H3 and below
  - Body: 16–18px, sans, line-height 1.6
  - Caption/meta: 13px, sans, letter-spacing +0.02em, uppercase for labels like "KNOWLEDGE AT RISK"

---

## 4. Spacing & Layout

- 8px base grid.
- Generous section padding: 96–160px vertical on desktop between major landing sections; content never touches the viewport edge (min 24px gutter on mobile).
- Max content width ~1120px for reading-heavy views (Knowledge DNA, interviews); narrower ~720px for the learning path / step-by-step flow to keep focus.
- Cards (Knowledge at Risk, Mentor match) use flat surfaces with a thin 1px border rather than heavy drop shadows — sophistication over skeuomorphism.

---

## 5. Core Components & Patterns

### 5.1 Knowledge at Risk card
Minimal card: title, three stat labels (Known practitioners / Apprentices / Documentation %), a single risk-color left border or small dot (not a loud badge), and one clear CTA ("Save the Knowledge"). No imagery required if none exists — typography alone should carry gravity.

### 5.2 Knowledge DNA view
Tabbed or accordion structure across Technique / Knowledge / Meaning / Story / People / Variations — one section expanded at a time. Avoid a cluttered tree diagram in the UI; the tree structure from the brief is a content model, not necessarily a literal visual (a simple vertical accordion reads calmer).

### 5.3 Risk Radar (dashboard)
Four horizontal bands (Critical/High/Warning/Healthy) with counts, ordered by severity top-to-bottom. Use the risk color only as a small indicator, not to fill entire card backgrounds — avoid alarm-fatigue.

### 5.4 Teach Me / learning path
Numbered step list with a slim progress bar ("2/5 complete"). Steps unlock sequentially; completed steps get a quiet check, not a celebratory animation.

### 5.5 Knowledge Lineage
Vertical timeline, generous spacing between generations, each node showing name + era label. The user's own node ("YOU") is visually distinguished only by the accent color, not by size or ornamentation — they're one link in the chain, not the hero.

### 5.6 Find My Mentor
Ranked list, match % shown as a simple number (not a gauge/speedometer graphic — keep it calm), with holder name, one-line expertise summary, and a "Request mentorship" CTA.

### 5.7 Cultural Consent control
Simple radio/select control with plain-language labels (Public / Community Only / Apprentice Only / Restricted / Do Not Document) and a one-line explanation of what each means — this is a trust-building UI moment, treat it with clarity, not legalese.

---

## 6. Motion

Motion is used sparingly and only to support meaning:
- Fade + slight upward translate (8–12px) on scroll-reveal for landing sections — 300–400ms, ease-out.
- No parallax gimmicks, no bouncy easing.
- Lineage timeline may draw its connecting line progressively on scroll — this is the one moment worth a deliberate animation, since it visually reinforces "continuity."

---

## 7. Voice & Tone in UI Copy

- Direct, unsentimental sentences that let the facts carry emotional weight (e.g. "Only 2 known practitioners" rather than exclamation-heavy copy).
- Section headers as short declarative phrases: "FROM MEMORY", "TO KNOWLEDGE", "TO SKILL", "TO GENERATION", "STILL ALIVE".
- Avoid tourism-brochure language ("amazing," "explore the wonders of"). Prefer documentary/field-notes register.

---

## 8. Accessibility

- Maintain WCAG AA contrast for all text against `--color-bg` / `--color-bg-dark`.
- Risk colors are paired with text labels (not color alone) to remain colorblind-safe.
- All interview media (audio/video) must have a text transcript path, since Capture Memory content should remain readable, not just watchable.
