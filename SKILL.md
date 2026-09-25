---
name: playable-landing-pages
description: Use when building a landing page, product page, or showcase site that should feel nerdy, fully animated, playful, interactive, or "rule-breaking" instead of a static marketing layout, or when the user asks for a page in the playable-landing style.
---

# Playable landing pages

## Overview
The page *is* the product's core action, played as a toy. Every visual choice comes from the product's own world, never from a trend. Boldness goes into one playable moment; everything else stays disciplined.

Copy-paste mechanics live in `reference/mechanics.md`. Read it when building.

## The recipe

1. **Find the product's verb.** What does a user *do* with it? (Plant-care app → water a plant. Invoicing → send and get paid. Scheduler → drop something onto a time.)
2. **Find its native tool or world.** The environment its users already live in: developers → the browser inspector. Finance → the ledger or ticker. Music → the mixer. Photography → the darkroom.
3. **Derive the palette from that world's real artifacts.** For example, a drum-machine app takes its panel: cream keys, orange step lights, a dark steel case. A darkroom app takes safelight red and fixer-tray grey. Name 5–8 tokens on `:root`. Any product replica uses the product's real UI colors.
4. **Make the hero playable.** Turn the verb into a 5-second game whose result is a faithful replica of the real output: a form that fills itself with the visitor's real browser/OS/viewport, then the real-looking result appears.
5. **Break 3–4 rules on purpose, each tied to the subject.** Examples: an inspect overlay on everything, sideways section titles, a critter that runs from the cursor, a `/` command palette. A broken rule with no link to the subject is noise.
6. **Explain honestly with real payloads.** A numbered pipeline of the true flow (real endpoints and data shapes; numbers only because it is a real sequence), plus a working mini-demo of the product's states.
7. **Type:** one variable display face used *actively* (weight/width reacting to the cursor), plus a mono only for real code. Copy stays plain, specific and short.

## Quick reference
| Want | Mechanic in `reference/mechanics.md` |
|---|---|
| Headline that reacts to the cursor | Variable-font swell |
| The hero toy | Fleeing critter, then catch |
| The product doing its job | Self-typing replica form |
| Nerdy "everything is inspectable" | DevTools box-model overlay |
| States that visibly change | FLIP state board |
| Power-user feel | `/` command palette |

## Quality floor (non-negotiable)
- `prefers-reduced-motion`: everything still works and is readable, and animations become instant.
- Keyboard: toys are `<button>`s, and Esc/Enter/arrows work in overlays. Focus is visible.
- Works at 375px wide, with no horizontal scroll.
- Hover effects skip huge elements, so the screen never gets fully tinted.
- Cancel really cancels (no half-finished flows or stuck state).
- Verify: serve locally, then use Playwright to take screenshots (hero, mid-animation, full page), click every interaction, and confirm zero console errors.

## Common mistakes
- Reusing one project's palette or critter on an unrelated product. Re-derive from the new subject every time.
- Scattered fade-ins everywhere instead of one playable moment.
- A replica that doesn't match the real product (wrong fields or labels).
- Off-screen fixed elements (trays, toasts) peeking into view. Hide them with `visibility`, not only `transform`.
- Dead UI left in (unused toasts or chips). Delete it.
