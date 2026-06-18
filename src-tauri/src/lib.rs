mod bots;
mod poker;
mod session;

use crate::bots::archetypes::{spawn_table_bots, BotProfile};
use crate::poker::cards::{Card, Suit};
use crate::poker::deck::Deck;
use crate::poker::equity::{analyze_action, monte_carlo_equity, EvAnalysis};
use crate::poker::outs::{calculate_outs, combo_explanation};
use crate::poker::hand::{best_hand_from_hole, describe_hand, EvaluatedHand};
use crate::poker::range::RangeMatrix;
use crate::session::{build_summary, reset_stacks_for_session, settle_hand, SessionState, SessionSummary};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Street {
    Preflop,
    Flop,
    Turn,
    River,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PlayerAction {
    Fold,
    Check,
    Call,
    Raise,
    Bet,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerState {
    pub seat: usize,
    pub is_human: bool,
    pub stack: f64,
    pub bet: f64,
    pub folded: bool,
    pub hole_cards: Option<[String; 2]>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameState {
    pub table_size: usize,
    pub players: Vec<PlayerState>,
    pub bots: Vec<BotProfile>,
    pub board: Vec<String>,
    pub pot: f64,
    pub current_bet: f64,
    pub street: Street,
    pub action_on: usize,
    pub dealer_seat: usize,
    pub hand_number: u32,
    pub show_coach: bool,
    pub last_coach_message: Option<EvAnalysis>,
    pub has_acted: Vec<bool>,
    pub hand_over: bool,
    pub winner_seat: Option<usize>,
    pub showdown: bool,
    pub winning_hand: Option<String>,
    pub last_action: Option<String>,
    pub action_history: Vec<String>,
    pub session_active: bool,
    pub session_hands_completed: u32,
    pub hero_folded_preflop: bool,
}

pub struct AppState {
    pub game: Mutex<GameState>,
    pub session: Mutex<SessionState>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            game: Mutex::new(GameState::new(6)),
            session: Mutex::new(SessionState::default()),
        }
    }
}

impl GameState {
    pub fn new(table_size: usize) -> Self {
        let bots = spawn_table_bots(table_size - 1, 1);
        let mut players = Vec::with_capacity(table_size);

        players.push(PlayerState {
            seat: 0,
            is_human: true,
            stack: 100.0,
            bet: 0.0,
            folded: false,
            hole_cards: None,
        });

        for (i, _bot) in bots.iter().enumerate() {
            players.push(PlayerState {
                seat: i + 1,
                is_human: false,
                stack: 100.0,
                bet: 0.0,
                folded: false,
                hole_cards: None,
            });
        }

        Self {
            table_size,
            players,
            bots,
            board: vec![],
            pot: 0.0,
            current_bet: 0.0,
            street: Street::Preflop,
            action_on: 0,
            dealer_seat: 0,
            hand_number: 0,
            show_coach: false,
            last_coach_message: None,
            has_acted: vec![false; table_size],
            hand_over: false,
            winner_seat: None,
            showdown: false,
            winning_hand: None,
            last_action: None,
            action_history: vec![],
            session_active: false,
            session_hands_completed: 0,
            hero_folded_preflop: false,
        }
    }

    pub fn deal_new_hand(&mut self) {
        self.hand_number += 1;
        self.board.clear();
        self.pot = 0.0;
        self.current_bet = 0.0;
        self.street = Street::Preflop;
        self.show_coach = false;
        self.last_coach_message = None;
        self.hand_over = false;
        self.winner_seat = None;
        self.showdown = false;
        self.winning_hand = None;
        self.last_action = None;
        self.action_history = vec!["— New hand dealt —".to_string()];
        self.has_acted = vec![false; self.table_size];
        self.hero_folded_preflop = false;
        self.dealer_seat = (self.dealer_seat + 1) % self.table_size;

        let mut deck = Deck::new();
        deck.shuffle();

        for player in &mut self.players {
            player.bet = 0.0;
            player.folded = false;
            player.hole_cards = None;
        }

        // Blinds
        let sb_seat = (self.dealer_seat + 1) % self.table_size;
        let bb_seat = (self.dealer_seat + 2) % self.table_size;
        self.players[sb_seat].bet = 0.5;
        self.players[sb_seat].stack -= 0.5;
        self.pot += 0.5;
        self.players[bb_seat].bet = 1.0;
        self.players[bb_seat].stack -= 1.0;
        self.pot += 1.0;
        self.current_bet = 1.0;

        for player in &mut self.players {
            if let (Some(c1), Some(c2)) = (deck.deal(), deck.deal()) {
                player.hole_cards = Some([c1.display(), c2.display()]);
            }
        }

        self.action_on = (bb_seat + 1) % self.table_size;
    }

    pub fn advance_street(&mut self) {
        self.street = match self.street {
            Street::Preflop => Street::Flop,
            Street::Flop => Street::Turn,
            Street::Turn => Street::River,
            Street::River => Street::Preflop,
        };

        if self.street == Street::Flop && self.board.is_empty() {
            // Simulated board for demo
            self.board = vec![
                Card::new(14, Suit::Hearts).display(),
                Card::new(9, Suit::Diamonds).display(),
                Card::new(4, Suit::Clubs).display(),
            ];
        } else if self.street == Street::Turn && self.board.len() == 3 {
            self.board.push(Card::new(7, Suit::Spades).display());
        } else if self.street == Street::River && self.board.len() == 4 {
            self.board.push(Card::new(2, Suit::Hearts).display());
        }

        for player in &mut self.players {
            player.bet = 0.0;
        }
        self.current_bet = 0.0;
        self.has_acted = vec![false; self.table_size];
        self.action_on = next_active_seat(self, (self.dealer_seat + 1) % self.table_size);
    }

    fn active_seats(&self) -> Vec<usize> {
        (0..self.table_size)
            .filter(|&i| !self.players[i].folded)
            .collect()
    }
}

fn next_active_seat(game: &GameState, start: usize) -> usize {
    let mut seat = start;
    for _ in 0..game.table_size {
        if !game.players[seat].folded {
            return seat;
        }
        seat = (seat + 1) % game.table_size;
    }
    start
}

fn seat_needs_action(game: &GameState, seat: usize) -> bool {
    !game.players[seat].folded
        && (game.players[seat].bet < game.current_bet - 0.001 || !game.has_acted[seat])
}

fn find_next_actor(game: &GameState) -> Option<usize> {
    let start = (game.action_on + 1) % game.table_size;
    let mut seat = start;
    loop {
        if seat_needs_action(game, seat) {
            return Some(seat);
        }
        seat = (seat + 1) % game.table_size;
        if seat == start {
            return None;
        }
    }
}

fn betting_round_complete(game: &GameState) -> bool {
    game.active_seats()
        .iter()
        .all(|&i| game.players[i].bet >= game.current_bet - 0.001 && game.has_acted[i])
}

fn declare_winner(
    game: &mut GameState,
    winner: usize,
    showdown: bool,
    winning_hand: Option<String>,
) {
    game.hand_over = true;
    game.winner_seat = Some(winner);
    game.showdown = showdown;
    game.winning_hand = winning_hand.clone();

    let name = player_label(game, winner);
    let msg = if showdown {
        if let Some(hand) = winning_hand {
            format!("Showdown — {name} wins ${:.2} with {hand}", game.pot)
        } else {
            format!("Showdown — {name} wins ${:.2}", game.pot)
        }
    } else {
        format!("{name} wins ${:.2}", game.pot)
    };
    game.last_action = Some(msg.clone());
    game.action_history.push(msg);
}

fn resolve_showdown(game: &GameState) -> Option<(usize, String)> {
    let board: Vec<Card> = game.board.iter().filter_map(|s| parse_card(s)).collect();
    if board.len() < 5 {
        return None;
    }

    let mut best_seat: Option<usize> = None;
    let mut best_eval: Option<EvaluatedHand> = None;

    for &seat in game.active_seats().iter() {
        let hole = game.players[seat].hole_cards.as_ref()?;
        let c1 = parse_card(&hole[0])?;
        let c2 = parse_card(&hole[1])?;
        let eval = best_hand_from_hole([c1, c2], &board);

        match &best_eval {
            None => {
                best_seat = Some(seat);
                best_eval = Some(eval);
            }
            Some(current) if eval > *current => {
                best_seat = Some(seat);
                best_eval = Some(eval);
            }
            _ => {}
        }
    }

    let seat = best_seat?;
    let hand = describe_hand(&best_eval?);
    Some((seat, hand))
}

fn finish_betting_round(game: &mut GameState) {
    let active = game.active_seats();
    if active.len() <= 1 {
        if let Some(w) = active.first().copied() {
            declare_winner(game, w, false, None);
        }
        return;
    }

    if game.street == Street::River {
        if let Some((winner, hand_desc)) = resolve_showdown(game) {
            declare_winner(game, winner, true, Some(hand_desc));
        } else if let Some(&w) = active.first() {
            declare_winner(game, w, true, None);
        }
        return;
    }

    game.advance_street();
    let street_msg = format!("{:?} — betting begins", game.street).to_lowercase();
    game.last_action = Some(street_msg.clone());
    game.action_history.push(street_msg);
}

fn player_label(game: &GameState, seat: usize) -> String {
    if game.players[seat].is_human {
        "You".to_string()
    } else {
        game.bots
            .iter()
            .find(|b| b.seat == seat)
            .map(|b| b.name.clone())
            .unwrap_or_else(|| format!("Bot {seat}"))
    }
}

fn describe_action(
    game: &GameState,
    seat: usize,
    action: PlayerAction,
    amount: f64,
    call_amount: f64,
) -> String {
    let name = player_label(game, seat);
    match action {
        PlayerAction::Fold => format!("{name} folds"),
        PlayerAction::Check => format!("{name} checks"),
        PlayerAction::Call => format!("{name} calls ${call_amount:.2}"),
        PlayerAction::Bet => format!("{name} bets ${amount:.2}"),
        PlayerAction::Raise => format!("{name} raises to ${amount:.2}"),
    }
}

fn apply_action(game: &mut GameState, seat: usize, action: PlayerAction, amount: f64) {
    let call_amount = (game.current_bet - game.players[seat].bet).max(0.0);
    let action_desc = describe_action(game, seat, action, amount, call_amount);

    match action {
        PlayerAction::Fold => {
            if seat == 0 && game.street == Street::Preflop {
                game.hero_folded_preflop = true;
            }
            game.players[seat].folded = true;
            game.has_acted[seat] = true;
        }
        PlayerAction::Check => {
            game.has_acted[seat] = true;
        }
        PlayerAction::Call => {
            game.players[seat].stack -= call_amount;
            game.players[seat].bet += call_amount;
            game.pot += call_amount;
            game.has_acted[seat] = true;
        }
        PlayerAction::Bet | PlayerAction::Raise => {
            let to_put = (amount - game.players[seat].bet).max(0.0);
            game.players[seat].stack -= to_put;
            game.players[seat].bet = amount;
            game.pot += to_put;
            game.current_bet = amount;
            for acted in &mut game.has_acted {
                *acted = false;
            }
            game.has_acted[seat] = true;
        }
    }

    game.last_action = Some(action_desc.clone());
    game.action_history.push(action_desc);

    let active = game.active_seats();
    if active.len() <= 1 {
        if let Some(w) = active.first().copied() {
            declare_winner(game, w, false, None);
        }
        return;
    }

    if betting_round_complete(game) {
        finish_betting_round(game);
        return;
    }

    if let Some(next) = find_next_actor(game) {
        game.action_on = next;
    }
}

fn parse_card(s: &str) -> Option<Card> {
    if s.len() < 2 {
        return None;
    }
    let chars: Vec<char> = s.chars().collect();
    let rank = match chars[0] {
        'A' => 14,
        'K' => 13,
        'Q' => 12,
        'J' => 11,
        'T' => 10,
        c if c.is_ascii_digit() => c.to_digit(10)? as u8,
        _ => return None,
    };
    let suit = match chars[1] {
        '♥' | 'h' | 'H' => Suit::Hearts,
        '♦' | 'd' | 'D' => Suit::Diamonds,
        '♣' | 'c' | 'C' => Suit::Clubs,
        '♠' | 's' | 'S' => Suit::Spades,
        _ => return None,
    };
    Some(Card::new(rank, suit))
}

fn bot_decide_action(game: &GameState, seat: usize) -> (PlayerAction, f64) {
    let bot = game.bots.iter().find(|b| b.seat == seat);
    let call_amount = (game.current_bet - game.players[seat].bet).max(0.0);

    match bot.map(|b| b.archetype) {
        Some(crate::bots::archetypes::BotArchetype::Nit) => {
            if call_amount > 0.0 {
                (PlayerAction::Fold, 0.0)
            } else {
                (PlayerAction::Check, 0.0)
            }
        }
        Some(crate::bots::archetypes::BotArchetype::Lag) => {
            if call_amount == 0.0 {
                (PlayerAction::Bet, 2.5)
            } else if call_amount < 3.0 {
                (PlayerAction::Call, call_amount)
            } else {
                (PlayerAction::Raise, game.current_bet + 2.5)
            }
        }
        Some(crate::bots::archetypes::BotArchetype::CallingStation) => {
            if call_amount > 0.0 {
                (PlayerAction::Call, call_amount)
            } else {
                (PlayerAction::Check, 0.0)
            }
        }
        _ => {
            if call_amount == 0.0 {
                (PlayerAction::Raise, 2.5)
            } else if call_amount < 2.0 {
                (PlayerAction::Call, call_amount)
            } else {
                (PlayerAction::Fold, 0.0)
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GuessResult {
    pub accuracy_score: f64,
    pub bot_range: RangeMatrix,
    pub bot_hole_cards: [String; 2],
    pub bot_archetype: String,
    pub user_selected: usize,
    pub bot_selected: usize,
}

#[tauri::command]
fn get_game_state(state: State<AppState>) -> Result<GameState, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    Ok(game.clone())
}

#[tauri::command]
fn start_session(state: State<AppState>) -> Result<GameState, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;
    let mut session = state.session.lock().map_err(|e| e.to_string())?;

    if game.hand_over && game.hand_number > 0 {
        settle_hand(&mut game, &mut session);
    }

    *session = SessionState::default();
    session.active = true;
    session.hero_start_stack = 100.0;

    let bots = spawn_table_bots(game.table_size - 1, 1);
    reset_stacks_for_session(&mut game, bots);
    Ok(game.clone())
}

#[tauri::command]
fn end_session(state: State<AppState>) -> Result<SessionSummary, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;
    let mut session = state.session.lock().map_err(|e| e.to_string())?;

    if !session.active {
        return Err("No active session".into());
    }

    if game.hand_over && game.hand_number > 0 {
        settle_hand(&mut game, &mut session);
    }

    let summary = build_summary(&session, &game);
    session.active = false;
    game.session_active = false;
    Ok(summary)
}

#[tauri::command]
fn save_hand_history(content: String) -> Result<Option<String>, String> {
    let default_name = format!(
        "allin-session-{}.txt",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0)
    );

    let path = rfd::FileDialog::new()
        .set_file_name(&default_name)
        .save_file();

    match path {
        Some(mut p) => {
            let path_str = p.to_string_lossy().to_string();
            if !path_str.to_lowercase().ends_with(".txt") {
                p = std::path::PathBuf::from(format!("{path_str}.txt"));
            }
            std::fs::write(&p, content).map_err(|e| e.to_string())?;
            Ok(Some(p.to_string_lossy().into_owned()))
        }
        None => Ok(None),
    }
}

#[tauri::command]
fn start_new_hand(state: State<AppState>) -> Result<GameState, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;
    let mut session = state.session.lock().map_err(|e| e.to_string())?;

    if !session.active {
        return Err("Start a session before dealing hands".into());
    }

    if game.hand_over && game.hand_number > 0 {
        settle_hand(&mut game, &mut session);
    } else if !game.hand_over && game.hand_number > 0 {
        return Err("Finish the current hand before starting a new one".into());
    }

    game.deal_new_hand();
    Ok(game.clone())
}

