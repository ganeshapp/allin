use crate::poker::range::RangeMatrix;
use rand::seq::SliceRandom;
use rand::thread_rng;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BotArchetype {
    Tag,
    Lag,
    Nit,
    CallingStation,
}

impl BotArchetype {
    pub fn label(&self) -> &'static str {
        match self {
            Self::Tag => "TAG",
            Self::Lag => "LAG",
            Self::Nit => "Nit",
            Self::CallingStation => "Calling Station",
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            Self::Tag => "Tight Aggressive — low VPIP, high PFR",
            Self::Lag => "Loose Aggressive — high VPIP, high PFR",
            Self::Nit => "Very tight — low VPIP, low PFR",
            Self::CallingStation => "Loose passive — high VPIP, very low PFR",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HudStats {
    pub vpip: f64,
    pub pfr: f64,
    pub hands_played: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotProfile {
    pub seat: usize,
    pub name: String,
    pub archetype: BotArchetype,
    pub hud: HudStats,
    pub range: RangeMatrix,
}

impl BotProfile {
    pub fn spawn(seat: usize, archetype: BotArchetype) -> Self {
        let (vpip, pfr) = match archetype {
            BotArchetype::Tag => (22.0, 18.0),
            BotArchetype::Lag => (38.0, 28.0),
            BotArchetype::Nit => (12.0, 9.0),
            BotArchetype::CallingStation => (45.0, 8.0),
        };

        Self {
            seat,
            name: format!("Bot {seat}"),
            archetype,
            hud: HudStats {
                vpip,
                pfr,
                hands_played: 0,
            },
            range: archetype_opening_range(archetype),
        }
    }
}

pub fn spawn_table_bots(count: usize, first_seat: usize) -> Vec<BotProfile> {
    let archetypes = [
        BotArchetype::Tag,
        BotArchetype::Lag,
        BotArchetype::Nit,
        BotArchetype::CallingStation,
    ];
    let mut rng = thread_rng();

    (0..count)
        .map(|i| {
            let seat = first_seat + i;
            let archetype = *archetypes
                .choose(&mut rng)
                .unwrap_or(&BotArchetype::Tag);
            BotProfile::spawn(seat, archetype)
        })
        .collect()
}

fn archetype_opening_range(archetype: BotArchetype) -> RangeMatrix {
    let mut range = RangeMatrix::default();
    let premium = [0, 1, 2, 3, 4, 13, 14, 26, 27, 40]; // AA, KK, QQ, JJ, TT, AKs, AKo, AQs, AQo, KQs
    let strong = [5, 6, 15, 16, 28, 29, 41, 52, 53, 65];
    let medium = [7, 8, 17, 18, 30, 31, 42, 43, 54, 55, 66, 67, 78];

    let indices: &[usize] = match archetype {
        BotArchetype::Nit => &premium[..6],
        BotArchetype::Tag => {
            let mut all = premium.to_vec();
            all.extend_from_slice(&strong[..8]);
            for i in all {
                range.set_hand(i, true);
            }
            return range;
        }
        BotArchetype::Lag => {
            for i in premium.iter().chain(strong.iter()).chain(medium.iter()) {
                range.set_hand(*i, true);
            }
            return range;
        }
        BotArchetype::CallingStation => {
            for i in premium
                .iter()
                .chain(strong.iter())
                .chain(medium.iter())
                .chain([79, 80, 91, 92, 103, 104].iter())
            {
                range.set_hand(*i, true);
            }
            return range;
        }
    };

    for &i in indices {
        range.set_hand(i, true);
    }
    range
}
