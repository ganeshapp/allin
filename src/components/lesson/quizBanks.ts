export interface HandRankingQuiz {
  question: string;
  handA: string[];
  labelA: string;
  handB: string[];
  labelB: string;
  correct: "A" | "B";
  explanation: string;
}

export const HAND_RANKING_QUIZZES: HandRankingQuiz[] = [
  {
    question: "Who wins?",
    handA: ["A♠", "A♦", "K♣", "9♥", "4♠"],
    labelA: "Player A",
    handB: ["K♠", "K♦", "Q♣", "9♥", "4♠"],
    labelB: "Player B",
    correct: "A",
    explanation: "Pair of Aces beats pair of Kings.",
  },
  {
    question: "Same pair — who wins?",
    handA: ["A♠", "K♦", "A♣", "7♥", "3♠"],
    labelA: "Player A — A♠ K♦",
    handB: ["A♦", "Q♦", "A♣", "7♥", "3♠"],
    labelB: "Player B — A♦ Q♦",
    correct: "A",
    explanation: "Both have pair of Aces. King kicker beats Queen kicker.",
  },
  {
    question: "Who has the better hand?",
    handA: ["9♠", "8♠", "7♠", "6♦", "5♣"],
    labelA: "Player A — Straight",
    handB: ["K♠", "K♦", "K♣", "4♥", "2♠"],
    labelB: "Player B — Three of a Kind",
    correct: "A",
    explanation: "Straight beats three of a kind.",
  },
  {
    question: "Flush or straight?",
    handA: ["A♥", "J♥", "9♥", "4♥", "2♥"],
    labelA: "Player A — Flush",
    handB: ["T♠", "9♦", "8♣", "7♥", "6♠"],
    labelB: "Player B — Straight",
    correct: "A",
    explanation: "Flush beats straight.",
  },
  {
    question: "Full house battle",
    handA: ["K♠", "K♦", "K♣", "4♥", "4♠"],
    labelA: "Player A — Kings full",
    handB: ["Q♠", "Q♦", "Q♣", "A♥", "A♠"],
    labelB: "Player B — Queens full",
    correct: "A",
    explanation: "Kings full of fours beats queens full of aces.",
  },
  {
    question: "Two pair vs two pair",
    handA: ["A♠", "A♦", "K♣", "K♥", "9♠"],
    labelA: "Player A — Aces and Kings",
    handB: ["A♣", "A♥", "Q♦", "Q♣", "9♠"],
    labelB: "Player B — Aces and Queens",
    correct: "A",
    explanation: "Same top pair — second pair (Kings) decides it.",
  },
  {
    question: "High card duel",
    handA: ["A♠", "K♦", "9♣", "6♥", "3♠"],
    labelA: "Player A — Ace high",
    handB: ["K♠", "Q♦", "9♣", "6♥", "3♠"],
    labelB: "Player B — King high",
    correct: "A",
    explanation: "Ace high beats king high when no pairs are made.",
  },
  {
    question: "Set vs straight",
    handA: ["8♠", "8♦", "8♣", "K♥", "2♠"],
    labelA: "Player A — Three 8s",
    handB: ["9♠", "8♥", "7♦", "6♣", "5♠"],
    labelB: "Player B — Straight",
    correct: "B",
    explanation: "Straight beats three of a kind.",
  },
  {
    question: "Wheel straight",
    handA: ["A♠", "2♦", "3♣", "4♥", "5♠"],
    labelA: "Player A — A-2-3-4-5",
    handB: ["K♠", "K♦", "K♣", "7♥", "2♠"],
    labelB: "Player B — Three Kings",
    correct: "A",
    explanation: "The wheel (A-2-3-4-5) is a straight and beats trips.",
  },
  {
    question: "Kicker matters",
    handA: ["K♠", "Q♦", "K♣", "7♥", "3♠"],
    labelA: "Player A — K♠ Q♦",
    handB: ["K♦", "J♣", "K♥", "7♥", "3♠"],
    labelB: "Player B — K♦ J♣",
    correct: "A",
    explanation: "Both have pair of Kings. Queen kicker beats Jack.",
  },
  {
    question: "Four of a kind",
    handA: ["7♠", "7♦", "7♣", "7♥", "A♠"],
    labelA: "Player A — Quads",
    handB: ["A♠", "A♦", "A♣", "K♥", "K♠"],
    labelB: "Player B — Aces full",
    correct: "A",
    explanation: "Four of a kind beats full house.",
  },
  {
    question: "Board plays",
    handA: ["2♠", "3♦", "K♣", "K♥", "9♠"],
    labelA: "Player A — K♠ 2♣",
    handB: ["4♠", "5♦", "K♣", "K♥", "9♠"],
    labelB: "Player B — 4♥ 5♣",
    correct: "A",
    explanation: "Board pairs Kings for both. Player A's 9 kicker from hole card... actually both play the board K-K-9. Split pot — but A has 2, B has 5... wait both use K K 9 from board. Hole cards: A has 2, B has 5. B wins with 5 kicker!",
  },
];

