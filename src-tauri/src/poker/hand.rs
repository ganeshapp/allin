use super::cards::Card;
use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum HandRank {
    HighCard,
    Pair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct EvaluatedHand {
    pub rank: HandRank,
    pub kickers: Vec<u8>,
}

pub fn evaluate_hand(cards: &[Card]) -> EvaluatedHand {
    assert!(cards.len() >= 5);
    let mut best = EvaluatedHand {
        rank: HandRank::HighCard,
        kickers: vec![],
    };

    let combos: Vec<Vec<Card>> = if cards.len() == 5 {
        vec![cards.to_vec()]
    } else {
        combinations(cards, 5)
    };

    for combo in combos {
        let eval = evaluate_five(&combo);
        if eval > best {
            best = eval;
        }
    }
    best
}

fn evaluate_five(cards: &[Card]) -> EvaluatedHand {
    let mut rank_counts: HashMap<u8, u8> = HashMap::new();
    let mut suit_counts: HashMap<super::cards::Suit, u8> = HashMap::new();
    let mut ranks: Vec<u8> = cards.iter().map(|c| c.rank).collect();
    ranks.sort_by(|a, b| b.cmp(a));

    for card in cards {
        *rank_counts.entry(card.rank).or_insert(0) += 1;
        *suit_counts.entry(card.suit).or_insert(0) += 1;
    }

    let is_flush = suit_counts.values().any(|&c| c >= 5);
    let is_straight = check_straight(&ranks);

    let mut counts: Vec<(u8, u8)> = rank_counts.into_iter().map(|(r, c)| (c, r)).collect();
    counts.sort_by(|a, b| b.cmp(a));

    if is_straight && is_flush {
        return EvaluatedHand {
            rank: HandRank::StraightFlush,
            kickers: vec![straight_high(&ranks)],
        };
    }
    if counts[0].0 == 4 {
        return EvaluatedHand {
            rank: HandRank::FourOfAKind,
            kickers: vec![counts[0].1, counts[1].1],
        };
    }
    if counts[0].0 == 3 && counts[1].0 >= 2 {
        return EvaluatedHand {
            rank: HandRank::FullHouse,
            kickers: vec![counts[0].1, counts[1].1],
        };
    }
    if is_flush {
        return EvaluatedHand {
            rank: HandRank::Flush,
            kickers: ranks,
        };
    }
    if is_straight {
        return EvaluatedHand {
            rank: HandRank::Straight,
            kickers: vec![straight_high(&ranks)],
        };
    }
    if counts[0].0 == 3 {
        let kickers: Vec<u8> = counts.iter().skip(1).map(|c| c.1).collect();
        return EvaluatedHand {
            rank: HandRank::ThreeOfAKind,
            kickers: [vec![counts[0].1], kickers].concat(),
        };
    }
    if counts[0].0 == 2 && counts[1].0 == 2 {
        let (high_pair, low_pair) = if counts[0].1 > counts[1].1 {
            (counts[0].1, counts[1].1)
        } else {
            (counts[1].1, counts[0].1)
        };
        let kicker = counts.iter().find(|c| c.0 == 1).map(|c| c.1).unwrap_or(0);
        return EvaluatedHand {
            rank: HandRank::TwoPair,
            kickers: vec![high_pair, low_pair, kicker],
        };
    }
    if counts[0].0 == 2 {
        let kickers: Vec<u8> = counts.iter().skip(1).map(|c| c.1).collect();
        return EvaluatedHand {
            rank: HandRank::Pair,
            kickers: [vec![counts[0].1], kickers].concat(),
        };
    }

    EvaluatedHand {
        rank: HandRank::HighCard,
        kickers: ranks,
    }
}

fn check_straight(ranks: &[u8]) -> bool {
    let mut unique: Vec<u8> = ranks.to_vec();
    unique.sort();
    unique.dedup();
    if unique.contains(&14) {
        unique.insert(0, 1);
    }
    for window in unique.windows(5) {
        if window[4] - window[0] == 4
            && window.windows(2).all(|w| w[1] - w[0] == 1)
        {
            return true;
        }
    }
    false
}

fn straight_high(ranks: &[u8]) -> u8 {
    let mut unique: Vec<u8> = ranks.to_vec();
    unique.sort();
    unique.dedup();
    if unique == [2, 3, 4, 5, 14] {
        return 5;
    }
    *unique.last().unwrap_or(&0)
}

fn combinations(cards: &[Card], k: usize) -> Vec<Vec<Card>> {
    let n = cards.len();
    if k == 0 || k > n {
        return vec![];
    }

    let mut result = Vec::new();
    let mut idx: Vec<usize> = (0..k).collect();

    loop {
        result.push(idx.iter().map(|&i| cards[i]).collect());

        let mut i = k;
        while i > 0 {
            i -= 1;
            if idx[i] < i + n - k {
                break;
            }
        }

        if i == 0 && idx[0] == n - k {
            break;
        }

        idx[i] += 1;
        for j in (i + 1)..k {
            idx[j] = idx[j - 1] + 1;
        }
    }

    result
}

pub fn compare_hands(hole: [Card; 2], board: &[Card], opponent: [Card; 2]) -> i8 {
    let mut hero_cards: Vec<Card> = hole.to_vec();
    hero_cards.extend_from_slice(board);
    let mut villain_cards: Vec<Card> = opponent.to_vec();
    villain_cards.extend_from_slice(board);

    let hero = evaluate_hand(&hero_cards);
    let villain = evaluate_hand(&villain_cards);

    if hero > villain {
        1
    } else if hero < villain {
        -1
    } else {
        0
    }
}

pub fn best_hand_from_hole(hole: [Card; 2], board: &[Card]) -> EvaluatedHand {
    let mut cards = hole.to_vec();
    cards.extend_from_slice(board);
    evaluate_hand(&cards)
}

pub fn describe_hand(hand: &EvaluatedHand) -> String {
    match hand.rank {
        HandRank::StraightFlush => format!("Straight Flush, {} high", rank_label(hand.kickers[0])),
        HandRank::FourOfAKind => format!("Four of a Kind, {}", rank_plural(hand.kickers[0])),
        HandRank::FullHouse => format!(
            "Full House, {} full of {}",
            rank_plural(hand.kickers[0]),
            rank_plural(hand.kickers[1])
        ),
        HandRank::Flush => format!("Flush, {} high", rank_label(hand.kickers[0])),
        HandRank::Straight => format!("Straight, {} high", rank_label(hand.kickers[0])),
        HandRank::ThreeOfAKind => format!("Three of a Kind, {}", rank_plural(hand.kickers[0])),
        HandRank::TwoPair => format!(
            "Two Pair, {} and {}",
            rank_plural(hand.kickers[0]),
            rank_plural(hand.kickers[1])
        ),
        HandRank::Pair => format!("Pair of {}", rank_plural(hand.kickers[0])),
        HandRank::HighCard => format!("High Card, {}", rank_label(hand.kickers[0])),
    }
}

fn rank_label(rank: u8) -> &'static str {
    match rank {
        14 => "Ace",
        13 => "King",
        12 => "Queen",
        11 => "Jack",
        10 => "Ten",
        n => match n {
            9 => "Nine",
            8 => "Eight",
            7 => "Seven",
            6 => "Six",
            5 => "Five",
            4 => "Four",
            3 => "Three",
            2 => "Two",
            _ => "?",
        },
    }
}

