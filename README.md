# All-In

Offline Texas Hold'em training for **macOS** and **Linux**. Learn theory in Study mode, then practice against AI opponents in Play mode with range guessing, EV coaching, and session hand-history export.

**Website:** [ganeshapp.github.io/allin](https://ganeshapp.github.io/allin/)  
**Built by:** [gapp](https://www.gapp.in)

## Features

- **Study** — Interactive curriculum from hand rankings through combinatorics and exploitative play
- **Play** — 6-max sandbox with TAG, LAG, Nit, and Calling Station bots (fixed per session)
- **Read Opponents** — Guess or peek bot type, hole cards, and range on a 13×13 matrix
- **EV Coach** — Advisory feedback on -EV decisions with equity and pot-odds math
- **Show Math** — Outs, combinatorics, and Monte Carlo equity anytime during a hand
- **Sessions** — Multi-hand play with chip carry-over, summary stats, and PokerStars-format export

## Download

Pre-built installers are on the [Releases](https://github.com/ganeshapp/allin/releases) page:

| Platform | File |
|----------|------|
| macOS (Apple Silicon & Intel) | `.dmg` |
| Ubuntu / Debian | `.deb` |
| Linux (portable) | `.AppImage` |

## Build from source

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/)
- macOS: Xcode Command Line Tools  
- Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`, etc. ([Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

### Run in development

```bash
npm install
npm run tauri dev
```

### Production build

```bash
npm run tauri build
```

Artifacts appear in `src-tauri/target/release/bundle/`.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Rust, Tauri 2
- **Game engine:** Custom Texas Hold'em logic with Monte Carlo equity

## License

MIT — see [LICENSE](LICENSE).

## Author

**gapp** — [www.gapp.in](https://www.gapp.in) · [GitHub](https://github.com/ganeshapp/allin)