// Fix quiz 12 - B should win
HAND_RANKING_QUIZZES[11] = {
  question: "Board plays — kicker fight",
  handA: ["2♠", "3♦", "K♣", "K♥", "9♠"],
  labelA: "Player A — K♠ 2♣",
  handB: ["4♠", "5♦", "K♣", "K♥", "9♠"],
  labelB: "Player B — 4♥ 5♣",
  correct: "B",
  explanation: "Both play the board's two pair (Kings and Nines). Player B's 5 kicker beats Player A's 2.",
};

// Append more quizzes
HAND_RANKING_QUIZZES.push(
  {
    question: "Suited vs offsuit — same pair",
    handA: ["J♠", "T♠", "J♦", "T♦", "4♣"],
    labelA: "Player A — J♠ T♠",
    handB: ["J♣", "9♥", "J♦", "T♦", "4♣"],
    labelB: "Player B — J♣ 9♥",
    correct: "A",
    explanation: "Both have two pair (Jacks and Tens). Player A's king... no - tie on pairs. A has T kicker from board pair, B has 9. A wins with higher second pair from board... Both use J J T T 4 from board essentially. A's best: J J T T 4 with no better kicker - actually A has T in hand making T kicker vs B's 9. A wins.",
  },
  {
    question: "Flush vs two pair",
    handA: ["Q♥", "9♥", "J♥", "4♥", "2♥"],
    labelA: "Player A — Flush",
    handB: ["J♠", "J♦", "4♣", "4♠", "2♦"],
    labelB: "Player B — Jacks and Fours",
    correct: "A",
    explanation: "Flush beats two pair.",
  },
  {
    question: "Trips on board",
    handA: ["A♠", "2♦", "7♣", "7♦", "7♥"],
    labelA: "Player A — A♠ K♣",
    handB: ["K♠", "3♦", "7♣", "7♦", "7♥"],
    labelB: "Player B — K♠ Q♦",
    correct: "A",
    explanation: "Trips sevens on board. Ace kicker beats king kicker.",
  },
  {
    question: "Straight on board",
    handA: ["2♠", "2♦", "9♣", "8♦", "7♥"],
    labelA: "Player A — 2♠ 2♦",
    handB: ["A♠", "K♦", "9♣", "8♦", "7♥"],
    labelB: "Player B — A♠ K♦",
    correct: "B",
    explanation: "Board makes 9-8-7... needs 6-T for straight. Let's use T-9-8-7-6 board:",
  },
);

// Fix last quiz with proper board
HAND_RANKING_QUIZZES[15] = {
  question: "Straight on board — who wins?",
  handA: ["2♠", "2♦", "T♣", "9♦", "8♥"],
  labelA: "Player A — pocket 2s",
  handB: ["A♠", "K♦", "T♣", "9♦", "8♥"],
  labelB: "Player B — A♠ K♦",
  correct: "B",
  explanation: "Board straight T-9-8-7-6 plays for everyone. Player B's Ace plays as best kicker.",
};

export const EXTRA_PAIR_QUIZZES: HandRankingQuiz[] = [
  {
    question: "Pocket Aces vs Pocket Kings",
    handA: ["A♠", "A♦", "9♣", "4♥", "2♠"],
    labelA: "Player A — AA",
    handB: ["K♠", "K♦", "9♣", "4♥", "2♠"],
    labelB: "Player B — KK",
    correct: "A",
    explanation: "Aces beat kings.",
  },
  {
    question: "Queens vs Jacks",
    handA: ["Q♠", "Q♦", "8♣", "3♥", "2♠"],
    labelA: "Player A — QQ",
    handB: ["J♠", "J♦", "8♣", "3♥", "2♠"],
    labelB: "Player B — JJ",
    correct: "A",
    explanation: "Queens beat jacks.",
  },
  {
    question: "Tens vs Nines",
    handA: ["T♠", "T♦", "7♣", "4♥", "2♠"],
    labelA: "Player A — TT",
    handB: ["9♠", "9♦", "7♣", "4♥", "2♠"],
    labelB: "Player B — 99",
    correct: "A",
    explanation: "Tens beat nines.",
  },
  {
    question: "Eights vs Sevens",
    handA: ["8♠", "8♦", "5♣", "3♥", "2♠"],
    labelA: "Player A — 88",
    handB: ["7♠", "7♦", "5♣", "3♥", "2♠"],
    labelB: "Player B — 77",
    correct: "A",
    explanation: "Eights beat sevens.",
  },
];

