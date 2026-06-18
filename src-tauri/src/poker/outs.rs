use super::cards::{Card, Suit};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutsInfo {
    pub count: u8,
    pub description: String,
    pub rule_of_two: String,
    pub cards_remaining: u8,
}

pub fn calculate_outs(hole: [Card; 2], board: &[Card]) -> OutsInfo {
    let all_cards: Vec<Card> = hole.iter().chain(board.iter()).copied().collect();
    let cards_remaining = 52u8.saturating_sub(all_cards.len() as u8);
    let mut outs: u8 = 0;
    let mut descriptions = Vec::new();

    // Flush draw: 4 cards same suit, need 1 more
    for suit in [Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades] {
        let suit_count = all_cards.iter().filter(|c| c.suit == suit).count();
        if suit_count == 4 {
            outs += 9;
            descriptions.push("9 flush outs (13 suit cards − 4 seen)".to_string());
        } else if suit_count == 3 && board.len() >= 3 {
            // backdoor not counted as main outs pre-river typically, skip
        }
    }

    // Gutshot / OESD simplified: check for 4-card straight window
    let mut ranks: Vec<u8> = all_cards.iter().map(|c| c.rank).collect();
    ranks.sort();
    ranks.dedup();
    if ranks.contains(&14) {
        ranks.insert(0, 1);
    }

    for window in ranks.windows(4) {
        if window[3] - window[0] == 3 {
            let is_oesd = window[3] - window[0] == 3
                && window[1] - window[0] == 1
                && window[2] - window[1] == 1
                && window[3] - window[2] == 1;
            if is_oesd {
                outs += 8;
                descriptions.push("8 straight outs (open-ended draw)".to_string());
                break;
            } else {
                outs += 4;
                descriptions.push("4 straight outs (gutshot draw)".to_string());
                break;
            }
        }
    }

    // Overcards: hole cards higher than board high card (rough heuristic)
    if board.is_empty() {
        descriptions.push("Preflop: equity comes from hand vs range, not outs yet".to_string());
    } else if outs == 0 && descriptions.is_empty() {
        descriptions.push("No obvious draw — outs may be limited to pairing your hole cards".to_string());
        let board_high = board.iter().map(|c| c.rank).max().unwrap_or(0);
        let overcards = hole.iter().filter(|c| c.rank > board_high).count();
        if overcards > 0 {
            outs += (overcards * 3) as u8; // rough: 3 outs per overcard
            descriptions.push(format!("~{overcards} overcard(s) to the board high card"));
        }
    }

    let desc = if descriptions.is_empty() {
        "Count cards that complete your draw without pairing the board".to_string()
    } else {
        descriptions.join("; ")
    };

    let rule_of_two = if outs > 0 && board.len() < 5 {
        let streets_left = if board.is_empty() {
            2
        } else if board.len() == 3 {
            2
        } else if board.len() == 4 {
            1
        } else {
            0
        };
        let pct = outs as f64 * streets_left as f64 * 2.0;
        format!(
            "Rule of 2: {outs} outs × {streets_left} street(s) × 2% ≈ {pct:.0}% chance to hit"
        )
    } else {
        "Rule of 2: multiply outs by remaining streets × 2% for approximate hit probability"
            .to_string()
    };

    OutsInfo {
        count: outs,
        description: desc,
        rule_of_two,
        cards_remaining,
    }
}

pub fn combo_explanation(hole: [Card; 2]) -> String {
    if hole[0].rank == hole[1].rank {
        format!(
            "You hold a pocket pair ({}{}). There are 6 combos of each pair in the deck.",
            rank_char(hole[0].rank),
            rank_char(hole[1].rank)
        )
    } else if hole[0].suit == hole[1].suit {
        format!(
            "You hold {}s — 4 suited combos exist in the deck.",
            hand_label(hole[0].rank, hole[1].rank)
        )
    } else {
        format!(
            "You hold {}o — 12 offsuit combos exist in the deck.",
            hand_label(hole[0].rank, hole[1].rank)
        )
    }
}

fn rank_char(r: u8) -> char {
    match r {
        14 => 'A',
        13 => 'K',
        12 => 'Q',
        11 => 'J',
        10 => 'T',
        n => char::from(b'0' + n),
    }
}

fn hand_label(high: u8, low: u8) -> String {
    let (h, l) = if high >= low {
        (high, low)
    } else {
        (low, high)
    };
    format!("{}{}", rank_char(h), rank_char(l))
}
