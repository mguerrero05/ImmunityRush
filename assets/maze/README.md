# Maze art assets — drop-in spec

Goal: get the maze looking like the reference render **while staying a real, playable
game**. The trick is to split the art into a **background** + **transparent sprites**,
instead of one baked picture. Drop files here and Claude wires them in (and aligns the
wall collisions to your background).

## 1. The background (most important — do this first)

**File:** `maze-bg.png` (or `.jpg`)

Export the **empty hospital maze environment only**:
- ✅ floor, walls, rooms, props (desks, sofas, plants, shelves, signs like "PHARMACY")
- ❌ NO HUD / logo / score / mission / legend / tip panels
- ❌ NO dashed path
- ❌ NO nurse, germs, boosters, or START/GOAL pads
- ❌ NO locked-door graphics over the doorways

Specs: isometric / 2.5D, roughly **1600×1000 px**, clean lighting. A solid or transparent
background is fine (the game frame sits behind it).

> Prompt tip: "top-down isometric hospital maze floor plan, walls and rooms with signs and
> props, **no characters, no icons, no UI, no path lines**, game background art, clean."

## 2. Transparent sprites (PNG, transparent background, one per file)

Put each movable/interactive thing on its own transparent PNG, same camera angle + scale
as the background:

| File | What |
| --- | --- |
| `sprite-germ.png` | the purple flu germ enemy |
| `sprite-shield.png` | vaccine shield booster |
| `sprite-speed.png` | speed ⚡ booster |
| `sprite-heart.png` | health ❤ booster |
| `sprite-family.png` | family token booster |
| `sprite-door-locked.png` | a locked door |
| `sprite-start.png` / `sprite-goal.png` | the START / GOAL floor pads |

Character sprites go in `assets/characters/` (see that folder's README):
`male-front.png`, `male-back.png`, `male-left.png`, `male-right.png` (and `female-*`).
Transparent background, same angle. (A single front render also works to start.)

Recommended sprite size: ~**128–256 px**, transparent, trimmed to the artwork.

## 3. What Claude does with them

- Places `maze-bg.png` behind the play area and **traces the walls from it** so the
  invisible collision matches what you see (you can walk exactly where the corridors are).
- Swaps the CSS germs/boosters/doors/characters for your sprites at their grid positions.
- Keeps the HUD panels, mission, score, legend, and buttons as real code (not baked in).

## 4. If you can only make ONE thing

Make **`maze-bg.png`** (section 1). That alone transforms the look; Claude keeps the rest
as sprites until you add them.