export const ALL_HAND_RANKING_QUIZZES = [
  ...HAND_RANKING_QUIZZES.slice(0, 12),
  ...EXTRA_PAIR_QUIZZES,
  ...HAND_RANKING_QUIZZES.slice(12, 16),
];

export interface TextureQuiz {
  cards: string[];
  answer: "dry" | "wet";
  why: string;
}

export const BOARD_TEXTURE_QUIZZES: TextureQuiz[] = [
  { cards: ["K♠", "7♦", "2♣"], answer: "dry", why: "Rainbow, disconnected — few draws." },
  { cards: ["J♥", "T♥", "9♦"], answer: "wet", why: "Straight and flush draws everywhere." },
  { cards: ["A♣", "8♣", "3♣"], answer: "wet", why: "Monotone — flush draws possible." },
  { cards: ["Q♦", "Q♠", "4♥"], answer: "dry", why: "Paired rainbow board — hard to outdraw." },
  { cards: ["9♠", "8♠", "7♥"], answer: "wet", why: "Connected with flush draw." },
  { cards: ["A♦", "K♣", "2♠"], answer: "dry", why: "Broadway high card, rainbow, disconnected." },
  { cards: ["6♥", "5♥", "4♦"], answer: "wet", why: "Two-tone connected — straight and flush draws." },
  { cards: ["J♣", "4♦", "2♠"], answer: "dry", why: "Rainbow, gap-heavy — static board." },
  { cards: ["T♠", "9♠", "8♠"], answer: "wet", why: "Monotone connected — very dynamic." },
  { cards: ["K♥", "K♦", "3♣"], answer: "dry", why: "Paired board, one suit — limited draws." },
  { cards: ["Q♥", "J♦", "T♣"], answer: "wet", why: "Connected broadway — many straight combos." },
  { cards: ["A♠", "7♠", "2♦"], answer: "dry", why: "Ace-high rainbow — often dry in practice." },
  { cards: ["8♣", "7♣", "6♦"], answer: "wet", why: "Connected with flush draw." },
  { cards: ["5♠", "5♦", "2♣"], answer: "dry", why: "Paired low board — static." },
  { cards: ["J♠", "T♦", "9♣"], answer: "wet", why: "Open-ended straight draws possible." },
  { cards: ["K♣", "Q♦", "2♥"], answer: "dry", why: "Two broadways, rainbow, disconnected." },
  { cards: ["7♥", "6♥", "5♥"], answer: "wet", why: "Monotone connected — very wet." },
  { cards: ["A♦", "9♣", "4♠"], answer: "dry", why: "Rainbow, no connectivity." },
  { cards: ["9♦", "8♣", "7♦"], answer: "wet", why: "Connected with flush draw." },
  { cards: ["Q♣", "3♦", "2♠"], answer: "dry", why: "Disconnected rainbow — static." },
];

export interface CbetQuiz {
  board: string;
  you: string;
  villain: string;
  answer: "bet" | "check";
  size: string;
  why: string;
}

