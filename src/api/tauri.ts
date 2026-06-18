import { invoke } from "@tauri-apps/api/core";
import type {
  BotPeekCards,
  BotPeekType,
  CurriculumLevel,
  GameState,
  GuessResult,
  MathBreakdown,
  PlayerAction,
  RangeMatrix,
  SessionSummary,
} from "../types";

export async function getGameState(): Promise<GameState> {
  return invoke("get_game_state");
}

export async function startSession(): Promise<GameState> {
  return invoke("start_session");
}

export async function endSession(): Promise<SessionSummary> {
  return invoke("end_session");
}

export async function saveHandHistory(content: string): Promise<string | null> {
  return invoke("save_hand_history", { content });
}

export async function startNewHand(): Promise<GameState> {
  return invoke("start_new_hand");
}

export async function playerAction(
  action: PlayerAction,
  amount: number
): Promise<GameState> {
  return invoke("player_action", { action, amount });
}

export async function dismissCoach(): Promise<GameState> {
  return invoke("dismiss_coach");
}

export async function stepBotTurn(): Promise<GameState> {
  return invoke("step_bot_turn");
}

export async function peekBotCards(botSeat: number): Promise<BotPeekCards> {
  return invoke("peek_bot_cards", { botSeat });
}

export async function peekBotRange(botSeat: number): Promise<RangeMatrix> {
  return invoke("peek_bot_range", { botSeat });
}

export async function peekBotType(botSeat: number): Promise<BotPeekType> {
  return invoke("peek_bot_type", { botSeat });
}

export async function scoreRangeGuess(
  botSeat: number,
  userRange: RangeMatrix
): Promise<GuessResult> {
  return invoke("score_range_guess", { botSeat, userRange });
}

export async function getMathBreakdown(): Promise<MathBreakdown> {
  return invoke("get_math_breakdown");
}

export async function guessRange(
  botSeat: number,
  userRange: RangeMatrix
): Promise<GuessResult> {
  return invoke("guess_range", { botSeat, userRange });
}

export async function getCurriculum(): Promise<CurriculumLevel[]> {
  return invoke("get_curriculum");
}

export async function getHandLabels(): Promise<string[]> {
  return invoke("get_hand_labels");
}
