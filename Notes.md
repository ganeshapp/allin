# Product Requirements Document: "All-In" (Desktop Poker Training App)

## 1. Product Overview

**Name:** All-In (Working Title)
**Platform:** Desktop Offline Application (macOS/Ubuntu)
**Core Value Proposition:** A gamified, offline-first Texas Hold'em training application that takes a user from beginner to advanced via a simulated "Sandbox" playing environment, interactive range guessing, and an Expected Value (EV) inline coach.
----

## 2. Core Modules & Features

### Module A: The Theoretical Curriculum (The "Study" Tab)

A structured, linear progression system. The UI should look like a modern LMS (Learning Management System) path.

* **Level 1 (Basics):** Text/interactive modules on Rules, Hand Rankings, Positional Awareness, and Bankroll Management.
* **Level 2 (Preflop):** Introduction to the 13x13 Range Matrix. Visual guides on opening ranges by position.
* **Level 3 (Postflop):** Board textures (Wet/Dry), C-betting logic, Pot Odds calculators.
* **Level 4 (Advanced):** Combinatorics, Blockers, and Exploitative adjustments vs. specific bot archetypes.

### Module B: The Sandbox Game Loop (The "Play" Tab)

The core feature of the app. A fully functional 6-max or 9-max poker table interface playing against AI bots.

* **Bot Spawner:** The engine dynamically assigns one of 4 archetypes to each seat based on VPIP (Voluntarily Put in Pot) and PFR (Preflop Raise) parameters:
* *TAG (Tight Aggressive):* Low VPIP, High PFR.
* *LAG (Loose Aggressive):* High VPIP, High PFR.
* *Nit:* Very Low VPIP, Low PFR.
* *Calling Station:* High VPIP, Very Low PFR.


* **Dynamic HUD (Heads Up Display):** Displays the bot's VPIP/PFR stats overlaying their avatar so the user learns to read HUD stats while playing.

### Module C: The "Peek & Guess" Mechanic

An interruptible event during the game loop to test hand reading.

1. **Trigger:** User clicks "Guess Range" during any street (Preflop, Flop, Turn, River) before making their action.
2. **Input:** A 13x13 matrix modal opens. The user paints the matrix with the hands they believe the specific bot holds based on the action so far.
3. **Validation:** User clicks "Peek". The app reveals the bot's actual programmed range matrix *and* their exact two hole cards.
4. **Scoring:** An algorithm calculates the overlap percentage between the user's painted range and the bot's actual range, awarding an "Accuracy Score."

### Module D: The Inline EV Coach

An active background process that critiques the user's decisions.

* **The Math:** When the user makes an action (e.g., Calls a bet), the Rust backend runs a quick Monte Carlo simulation comparing the user's exact hand equity against the bot's perceived range on the current board.
* **The Trigger:** If the user takes an action that has a negative Expected Value (-EV) compared to folding, the game pauses.
* **The UI:** A slide-out panel appears explaining the math: *"Mistake. Against a TAG profile raising from Early Position, your $A\heartsuit J\clubsuit$ only has 28% equity. Calling here costs you $1.50 in EV."*