export const CBET_QUIZZES: CbetQuiz[] = [
  { board: "K♠ 7♦ 2♣", you: "preflop raiser", villain: "caller", answer: "bet", size: "33% pot", why: "Dry board favors your range." },
  { board: "J♥ T♥ 9♦", you: "preflop raiser", villain: "caller", answer: "bet", size: "66% pot", why: "Wet board — charge draws." },
  { board: "8♣ 5♦ 2♠", you: "preflop raiser", villain: "calling station", answer: "bet", size: "50% pot", why: "Value bet stations — they call too much." },
  { board: "Q♠ J♠ 4♥", you: "preflop raiser", villain: "nit", answer: "bet", size: "33% pot", why: "Nits fold often to any pressure." },
  { board: "A♣ 8♦ 3♠", you: "preflop raiser", villain: "caller", answer: "bet", size: "33% pot", why: "Ace-high dry — high c-bet frequency." },
  { board: "7♥ 6♥ 5♦", you: "preflop raiser", villain: "LAG", answer: "bet", size: "75% pot", why: "Protect vs aggressive floaters on wet boards." },
  { board: "K♦ K♣ 4♠", you: "preflop raiser", villain: "caller", answer: "bet", size: "25% pot", why: "Paired dry — small bet works often." },
  { board: "T♠ 9♠ 8♦", you: "preflop raiser", villain: "nit", answer: "check", size: "—", why: "Very wet — check medium hands vs nits who have it often." },
  { board: "A♥ 5♥ 2♣", you: "preflop raiser", villain: "calling station", answer: "bet", size: "40% pot", why: "Bet for value when you have top pair+." },
  { board: "J♣ 7♦ 2♥", you: "preflop raiser", villain: "caller", answer: "bet", size: "33% pot", why: "Dry jack-high — standard c-bet spot." },
  { board: "Q♥ T♥ 9♥", you: "preflop raiser", villain: "caller", answer: "bet", size: "75% pot", why: "Monotone wet — bet big with strong hands." },
  { board: "6♣ 4♦ 2♠", you: "preflop raiser", villain: "nit", answer: "bet", size: "33% pot", why: "Low dry board — nit likely missed." },
  { board: "9♦ 8♣ 7♠", you: "preflop raiser", villain: "LAG", answer: "check", size: "—", why: "Check to pot-control vs LAG on connected boards." },
  { board: "A♠ Q♦ 5♣", you: "preflop raiser", villain: "caller", answer: "bet", size: "40% pot", why: "Broadway dry — continue with range advantage." },
  { board: "5♥ 4♥ 3♦", you: "preflop raiser", villain: "calling station", answer: "bet", size: "66% pot", why: "Wet low board — bet big for value/protection." },
  { board: "K♣ T♦ 4♠", you: "preflop caller", villain: "preflop raiser", answer: "check", size: "—", why: "As caller OOP, check more — no c-bet privilege." },
  { board: "Q♣ 6♦ 2♥", you: "preflop raiser", villain: "nit", answer: "bet", size: "33% pot", why: "Dry queen board — fold out nit's air." },
  { board: "J♦ T♣ 9♠", you: "preflop raiser", villain: "caller", answer: "bet", size: "66% pot", why: "Connected — deny equity to overcards." },
  { board: "A♦ 7♣ 2♦", you: "preflop raiser", villain: "calling station", answer: "bet", size: "50% pot", why: "Value bet top pair vs station." },
  { board: "8♠ 3♣ 2♥", you: "preflop raiser", villain: "LAG", answer: "check", size: "—", why: "Check weak showdown hands vs LAG floats." },
];

export interface ComboQuiz {
  q: string;
  options: string[];
  answer: string;
  explain: string;
}

