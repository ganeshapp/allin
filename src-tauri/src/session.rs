use crate::bots::archetypes::BotProfile;
use crate::{GameState, PlayerState, Street};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct SessionState {
    pub active: bool,
    pub hands_played: u32,
    pub hands_won: u32,
    pub hands_lost: u32,
    pub preflop_folds: u32,
    pub showdowns: u32,
    pub total_pot_won: f64,
    pub hero_start_stack: f64,
    pub hand_records: Vec<HandRecord>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HandRecord {
    pub hand_number: u32,
    pub dealer_seat: usize,
    pub board: Vec<String>,
    pub actions: Vec<String>,
    pub players: Vec<HandPlayerSnapshot>,
    pub winner_seat: Option<usize>,
    pub pot: f64,
    pub went_to_showdown: bool,
    pub hero_folded_preflop: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HandPlayerSnapshot {
    pub seat: usize,
    pub name: String,
    pub stack_before: f64,
    pub hole_cards: Option<[String; 2]>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlayerSummary {
    pub name: String,
    pub starting_stack: f64,
    pub ending_stack: f64,
    pub net: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionSummary {
    pub hands_played: u32,
    pub hands_won: u32,
    pub hands_lost: u32,
    pub preflop_folds: u32,
    pub showdowns: u32,
    pub net_profit: f64,
    pub ending_stack: f64,
    pub total_pot_won: f64,
    pub export_text: String,
    pub player_summaries: Vec<PlayerSummary>,
}

pub fn settle_hand(game: &mut GameState, session: &mut SessionState) {
    if game.hand_number == 0 || !game.hand_over {
        return;
    }

    let pot = game.pot;
    let winner = game.winner_seat;
    let went_to_showdown = game
        .last_action
        .as_ref()
        .map(|s| s.contains("Showdown"))
        .unwrap_or(false);

    if went_to_showdown {
        session.showdowns += 1;
    }

    if game.hero_folded_preflop {
        session.preflop_folds += 1;
    }

    session.hand_records.push(snapshot_hand(game, went_to_showdown));

    if let Some(w) = winner {
        game.players[w].stack += pot;
        if w == 0 {
            session.hands_won += 1;
            session.total_pot_won += pot;
        } else {
            session.hands_lost += 1;
        }
    }

    game.pot = 0.0;
    for player in &mut game.players {
        player.bet = 0.0;
    }

    session.hands_played += 1;
    game.session_hands_completed += 1;
}

fn snapshot_hand(game: &GameState, went_to_showdown: bool) -> HandRecord {
    HandRecord {
        hand_number: game.hand_number,
        dealer_seat: game.dealer_seat,
        board: game.board.clone(),
        actions: game.action_history.clone(),
        players: game
            .players
            .iter()
            .map(|p| HandPlayerSnapshot {
                seat: p.seat,
                name: player_name(game, p),
                stack_before: p.stack + p.bet,
                hole_cards: p.hole_cards.clone(),
            })
            .collect(),
        winner_seat: game.winner_seat,
        pot: game.pot,
        went_to_showdown,
        hero_folded_preflop: game.hero_folded_preflop,
    }
}

fn player_name(game: &GameState, player: &PlayerState) -> String {
    if player.is_human {
        "You".to_string()
    } else {
        game.bots
            .iter()
            .find(|b| b.seat == player.seat)
            .map(|b| b.name.clone())
            .unwrap_or_else(|| format!("Bot {}", player.seat))
    }
}

pub fn build_summary(session: &SessionState, game: &GameState) -> SessionSummary {
    let ending_stack = game.players.first().map(|p| p.stack).unwrap_or(0.0);
    let net_profit = ending_stack - session.hero_start_stack;

    let player_summaries: Vec<PlayerSummary> = game
        .players
        .iter()
        .map(|p| {
            let name = player_name(game, p);
            let ending = p.stack;
            PlayerSummary {
                name,
                starting_stack: 100.0,
                ending_stack: ending,
                net: ending - 100.0,
            }
        })
        .collect();

    SessionSummary {
        hands_played: session.hands_played,
        hands_won: session.hands_won,
        hands_lost: session.hands_lost,
        preflop_folds: session.preflop_folds,
        showdowns: session.showdowns,
        net_profit,
        ending_stack,
        total_pot_won: session.total_pot_won,
        export_text: export_pokerstars(session),
        player_summaries,
    }
}

pub fn export_pokerstars(session: &SessionState) -> String {
    let mut out = String::new();
    out.push_str("All-In Poker Training Session Export\n");
    out.push_str("Format: PokerStars-compatible hand history\n");
    out.push_str(&format!("Hands: {}\n\n", session.hand_records.len()));

    for hand in &session.hand_records {
        let hand_id = 1_000_000_000u64 + hand.hand_number as u64;
        out.push_str(&format!(
            "PokerStars Hand #{hand_id}: Hold'em No Limit ($0.50/$1.00 USD) - 2024/01/01 12:00:00 ET\n"
        ));
        out.push_str("Table 'All-In Training' 6-max\n");
        out.push_str(&format!(
            "Seat #{} is the button\n",
            hand.dealer_seat + 1
        ));

        for snap in &hand.players {
            out.push_str(&format!(
                "Seat {}: {} (${:.2} in chips)\n",
                snap.seat + 1,
                snap.name,
                snap.stack_before
            ));
        }

        let sb = (hand.dealer_seat + 1) % hand.players.len();
        let bb = (hand.dealer_seat + 2) % hand.players.len();
        out.push_str(&format!(
            "{}: posts small blind $0.50\n",
            hand.players.iter().find(|p| p.seat == sb).map(|p| p.name.as_str()).unwrap_or("?")
        ));
        out.push_str(&format!(
            "{}: posts big blind $1.00\n",
            hand.players.iter().find(|p| p.seat == bb).map(|p| p.name.as_str()).unwrap_or("?")
        ));
        out.push_str("*** HOLE CARDS ***\n");

        if let Some(hero) = hand.players.iter().find(|p| p.seat == 0) {
            if let Some(ref cards) = hero.hole_cards {
                out.push_str(&format!(
                    "Dealt to {} [{} {}]\n",
                    hero.name,
                    ps_card(&cards[0]),
                    ps_card(&cards[1])
                ));
            }
        }

        let mut street = Street::Preflop;
        for action in &hand.actions {
            if action.starts_with("—") {
                continue;
            }
            if action.contains("flop —") {
                street = Street::Flop;
                if hand.board.len() >= 3 {
                    out.push_str(&format!(
                        "*** FLOP *** [{} {} {}]\n",
                        ps_card(&hand.board[0]),
                        ps_card(&hand.board[1]),
                        ps_card(&hand.board[2])
                    ));
                }
                continue;
            }
            if action.contains("turn —") {
                street = Street::Turn;
                if hand.board.len() >= 4 {
                    out.push_str(&format!(
                        "*** TURN *** [{}]\n",
                        ps_card(&hand.board[3])
                    ));
                }
                continue;
            }
            if action.contains("river —") {
                street = Street::River;
                if hand.board.len() >= 5 {
                    out.push_str(&format!(
                        "*** RIVER *** [{}]\n",
                        ps_card(&hand.board[4])
                    ));
                }
                continue;
            }
            let _ = street;
            out.push_str(&format!("{}\n", ps_action(action)));
        }

        out.push_str("*** SUMMARY ***\n");
        out.push_str(&format!("Total pot ${:.2} | Rake $0\n", hand.pot));
        if let Some(w) = hand.winner_seat {
            if let Some(winner) = hand.players.iter().find(|p| p.seat == w) {
                if hand.went_to_showdown {
                    if let Some(ref cards) = winner.hole_cards {
                        out.push_str(&format!(
                            "Seat {}: {} showed [{} {}] and won (${:.2})\n",
                            w + 1,
                            winner.name,
                            ps_card(&cards[0]),
                            ps_card(&cards[1]),
                            hand.pot
                        ));
                    } else {
                        out.push_str(&format!(
                            "Seat {}: {} won (${:.2})\n",
                            w + 1,
                            winner.name,
                            hand.pot
                        ));
                    }
                } else {
                    out.push_str(&format!(
                        "Seat {}: {} collected (${:.2})\n",
                        w + 1,
                        winner.name,
                        hand.pot
                    ));
                }
            }
        }
        out.push('\n');
    }

    out
}

fn ps_card(card: &str) -> String {
    if card.len() < 2 {
        return card.to_string();
    }
    let chars: Vec<char> = card.chars().collect();
    let rank = chars[0];
    let suit = match chars[1] {
        '♠' | 's' | 'S' => 's',
        '♥' | 'h' | 'H' => 'h',
        '♦' | 'd' | 'D' => 'd',
        '♣' | 'c' | 'C' => 'c',
        _ => 's',
    };
    format!("{rank}{suit}")
}

fn ps_action(action: &str) -> String {
    action
        .replace("You", "Hero")
        .replace('$', "$")
}

pub fn reset_stacks_for_session(game: &mut GameState, bots: Vec<BotProfile>) {
    game.bots = bots;
    for player in &mut game.players {
        player.stack = 100.0;
        player.bet = 0.0;
        player.folded = false;
        player.hole_cards = None;
    }
    game.hand_number = 0;
    game.hand_over = false;
    game.pot = 0.0;
    game.board.clear();
    game.current_bet = 0.0;
    game.street = Street::Preflop;
    game.action_history.clear();
    game.last_action = None;
    game.winner_seat = None;
    game.show_coach = false;
    game.last_coach_message = None;
    game.hero_folded_preflop = false;
    game.session_active = true;
    game.session_hands_completed = 0;
}