#[tauri::command]
fn step_bot_turn(state: State<AppState>) -> Result<GameState, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;
    if game.hand_over {
        return Ok(game.clone());
    }
    let seat = game.action_on;
    if game.players[seat].is_human {
        return Ok(game.clone());
    }
    let (action, amount) = bot_decide_action(&game, seat);
    apply_action(&mut game, seat, action, amount);
    Ok(game.clone())
}

#[tauri::command]
fn player_action(
    action: PlayerAction,
    amount: f64,
    state: State<AppState>,
) -> Result<GameState, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;

    if game.hand_over {
        return Ok(game.clone());
    }
    if !game.players[game.action_on].is_human {
        return Err("Not your turn".to_string());
    }

    let seat = game.action_on;
    let call_amount = (game.current_bet - game.players[seat].bet).max(0.0);

    if seat == 0 && matches!(action, PlayerAction::Call | PlayerAction::Raise) {
        if let Some(ref cards) = game.players[0].hole_cards {
            if let (Some(c1), Some(c2)) = (parse_card(&cards[0]), parse_card(&cards[1])) {
                let board: Vec<Card> = game.board.iter().filter_map(|s| parse_card(s)).collect();
                let bot_idx = 1.min(game.bots.len().saturating_sub(1));
                if let Some(bot) = game.bots.get(bot_idx) {
                    let analysis = analyze_action(
                        [c1, c2],
                        &board,
                        &bot.range,
                        game.pot,
                        if matches!(action, PlayerAction::Call) {
                            call_amount
                        } else {
                            amount
                        },
                        bot.archetype.label(),
                        "Early Position",
                        &format!("{} {}", cards[0], cards[1]),
                    );

                    if analysis.is_mistake {
                        game.show_coach = true;
                        game.last_coach_message = Some(analysis);
                    }
                }
            }
        }
    }

    apply_action(&mut game, seat, action, amount);

    Ok(game.clone())
}