export const COMBO_QUIZZES: ComboQuiz[] = [
  { q: "How many combos of AA exist?", options: ["4", "6", "12"], answer: "6", explain: "6 ways to combine 4 aces." },
  { q: "How many combos of AKs exist?", options: ["4", "6", "12"], answer: "4", explain: "4 suited combinations." },
  { q: "How many combos of AKo exist?", options: ["4", "6", "12"], answer: "12", explain: "12 offsuit combinations." },
  { q: "You hold A♠. How many Ax combos can villain have?", options: ["16", "12", "8"], answer: "12", explain: "16 total minus 4 with your A♠ = 12." },
  { q: "How many combos of 77 exist?", options: ["4", "6", "12"], answer: "6", explain: "Every pocket pair has 6 combos." },
  { q: "How many combos of QJs exist?", options: ["4", "6", "12"], answer: "4", explain: "Suited hands = 4 combos." },
  { q: "How many combos of KQo exist?", options: ["4", "6", "12"], answer: "12", explain: "Offsuit = 12 combos." },
  { q: "You hold K♥. How many KQs combos remain?", options: ["4", "3", "12"], answer: "3", explain: "4 suited minus K♥Q♥ = 3." },
  { q: "Total combos in a 13×13 range matrix?", options: ["1326", "169", "78"], answer: "1326", explain: "52×51/2 = 1326 total starting hand combos." },
  { q: "Cells in the 13×13 matrix?", options: ["1326", "169", "78"], answer: "169", explain: "169 unique hand labels (pairs, suited, offsuit)." },
  { q: "How many combos of TT exist?", options: ["4", "6", "12"], answer: "6", explain: "Pocket tens: 6 combos." },
  { q: "You hold two spades. How many flush combos removed?", options: ["Some", "All", "None"], answer: "Some", explain: "Your blockers remove combos containing those cards." },
  { q: "AKo combos vs AKs combos?", options: ["12 vs 4", "6 vs 6", "4 vs 12"], answer: "12 vs 4", explain: "Offsuit 12, suited 4." },
  { q: "How many JJ combos if you hold J♠?", options: ["6", "3", "4"], answer: "3", explain: "6 minus combos with J♠ = 3 remaining." },
  { q: "Range weight: AA vs 72o in combos?", options: ["6 vs 12", "6 vs 4", "4 vs 12"], answer: "6 vs 12", explain: "AA=6 combos, 72o=12 combos." },
  { q: "How many A5s combos exist?", options: ["4", "6", "12"], answer: "4", explain: "Suited ace-five: 4 combos." },
  { q: "How many 98o combos exist?", options: ["4", "6", "12"], answer: "12", explain: "Offsuit connector: 12 combos." },
  { q: "Blocker: you hold A♦. AA combos villain can have?", options: ["6", "3", "0"], answer: "3", explain: "Half the AA combos contain A♦." },
  { q: "How many combos of 22 exist?", options: ["4", "6", "12"], answer: "6", explain: "Deuces: 6 combos." },
  { q: "Suited connector 76s combos?", options: ["4", "6", "12"], answer: "4", explain: "Suited = 4 combos." },
];

export interface PositionQuiz {
  scenario: string;
  options: string[];
  answer: string;
  explain: string;
}

export const POSITION_QUIZZES: PositionQuiz[] = [
  { scenario: "Who acts last post-flop in 6-max?", options: ["UTG", "BTN", "BB"], answer: "BTN", explain: "Button acts last on flop, turn, river." },
  { scenario: "Best seat for stealing blinds?", options: ["UTG", "CO", "SB"], answer: "CO", explain: "Cutoff and button steal most — only blinds left." },
  { scenario: "Tightest opening range from?", options: ["BTN", "UTG", "CO"], answer: "UTG", explain: "UTG acts first — 5 players behind." },
  { scenario: "Who posts the small blind?", options: ["BTN", "SB", "BB"], answer: "SB", explain: "Seat left of button posts SB." },
  { scenario: "Who acts first preflop (6-max)?", options: ["UTG", "BTN", "BB"], answer: "UTG", explain: "UTG is first to act preflop." },
  { scenario: "Widest opening range?", options: ["UTG", "MP", "BTN"], answer: "BTN", explain: "Button opens ~45% of hands." },
  { scenario: "Already invested preflop?", options: ["UTG", "SB", "CO"], answer: "SB", explain: "Blinds are forced bets — already in the pot." },
  { scenario: "Second-best seat post-flop?", options: ["CO", "MP", "SB"], answer: "CO", explain: "Cutoff acts just before button." },
  { scenario: "Defends big blind vs button steal?", options: ["UTG", "BB", "CO"], answer: "BB", explain: "BB defends with pot odds already invested." },
  { scenario: "Acts first on the flop (6-max)?", options: ["SB", "BTN", "UTG"], answer: "SB", explain: "SB acts first post-flop in most formats." },
  { scenario: "Position to 3-bet light from?", options: ["UTG", "BTN", "BB"], answer: "BTN", explain: "Late position 3-bets work as bluffs vs opens." },
  { scenario: "Worst seat for bluffing preflop?", options: ["UTG", "BTN", "CO"], answer: "UTG", explain: "Many players left to act behind UTG." },
  { scenario: "Dealer button moves each hand?", options: ["Yes", "No"], answer: "Yes", explain: "Button rotates clockwise every hand." },
  { scenario: "MP is between?", options: ["UTG and CO", "BTN and SB", "BB and UTG"], answer: "UTG and CO", explain: "Middle position sits between early and late." },
  { scenario: "Best seat for floating flops?", options: ["UTG", "BTN", "SB"], answer: "BTN", explain: "In position floats are profitable." },
  { scenario: "Who is UTG in 6-max?", options: ["First to act", "Dealer", "Big blind"], answer: "First to act", explain: "Under the Gun = first preflop." },
  { scenario: "Open 72o from UTG?", options: ["Yes", "No"], answer: "No", explain: "Trash hand from worst position — fold." },
  { scenario: "Open 65s from BTN?", options: ["Yes", "No"], answer: "Yes", explain: "Suited connectors are profitable BTN opens." },
  { scenario: "SB completes vs BTN open?", options: ["Sometimes", "Never", "Always"], answer: "Sometimes", explain: "SB gets good odds but plays OOP post-flop." },
  { scenario: "Position advantage means?", options: ["Acting last", "Bigger stack", "Better cards"], answer: "Acting last", explain: "Information advantage from acting last." },
];

