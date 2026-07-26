# Character hero art (optional drop-in)

The home screen shows a **hero portrait** of the selected character if the matching
image file exists here. If it does not, the game falls back to the built-in CSS
character automatically — nothing breaks either way.

## Files the game looks for

| Selected character | File to place here          |
| ------------------ | --------------------------- |
| Male               | `male-hero.png`             |
| Female             | `female-hero.png`           |

- Format: PNG (transparent background looks best, but a plain studio background is
  fine too — the portrait is shown inside a framed card).
- Recommended size: roughly 600–900 px tall, portrait orientation.
- Keep both characters the same proportions so they look consistent.

## How to add them

1. Save your character render as `male-hero.png` (and `female-hero.png`).
2. Put the file(s) in this folder: `assets/characters/`.
3. Refresh the game. Selecting Male/Female in **Customize Character** swaps the hero
   art on the home screen.

## Notes

- The hero art is a **fixed render** — it does not reflect the custom skin/hair/scrub
  colours chosen in Customize. The in-maze character (and the Customize live preview)
  is the built-in CSS character, which **does** reflect those colours.
- Removing a file simply returns that character to the CSS fallback.
