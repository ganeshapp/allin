use super::cards::Card;
use super::deck::Deck;
use super::hand::compare_hands;
use super::range::RangeMatrix;
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EquityResult {
    pub equity_percent: f64,
    pub win_percent: f64,
    pub tie_percent: f64,
    pub iterations: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvAnalysis {
    pub equity_percent: f64,
    pub pot_odds_percent: f64,
    pub call_amount: f64,
    pub pot_size: f64,
    pub ev_call: f64,
    pub ev_fold: f64,
    pub is_mistake: bool,
    pub explanation: String,
}

pub fn monte_carlo_equity(
    hero_hole: [Card; 2],
    board: &[Card],
    villain_range: &RangeMatrix,
    iterations: u32,
) -> EquityResult {
    let mut wins = 0u32;
    let mut ties = 0u32;
    let mut rng = rand::thread_rng();

    for _ in 0..iterations {
        let mut deck = Deck::new();
        deck.remove_cards(&hero_hole);
        deck.remove_cards(board);

        let villain_hole = deal_from_range(&mut deck, villain_range, &mut rng);
        let Some(villain_hole) = villain_hole else {
            continue;
        };

        let mut full_board = board.to_vec();
        while full_board.len() < 5 {
            if let Some(card) = deck.deal() {
                full_board.push(card);
            }
        }

        match compare_hands(hero_hole, &full_board, villain_hole) {
            1 => wins += 1,
            0 => ties += 1,
            _ => {}
        }
    }

    let total = iterations as f64;
    let win_pct = (wins as f64 / total) * 100.0;
    let tie_pct = (ties as f64 / total) * 100.0;
    let equity = win_pct + tie_pct / 2.0;

    EquityResult {
        equity_percent: equity,
        win_percent: win_pct,
        tie_percent: tie_pct,
        iterations,
    }
}

pub fn analyze_action(
    hero_hole: [Card; 2],
    board: &[Card],
    villain_range: &RangeMatrix,
    pot_size: f64,
    call_amount: f64,
    villain_archetype: &str,
    villain_position: &str,
    hero_hand_display: &str,
) -> EvAnalysis {
    let equity = monte_carlo_equity(hero_hole, board, villain_range, 500);
    let pot_odds = if call_amount > 0.0 {
        (call_amount / (pot_size + call_amount)) * 100.0
    } else {
        0.0
    };

    let ev_call = (equity.equity_percent / 100.0) * (pot_size + call_amount) - call_amount;
    let ev_fold = 0.0;
    let is_mistake = call_amount > 0.0 && equity.equity_percent < pot_odds && ev_call < ev_fold;

    let explanation = if is_mistake {
        format!(
            "Mistake. Against a {villain_archetype} profile raising from {villain_position}, \
             your {hero_hand_display} only has {:.0}% equity. Calling here costs you ${:.2} in EV.",
            equity.equity_percent,
            ev_call.abs()
        )
    } else if call_amount > 0.0 {
        format!(
            "Good call. Your {hero_hand_display} has {:.0}% equity vs a {villain_archetype} range — \
             above the {:.0}% pot odds required.",
            equity.equity_percent, pot_odds
        )
    } else {
        format!(
            "Your {hero_hand_display} has {:.0}% equity in this spot.",
            equity.equity_percent
        )
    };

    EvAnalysis {
        equity_percent: equity.equity_percent,
        pot_odds_percent: pot_odds,
        call_amount,
        pot_size,
        ev_call,
        ev_fold,
        is_mistake,
        explanation,
    }
}

fn deal_from_range<R: Rng>(
    deck: &mut Deck,
    range: &RangeMatrix,
    rng: &mut R,
) -> Option<[Card; 2]> {
    let selected: Vec<usize> = range
        .hands
        .iter()
        .enumerate()
        .filter(|(_, &sel)| sel)
        .map(|(i, _)| i)
        .collect();

    if selected.is_empty() {
        return None;
    }

    for _ in 0..50 {
        let _ = selected[rng.gen_range(0..selected.len())];
        if let (Some(c1), Some(c2)) = (deck.deal(), deck.deal()) {
            return Some([c1, c2]);
        }
    }
    None
}