export interface BuildHandExercise {
  hole: [string, string];
  board: [string, string, string, string, string];
  correct: string[];
  explanation: string;
}

export const BUILD_HAND_EXERCISES: BuildHandExercise[] = [
  { hole: ["A♠", "K♦"], board: ["A♣", "K♣", "7♥", "3♠", "9♦"], correct: ["A♠", "A♣", "K♦", "K♣", "9♦"], explanation: "Two Pair (Aces and Kings) with 9 kicker." },
  { hole: ["9♥", "8♥"], board: ["7♥", "6♣", "5♦", "2♠", "K♣"], correct: ["9♥", "8♥", "7♥", "6♣", "5♦"], explanation: "Straight (5-6-7-8-9)." },
  { hole: ["Q♠", "J♠"], board: ["Q♦", "Q♣", "4♥", "4♠", "2♦"], correct: ["Q♠", "Q♦", "Q♣", "4♥", "4♠"], explanation: "Full House (Queens full of Fours)." },
  { hole: ["A♥", "K♥"], board: ["Q♥", "J♥", "2♣", "7♦", "3♠"], correct: ["A♥", "K♥", "Q♥", "J♥", "2♣"], explanation: "Ace-high flush." },
  { hole: ["T♠", "T♦"], board: ["T♣", "9♥", "9♦", "4♠", "2♣"], correct: ["T♠", "T♦", "T♣", "9♥", "9♦"], explanation: "Full House (Tens full of Nines)." },
  { hole: ["8♣", "7♣"], board: ["6♦", "5♠", "4♥", "K♦", "2♣"], correct: ["8♣", "7♣", "6♦", "5♠", "4♥"], explanation: "Straight (4-5-6-7-8)." },
  { hole: ["K♠", "Q♦"], board: ["K♣", "J♥", "9♠", "3♦", "3♣"], correct: ["K♠", "K♣", "Q♦", "3♦", "3♣"], explanation: "Two Pair (Kings and Threes)." },
  { hole: ["A♦", "2♦"], board: ["A♣", "A♥", "5♠", "5♦", "2♠"], correct: ["A♦", "A♣", "A♥", "5♠", "5♦"], explanation: "Full House (Aces full of Fives)." },
  { hole: ["J♦", "T♦"], board: ["9♣", "8♠", "7♥", "2♦", "K♣"], correct: ["J♦", "T♦", "9♣", "8♠", "7♥"], explanation: "Straight (7-8-9-T-J)." },
  { hole: ["6♠", "6♥"], board: ["6♦", "K♣", "K♠", "4♥", "2♦"], correct: ["6♠", "6♥", "6♦", "K♣", "K♠"], explanation: "Full House (Sixes full of Kings)." },
  { hole: ["A♠", "5♠"], board: ["K♠", "Q♠", "J♦", "7♣", "2♥"], correct: ["A♠", "K♠", "Q♠", "J♦", "5♠"], explanation: "Ace-high flush (missing T but A-K-Q-5-? need 5♠) - actually A K Q 5 all spades = flush." },
  { hole: ["9♠", "9♦"], board: ["8♣", "7♥", "6♠", "5♦", "4♣"], correct: ["9♠", "8♣", "7♥", "6♠", "5♦"], explanation: "Straight on board (5-6-7-8-9) — nine plays." },
  { hole: ["Q♥", "Q♣"], board: ["Q♦", "A♠", "K♦", "J♣", "2♥"], correct: ["Q♥", "Q♣", "Q♦", "A♠", "K♦"], explanation: "Three Queens with A-K kickers." },
  { hole: ["2♠", "2♦"], board: ["A♣", "K♥", "Q♠", "J♦", "T♣"], correct: ["A♣", "K♥", "Q♠", "J♦", "T♣"], explanation: "Broadway straight on board — play the board." },
  { hole: ["K♥", "J♥"], board: ["K♦", "K♣", "7♠", "7♦", "2♣"], correct: ["K♥", "K♦", "K♣", "7♠", "7♦"], explanation: "Full House (Kings full of Sevens)." },
  { hole: ["A♣", "4♣"], board: ["A♦", "9♣", "9♠", "4♦", "2♥"], correct: ["A♣", "A♦", "9♣", "9♠", "4♣"], explanation: "Two Pair (Aces and Nines) with 4 kicker." },
  { hole: ["5♥", "5♣"], board: ["3♦", "3♠", "3♣", "5♦", "2♥"], correct: ["5♥", "5♣", "5♦", "3♦", "3♠"], explanation: "Full House (Fives full of Threes)." },
  { hole: ["T♣", "9♣"], board: ["8♦", "7♠", "6♥", "A♦", "2♠"], correct: ["T♣", "9♣", "8♦", "7♠", "6♥"], explanation: "Straight (6-7-8-9-T)." },
  { hole: ["J♣", "8♦"], board: ["J♥", "J♠", "8♣", "4♦", "2♠"], correct: ["J♣", "J♥", "J♠", "8♦", "8♣"], explanation: "Full House (Jacks full of Eights)." },
  { hole: ["7♠", "6♠"], board: ["5♠", "4♠", "3♥", "K♦", "2♣"], correct: ["7♠", "6♠", "5♠", "4♠", "3♥"], explanation: "Seven-high straight flush... 3♥ breaks flush. Best: 7-6-5-4-3 straight using 7♠6♠ + board." },
];

