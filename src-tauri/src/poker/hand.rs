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
    let mut result = Vec::new();
    let mut combo = vec![0; k];
    loop {
        result.push(combo.iter().map(|&i| cards[i]).collect());
        let mut i = k;
        while i > 0 {
            i -= 1;
            combo[i] += 1;
            if combo[i] <= n - k + i {
                for j in i + 1..k {
                    combo[j] = combo[j - 1] + 1;
                }
                break;
            }
        }
        if i == 0 && combo[0] == n - k {
            break;
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
