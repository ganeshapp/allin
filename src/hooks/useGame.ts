import { useState, useEffect, useCallback } from "react";
import type { GameState, SessionSummary } from "../types";
import * as api from "../api/tauri";

export function useGame() {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const state = await api.getGameState();
      setGame(state);
      setError(null);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startSession = async () => {
    const state = await api.startSession();
    setGame(state);
    setError(null);
  };

  const endSession = async (): Promise<SessionSummary> => {
    const summary = await api.endSession();
    const state = await api.getGameState();
    setGame(state);
    return summary;
  };

  const startHand = async () => {
    const state = await api.startNewHand();
    setGame(state);
    setError(null);
  };

  const act = async (action: Parameters<typeof api.playerAction>[0], amount = 0) => {
    const state = await api.playerAction(action, amount);
    setGame(state);
  };

  const stepBot = async () => {
    const state = await api.stepBotTurn();
    setGame(state);
  };

  const dismissCoach = async () => {
    const state = await api.dismissCoach();
    setGame(state);
  };

  return {
    game,
    loading,
    error,
    refresh,
    startSession,
    endSession,
    startHand,
    act,
    stepBot,
    dismissCoach,
  };
}