fn rank_plural(rank: u8) -> String {
    match rank {
        14 => "Aces".into(),
        13 => "Kings".into(),
        12 => "Queens".into(),
        11 => "Jacks".into(),
        10 => "Tens".into(),
        9 => "Nines".into(),
        8 => "Eights".into(),
        7 => "Sevens".into(),
        6 => "Sixes".into(),
        5 => "Fives".into(),
        4 => "Fours".into(),
        3 => "Threes".into(),
        2 => "Twos".into(),
        _ => "?".into(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::poker::cards::{Card, Suit};

    #[test]
    fn two_pair_beats_one_pair_at_showdown() {
        let board = [
            Card::new(14, Suit::Hearts),
            Card::new(9, Suit::Diamonds),
            Card::new(4, Suit::Clubs),
            Card::new(7, Suit::Spades),
            Card::new(2, Suit::Hearts),
        ];
        let bot1 = [Card::new(8, Suit::Spades), Card::new(8, Suit::Hearts)];
        let bot4 = [Card::new(14, Suit::Spades), Card::new(7, Suit::Hearts)];

        let pair_eights = best_hand_from_hole(bot1, &board);
        let two_pair = best_hand_from_hole(bot4, &board);

        assert_eq!(
            describe_hand(&pair_eights),
            "Pair of Eights",
            "unexpected bot1 hand: {:?}",
            pair_eights
        );
        assert_eq!(
            describe_hand(&two_pair),
            "Two Pair, Aces and Sevens",
            "unexpected bot4 hand: {:?}",
            two_pair
        );
        assert!(two_pair > pair_eights);
    }
}
