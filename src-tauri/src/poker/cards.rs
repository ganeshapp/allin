use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Suit {
    Hearts,
    Diamonds,
    Clubs,
    Spades,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Card {
    pub rank: u8, // 2-14 (Ace = 14)
    pub suit: Suit,
}

impl Card {
    pub fn new(rank: u8, suit: Suit) -> Self {
        Self { rank, suit }
    }

    pub fn display(&self) -> String {
        let rank_str = match self.rank {
            14 => "A".to_string(),
            13 => "K".to_string(),
            12 => "Q".to_string(),
            11 => "J".to_string(),
            10 => "T".to_string(),
            r => r.to_string(),
        };
        let suit_str = match self.suit {
            Suit::Hearts => "♥",
            Suit::Diamonds => "♦",
            Suit::Clubs => "♣",
            Suit::Spades => "♠",
        };
        format!("{rank_str}{suit_str}")
    }
}

pub fn all_hand_labels() -> Vec<String> {
    let ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    let mut labels = Vec::with_capacity(169);
    for (i, &r1) in ranks.iter().enumerate() {
        for (j, &r2) in ranks.iter().enumerate() {
            if i == j {
                labels.push(format!("{r1}{r2}"));
            } else if i < j {
                labels.push(format!("{r1}{r2}s"));
            } else {
                labels.push(format!("{r2}{r1}o"));
            }
        }
    }
    labels
}