#[tauri::command]
fn dismiss_coach(state: State<AppState>) -> Result<GameState, String> {
    let mut game = state.game.lock().map_err(|e| e.to_string())?;
    game.show_coach = false;
    Ok(game.clone())
}

#[tauri::command]
fn guess_range(
    bot_seat: usize,
    user_range: RangeMatrix,
    state: State<AppState>,
) -> Result<GuessResult, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    let bot = game
        .bots
        .iter()
        .find(|b| b.seat == bot_seat)
        .ok_or("Bot not found")?;

    let hole_cards = game
        .players
        .get(bot_seat)
        .and_then(|p| p.hole_cards.clone())
        .unwrap_or_else(|| ["??".to_string(), "??".to_string()]);

    let accuracy = user_range.overlap_percent(&bot.range);

    Ok(GuessResult {
        accuracy_score: accuracy,
        bot_range: bot.range.clone(),
        bot_hole_cards: [hole_cards[0].clone(), hole_cards[1].clone()],
        bot_archetype: bot.archetype.label().to_string(),
        user_selected: user_range.selected_count(),
        bot_selected: bot.range.selected_count(),
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotPeekCards {
    pub hole_cards: [String; 2],
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotPeekType {
    pub archetype: String,
    pub vpip: f64,
    pub pfr: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MathStep {
    pub label: String,
    pub formula: String,
    pub result: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MathBreakdown {
    pub steps: Vec<MathStep>,
    pub equity_percent: f64,
    pub pot_odds_percent: f64,
    pub ev_call: f64,
    pub call_amount: f64,
    pub recommendation: String,
}

#[tauri::command]
fn peek_bot_cards(bot_seat: usize, state: State<AppState>) -> Result<BotPeekCards, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    let cards = game
        .players
        .get(bot_seat)
        .and_then(|p| p.hole_cards.clone())
        .ok_or("No cards")?;
    Ok(BotPeekCards { hole_cards: cards })
}

#[tauri::command]
fn peek_bot_range(bot_seat: usize, state: State<AppState>) -> Result<RangeMatrix, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    let bot = game.bots.iter().find(|b| b.seat == bot_seat).ok_or("Bot not found")?;
    Ok(bot.range.clone())
}

#[tauri::command]
fn peek_bot_type(bot_seat: usize, state: State<AppState>) -> Result<BotPeekType, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    let bot = game.bots.iter().find(|b| b.seat == bot_seat).ok_or("Bot not found")?;
    Ok(BotPeekType {
        archetype: bot.archetype.label().to_string(),
        vpip: bot.hud.vpip,
        pfr: bot.hud.pfr,
    })
}

#[tauri::command]
fn score_range_guess(
    bot_seat: usize,
    user_range: RangeMatrix,
    state: State<AppState>,
) -> Result<GuessResult, String> {
    guess_range(bot_seat, user_range, state)
}

#[tauri::command]
fn get_math_breakdown(state: State<AppState>) -> Result<MathBreakdown, String> {
    let game = state.game.lock().map_err(|e| e.to_string())?;
    let hero = &game.players[0];
    let call_amount = (game.current_bet - hero.bet).max(0.0);
    let pot = game.pot;

    let hole_cards = hero.hole_cards.clone().ok_or("No hole cards dealt")?;
    let (c1, c2) = (
        parse_card(&hole_cards[0]).ok_or("Invalid card")?,
        parse_card(&hole_cards[1]).ok_or("Invalid card")?,
    );
    let board: Vec<Card> = game.board.iter().filter_map(|s| parse_card(s)).collect();
    let hand_display = format!("{} {}", hole_cards[0], hole_cards[1]);
    let board_display = if board.is_empty() {
        "Preflop (no board)".to_string()
    } else {
        game.board.join(" ")
    };

    let villain_range = game
        .bots
        .first()
        .map(|b| b.range.clone())
        .unwrap_or_default();

    let equity_result = monte_carlo_equity([c1, c2], &board, &villain_range, 800);
    let equity = equity_result.equity_percent;
    let pot_odds = if call_amount > 0.0 {
        (call_amount / (pot + call_amount)) * 100.0
    } else {
        0.0
    };
    let ev_call = if call_amount > 0.0 {
        (equity / 100.0) * (pot + call_amount) - call_amount
    } else {
        0.0
    };

    let outs = calculate_outs([c1, c2], &board);
    let combos = combo_explanation([c1, c2]);
    let pot_plus_call = pot + call_amount;

    let mut steps = vec![
        MathStep {
            label: "Your hand".to_string(),
            formula: "Hole cards dealt to you".to_string(),
            result: hand_display.clone(),
        },
        MathStep {
            label: "Board".to_string(),
            formula: format!("Street: {:?}", game.street),
            result: board_display,
        },
        MathStep {
            label: "Combinatorics".to_string(),
            formula: "How many ways this exact hand exists in the deck".to_string(),
            result: combos,
        },
        MathStep {
            label: "Current pot".to_string(),
            formula: "Sum of all bets this hand".to_string(),
            result: format!("${pot:.2}"),
        },
        MathStep {
            label: "Outs & draws".to_string(),
            formula: outs.description.clone(),
            result: if outs.count > 0 {
                format!("{} outs identified — {}", outs.count, outs.rule_of_two)
            } else {
                outs.rule_of_two.clone()
            },
        },
        MathStep {
            label: "Showdown equity".to_string(),
            formula: format!(
                "Monte Carlo: {} vs typical opponent range ({} sims)",
                hand_display, equity_result.iterations
            ),
            result: format!("{equity:.1}% chance to win at showdown"),
        },
    ];

    if call_amount > 0.0 {
        steps.push(MathStep {
            label: "Pot odds (facing bet)".to_string(),
            formula: format!("Call ÷ (Pot + Call) = ${call_amount:.2} ÷ ${pot_plus_call:.2}"),
            result: format!("{pot_odds:.1}% equity needed to break even"),
        });
        steps.push(MathStep {
            label: "EV of calling".to_string(),
            formula: format!(
                "Equity × (Pot + Call) − Call = {:.1}% × ${pot_plus_call:.2} − ${call_amount:.2}",
                equity
            ),
            result: format!(
                "${ev_call:.2} {}",
                if ev_call >= 0.0 {
                    "(+EV call)"
                } else {
                    "(−EV call)"
                }
            ),
        });
    }

    let recommendation = if call_amount > 0.0 {
        if equity >= pot_odds {
            format!(
                "Calling is +EV: {equity:.0}% equity beats {pot_odds:.0}% pot odds. Practice this math before acting."
            )
        } else {
            format!(
                "Calling is −EV: need {pot_odds:.0}% but have {equity:.0}%. Consider folding unless implied odds apply."
            )
        }
    } else if outs.count > 0 {
        format!(
            "Study spot: {} outs with ~{equity:.0}% equity. Use the rule of 2 to estimate hitting your draw.",
            outs.count
        )
    } else {
        format!(
            "Study spot: ~{equity:.0}% showdown equity. Compare to the price if someone bets into you."
        )
    };

    Ok(MathBreakdown {
        steps,
        equity_percent: equity,
        pot_odds_percent: pot_odds,
        ev_call,
        call_amount,
        recommendation,
    })
}

#[tauri::command]
fn get_curriculum() -> Vec<CurriculumLevel> {
    curriculum_data()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurriculumModule {
    pub id: String,
    pub title: String,
    pub description: String,
    pub content: String,
    pub completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurriculumLevel {
    pub id: u8,
    pub title: String,
    pub subtitle: String,
    pub modules: Vec<CurriculumModule>,
    pub unlocked: bool,
}

fn curriculum_data() -> Vec<CurriculumLevel> {
    vec![
        CurriculumLevel {
            id: 1,
            title: "Level 1: Basics".to_string(),
            subtitle: "Rules, rankings, position, bankroll".to_string(),
            unlocked: true,
            modules: vec![
                CurriculumModule {
                    id: "l1-rules".into(),
                    title: "Texas Hold'em Rules".into(),
                    description: "Learn the flow of a hand from blinds to showdown.".into(),
                    content: "Texas Hold'em uses a standard 52-card deck. Each player receives two private hole cards. Five community cards are dealt in stages: the flop (3 cards), turn (1 card), and river (1 card). Players combine their hole cards with community cards to make the best 5-card hand. Betting rounds occur preflop, on the flop, turn, and river.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l1-rankings".into(),
                    title: "Hand Rankings".into(),
                    description: "Learn rankings, kickers, and quiz yourself on who wins.".into(),
                    content: "".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l1-build-hand".into(),
                    title: "Build the Best Hand".into(),
                    description: "Given hole cards and a board, pick the strongest 5-card hand.".into(),
                    content: "".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l1-position".into(),
                    title: "Positional Awareness".into(),
                    description: "Visual 6-max diagram with every position explained.".into(),
                    content: "".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l1-bankroll".into(),
                    title: "Bankroll Management".into(),
                    description: "Protect your stack with proper buy-in rules.".into(),
                    content: "A common rule is 20-30 buy-ins for cash games. Never risk more than 5% of your bankroll in a single session. Move down in stakes if you drop below 20 buy-ins for your current level.".into(),
                    completed: false,
                },
            ],
        },
        CurriculumLevel {
            id: 2,
            title: "Level 2: Preflop".into(),
            subtitle: "Range matrices and opening charts".into(),
            unlocked: true,
            modules: vec![
                CurriculumModule {
                    id: "l2-matrix".into(),
                    title: "The 13×13 Range Matrix".into(),
                    description: "Visualize all 169 starting hand combinations.".into(),
                    content: "The range matrix displays all 169 unique starting hands. Pairs run along the diagonal (AA, KK...). Suited hands appear above the diagonal (AKs). Offsuit hands appear below (AKo). Coloring cells represents which hands a player opens from a given position.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l2-open".into(),
                    title: "Opening Ranges by Position".into(),
                    description: "Standard open-raise ranges from UTG to Button.".into(),
                    content: "UTG opens ~15% of hands (pairs 77+, ATs+, KQs, AJo+). The Button opens ~45% including suited connectors and weak aces. Adjust ranges based on opponents behind you — tighten with aggressive 3-bettors in the blinds.".into(),
                    completed: false,
                },
            ],
        },
        CurriculumLevel {
            id: 3,
            title: "Level 3: Postflop".into(),
            subtitle: "Textures, c-bets, and pot odds".into(),
            unlocked: true,
            modules: vec![
                CurriculumModule {
                    id: "l3-texture".into(),
                    title: "Board Textures".into(),
                    description: "Classify boards as wet or dry.".into(),
                    content: "Dry boards (e.g., K♠ 7♦ 2♣) favor the preflop aggressor and require less protection. Wet boards (e.g., J♥ T♥ 9♦) are draw-heavy and demand larger bets to charge draws and protect made hands.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l3-cbet".into(),
                    title: "C-Betting Logic".into(),
                    description: "When and how much to continuation bet.".into(),
                    content: "C-bet more frequently on dry boards where you likely have range advantage. On wet boards, c-bet larger with strong hands and checks back medium-strength hands. Against calling stations, value bet thinner and bluff less.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l3-odds".into(),
                    title: "Pot Odds Calculator".into(),
                    description: "Determine if a call is mathematically profitable.".into(),
                    content: "Pot odds = Call Amount / (Pot + Call Amount). If your hand equity exceeds pot odds, calling is +EV. Example: calling $10 into a $40 pot requires 20% equity ($10/$50). Use the EV Coach during play to practice this in real time.".into(),
                    completed: false,
                },
            ],
        },
        CurriculumLevel {
            id: 4,
            title: "Level 4: Advanced".into(),
            subtitle: "Combinatorics, blockers, exploits".into(),
            unlocked: true,
            modules: vec![
                CurriculumModule {
                    id: "l4-combos".into(),
                    title: "Combinatorics".into(),
                    description: "Count hand combinations to weight ranges.".into(),
                    content: "There are 6 combos of each pocket pair, 4 suited combos, and 12 offsuit combos. Removing blockers from the deck shifts combo counts — holding the A♠ removes half the Ax combos from villain's range.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l4-blockers".into(),
                    title: "Blockers".into(),
                    description: "Use your cards to remove villain value/bluffs.".into(),
                    content: "Blockers are cards in your hand that reduce the likelihood villain holds specific hands. Holding Ah on a three-heart board makes it less likely villain has a flush. Use blockers to identify profitable bluff spots.".into(),
                    completed: false,
                },
                CurriculumModule {
                    id: "l4-exploit".into(),
                    title: "Exploitative Adjustments".into(),
                    description: "Adapt to TAG, LAG, Nit, and Calling Station profiles.".into(),
                    content: "vs TAG: fold more to 3-bets, bluff less. vs LAG: call down lighter, trap with strong hands. vs Nit: steal blinds aggressively, fold to their raises. vs Calling Station: value bet relentlessly, never bluff.".into(),
                    completed: false,
                },
            ],
        },
    ]
}

#[tauri::command]
fn get_hand_labels() -> Vec<String> {
    crate::poker::cards::all_hand_labels()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState::new())
        .invoke_handler(tauri::generate_handler![
            get_game_state,
            start_session,
            end_session,
            save_hand_history,
            start_new_hand,
            step_bot_turn,
            player_action,
            dismiss_coach,
            guess_range,
            score_range_guess,
            peek_bot_cards,
            peek_bot_range,
            peek_bot_type,
            get_math_breakdown,
            get_curriculum,
            get_hand_labels,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
