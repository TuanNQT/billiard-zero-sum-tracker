
export interface Player {
  id: string;
  name: string;
  totalScore: number;
  color: string;
}

export interface ScoreChange {
  playerId: string;
  delta: number;
}

export interface MatchRound {
  id: string;
  timestamp: number;
  changes: ScoreChange[];
}

export interface AppState {
  players: Player[];
  history: MatchRound[];
}
