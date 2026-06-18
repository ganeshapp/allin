use serde::{Deserialize, Serialize};

pub const MATRIX_SIZE: usize = 169;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RangeMatrix {
    pub hands: Vec<bool>,
}

impl Default for RangeMatrix {
    fn default() -> Self {
        Self {
            hands: vec![false; MATRIX_SIZE],
        }
    }
}

impl RangeMatrix {
    pub fn set_hand(&mut self, index: usize, selected: bool) {
        if index < MATRIX_SIZE {
            self.hands[index] = selected;
        }
    }

    pub fn overlap_percent(&self, other: &RangeMatrix) -> f64 {
        let mut intersection = 0u32;
        let mut union = 0u32;
        for i in 0..MATRIX_SIZE {
            if self.hands[i] && other.hands[i] {
                intersection += 1;
            }
            if self.hands[i] || other.hands[i] {
                union += 1;
            }
        }
        if union == 0 {
            return 100.0;
        }
        (intersection as f64 / union as f64) * 100.0
    }

    pub fn selected_count(&self) -> usize {
        self.hands.iter().filter(|&&h| h).count()
    }

    pub fn from_indices(indices: &[usize]) -> Self {
        let mut matrix = Self::default();
        for &i in indices {
            matrix.set_hand(i, true);
        }
        matrix
    }
}
