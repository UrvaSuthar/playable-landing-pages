# playable-landing-pages

An agent skill for landing pages that people *play with* instead of scroll past.

![Promo: a generic landing page gets a NOPE stamp, then playable drum machine, plant and darkroom pages, six mechanics, and the install command](media/promo.gif)

<sub>▶ [Watch with sound (MP4)](media/promo.mp4)</sub>

Most generated landing pages look the same: a hero, three feature cards, fade-ins, a gradient. This skill teaches a coding agent a different method. The page becomes the product's core action, played as a toy, and every visual choice comes from the product's own world.

> A drum-machine app's page *is* a 16-step sequencer: tap the steps and the hero plays your beat. The palette comes from a vintage drum machine's panel, and the headline pulses on the kick.

## What's inside

```
SKILL.md                 the method: a 7-step recipe, quality floor, common mistakes
reference/mechanics.md   6 copy-paste mechanics, no dependencies
scripts/check.mjs        validates the skill (frontmatter, links, every snippet parses)
```

**Mechanics:** variable-font headline that swells under the cursor · a critter that flees your cursor and can be caught · a self-typing replica of the product's form · a DevTools-style box-model overlay · a FLIP-animated state board · a `/` command palette.

Every mechanic respects `prefers-reduced-motion` and works with a keyboard.

## Install

**Claude Code** (personal skill, available in every project):

```bash
git clone https://github.com/UrvaSuthar/playable-landing-pages ~/.claude/skills/playable-landing-pages
```

**Other agents** that read the [Agent Skills](https://agentskills.io) format (Codex, Copilot CLI, Gemini CLI, …):

```bash
git clone https://github.com/UrvaSuthar/playable-landing-pages ~/.agents/skills/playable-landing-pages
```

## Use

Ask for it in plain words:

```
Build a landing page for my invoicing app, playable-landing style.
```

or invoke it directly with `/playable-landing-pages`. The agent works out your product's core action and native world, derives a palette from it, builds the playable hero, and verifies it in a browser (screenshots, every interaction, zero console errors).

The skill deliberately says to re-derive everything per product. Two pages made with it shouldn't look alike.

## Contributing

New mechanics are welcome. Keep them dependency-free, reduced-motion safe and keyboard reachable, add a row to the quick-reference table in `SKILL.md`, and make sure `node scripts/check.mjs` passes.

## License

MIT. The promo video uses [Twemoji](https://github.com/jdecked/twemoji) graphics, licensed CC-BY 4.0.
