use super::cards::{Card, Suit};
use rand::seq::SliceRandom;
use rand::thread_rng;

pub struct Deck {
    cards: Vec<Card>,
}

impl Deck {
    pub fn new() -> Self {
        let mut cards = Vec::with_capacity(52);
        for rank in 2..=14u8 {
            for suit in [Suit::Hearts, Suit::Diamonds, Suit::Clubs, Suit::Spades] {
                cards.push(Card::new(rank, suit));
            }
        }
        Self { cards }
    }

    pub fn shuffle(&mut self) {
        let mut rng = thread_rng();
        self.cards.shuffle(&mut rng);
    }

    pub fn deal(&mut self) -> Option<Card> {
        self.cards.pop()
    }

    pub fn remove_cards(&mut self, to_remove: &[Card]) {
        self.cards.retain(|c| !to_remove.contains(c));
    }
}

impl Default for Deck {
    fn default() -> Self {
        Self::new()
    }
}