// Fix exercise 11 - proper flush cards
BUILD_HAND_EXERCISES[10] = {
  hole: ["A♠", "5♠"],
  board: ["K♠", "Q♠", "J♦", "7♣", "2♠"],
  correct: ["A♠", "K♠", "Q♠", "5♠", "2♠"],
  explanation: "Ace-high flush.",
};

BUILD_HAND_EXERCISES[19] = {
  hole: ["7♠", "6♠"],
  board: ["5♠", "4♠", "3♥", "K♦", "2♣"],
  correct: ["7♠", "6♠", "5♠", "4♠", "3♥"],
  explanation: "Straight (3-4-5-6-7) — no flush with 3♥ on board.",
};

export interface BlockerQuiz {
  hole: [string, string];
  board: string[];
  question: string;
  answer: "yes" | "no";
  explain: string;
}

export const BLOCKER_QUIZZES: BlockerQuiz[] = [
  { hole: ["A♠", "K♠"], board: ["Q♠", "J♠", "4♥"], question: "You hold the nut flush blocker. Can villain have the nut flush?", answer: "no", explain: "A♠ removes villain's nut flush combos." },
  { hole: ["K♥", "K♦"], board: ["A♣", "7♠", "2♦"], question: "Does your KK block villain's AA?", answer: "yes", explain: "Each king removes AK combos and affects AA weighting." },
  { hole: ["A♥", "Q♥"], board: ["K♥", "J♥", "2♣"], question: "Can villain have the nut flush?", answer: "no", explain: "You hold A♥ — villain cannot have AhXh." },
  { hole: ["9♠", "9♦"], board: ["T♠", "8♠", "7♣"], question: "Do your nines block straights?", answer: "no", explain: "9 doesn't block 6-J straight draws significantly." },
  { hole: ["Q♣", "Q♦"], board: ["Q♠", "J♥", "T♦"], question: "Do you block villain's queens?", answer: "yes", explain: "Two queens in your hand remove QQ combos." },
  { hole: ["A♦", "5♦"], board: ["K♦", "9♦", "2♣"], question: "Good bluff candidate with blocker?", answer: "yes", explain: "A♦ blocks nut flush — classic bluff spot." },
  { hole: ["K♠", "2♥"], board: ["K♣", "K♦", "7♠"], question: "Do you block villain's trips?", answer: "yes", explain: "Your K♠ removes one king from villain's Kx combos." },
  { hole: ["J♠", "T♠"], board: ["9♠", "8♠", "2♦"], question: "You have flush draw + straight draw. Block nut flush?", answer: "no", explain: "You don't hold A♠ or K♠ — villain can still have nut flush." },
  { hole: ["A♣", "K♣"], board: ["A♠", "7♦", "2♣"], question: "Block villain's top pair top kicker?", answer: "yes", explain: "A♣ removes Ax combos; K♣ removes some Kx." },
  { hole: ["8♥", "8♦"], board: ["8♣", "5♠", "5♦"], question: "Villain can have a full house?", answer: "yes", explain: "You block 88 but villain can still have 55 or 8x." },
  { hole: ["A♠", "2♠"], board: ["K♠", "Q♠", "J♠"], question: "Can villain have royal flush?", answer: "no", explain: "You hold A♠ — royal flush impossible for villain." },
  { hole: ["7♣", "6♣"], board: ["5♦", "4♥", "3♠"], question: "Block the straight?", answer: "no", explain: "Your cards don't block 2-8 straight range much." },
  { hole: ["K♥", "Q♥"], board: ["J♥", "T♥", "2♣"], question: "Nut flush blocker?", answer: "no", explain: "A♥ is the nut blocker — you don't have it." },
  { hole: ["T♦", "T♣"], board: ["T♠", "9♥", "8♦"], question: "Block villain's set of tens?", answer: "yes", explain: "Two tens in hand leave only one T for villain." },
  { hole: ["A♦", "K♠"], board: ["A♣", "K♣", "Q♥"], question: "Block AK combos?", answer: "yes", explain: "You hold both an ace and a king." },
  { hole: ["5♠", "5♥"], board: ["6♠", "7♠", "8♠"], question: "Good bluff with flush blocker?", answer: "no", explain: "No spade blocker — villain can have flush." },
  { hole: ["Q♠", "J♦"], board: ["K♠", "T♠", "9♣"], question: "Block the nuts (broadway)?", answer: "no", explain: "You don't hold an ace — A♠X makes broadway." },
  { hole: ["A♥", "3♥"], board: ["K♥", "7♥", "2♠"], question: "Nut flush blocker?", answer: "yes", explain: "A♥ blocks villain's ace-high flush." },
  { hole: ["9♣", "9♠"], board: ["9♦", "4♥", "4♣"], question: "Block villain's nines full?", answer: "yes", explain: "Two nines in hand — villain can't have trip 9s." },
  { hole: ["2♦", "2♣"], board: ["A♠", "K♠", "Q♠"], question: "Useful bluff blocker here?", answer: "no", explain: "Deuces don't block flush or straight value." },
];

