export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export interface Card {
  rank: number;
  suit: Suit;
}

export type Street = "preflop" | "flop" | "turn" | "river";
export type PlayerAction = "fold" | "check" | "call" | "raise" | "bet";

export type BotArchetype = "TAG" | "LAG" | "NIT" | "CALLING_STATION";

export interface HudStats {
  vpip: number;
  pfr: number;
  hands_played: number;
}

export interface RangeMatrix {
  hands: boolean[];
}

export interface BotProfile {
  seat: number;
  name: string;
  archetype: BotArchetype;
  hud: HudStats;
  range: RangeMatrix;
}

export interface PlayerState {
  seat: number;
  is_human: boolean;
  stack: number;
  bet: number;
  folded: boolean;
  hole_cards: [string, string] | null;
}

export interface EvAnalysis {
  equity_percent: number;
  pot_odds_percent: number;
  call_amount: number;
  pot_size: number;
  ev_call: number;
  ev_fold: number;
  is_mistake: boolean;
  explanation: string;
}

export interface GameState {
  table_size: number;
  players: PlayerState[];
  bots: BotProfile[];
  board: string[];
  pot: number;
  current_bet: number;
  street: Street;
  action_on: number;
  dealer_seat: number;
  hand_number: number;
  show_coach: boolean;
  last_coach_message: EvAnalysis | null;
  has_acted: boolean[];
  hand_over: boolean;
  winner_seat: number | null;
  showdown: boolean;
  winning_hand: string | null;
  last_action: string | null;
  action_history: string[];
  session_active: boolean;
  session_hands_completed: number;
}

export interface BotPeekCards {
  hole_cards: [string, string];
}

export interface BotPeekType {
  archetype: string;
  vpip: number;
  pfr: number;
}

export interface MathStep {
  label: string;
  formula: string;
  result: string;
}

export interface MathBreakdown {
  steps: MathStep[];
  equity_percent: number;
  pot_odds_percent: number;
  ev_call: number;
  call_amount: number;
  recommendation: string;
}

export interface GuessResult {
  accuracy_score: number;
  bot_range: RangeMatrix;
  bot_hole_cards: [string, string];
  bot_archetype: string;
  user_selected: number;
  bot_selected: number;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
}

export interface CurriculumLevel {
  id: number;
  title: string;
  subtitle: string;
  modules: CurriculumModule[];
  unlocked: boolean;
}

export interface PlayerSummary {
  name: string;
  starting_stack: number;
  ending_stack: number;
  net: number;
}

export interface SessionSummary {
  hands_played: number;
  hands_won: number;
  hands_lost: number;
  preflop_folds: number;
  showdowns: number;
  net_profit: number;
  ending_stack: number;
  total_pot_won: number;
  export_text: string;
  player_summaries: PlayerSummary[];
}

export const ARCHETYPE_COLORS: Record<string, string> = {
  TAG: "#3b82f6",
  LAG: "#ef4444",
  NIT: "#6b7280",
  "Calling Station": "#f59e0b",
};

export const ARCHETYPE_LABELS: Record<BotArchetype, string> = {
  TAG: "TAG",
  LAG: "LAG",
  NIT: "Nit",
  CALLING_STATION: "Calling Station",
};