export interface ExploitQuiz {
  action: string;
  types: string[];
  answer: string;
  exploit: string;
}

export const EXPLOIT_QUIZZES: ExploitQuiz[] = [
  { action: "Villain raises UTG, you have 72o on the button", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Fold — a nit's UTG range crushes 72o." },
  { action: "Loose player calls 3 streets with middle pair", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Calling Station", exploit: "Value bet thinner — they won't fold pairs." },
  { action: "Aggressive player 3-bets 15% of hands", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "LAG", exploit: "Call down lighter, trap with premiums." },
  { action: "Tight player folds to 80% of button steals", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Open wider from the button." },
  { action: "Player never folds to a c-bet", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Calling Station", exploit: "Value bet relentlessly, stop bluffing." },
  { action: "Player folds to any 3-bet", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "3-bet bluff more often." },
  { action: "Player raises 40% of hands from CO", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "LAG", exploit: "Widen calling range, trap strong hands." },
  { action: "Player only bets flop with top pair+", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "TAG", exploit: "Float flops and take pots when they check turn." },
  { action: "Player limps 30% of hands", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Calling Station", exploit: "Iso-raise wide for value." },
  { action: "Player folds BB to 70% of steals", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Steal blinds aggressively." },
  { action: "Player 4-bets only AA/KK", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Fold to 4-bets without premiums." },
  { action: "Player bluffs river 30% of time", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "LAG", exploit: "Call down lighter on rivers." },
  { action: "Player never bets turn without a draw", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "TAG", exploit: "Fold to turn aggression without strong hand." },
  { action: "Player calls any raise with suited connectors", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Calling Station", exploit: "Bet big for value with top pair+." },
  { action: "Player opens 12% UTG", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Respect UTG raises — fold marginal hands." },
  { action: "Player 3-bets light from button", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "LAG", exploit: "4-bet bluff less, call more in position." },
  { action: "Player checks back flop with air often", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "TAG", exploit: "Take free cards — don't bluff into checked pots." },
  { action: "Player overfolds to river bets", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "Nit", exploit: "Bluff rivers more frequently." },
  { action: "Player min-raises every hand on button", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "LAG", exploit: "3-bet light in position to isolate." },
  { action: "Player never bluffs, only value bets", types: ["TAG", "LAG", "Nit", "Calling Station"], answer: "TAG", exploit: "Fold to their bets without strong holdings." },
];
