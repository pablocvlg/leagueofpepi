export interface Player {
  id: string;
  name: string;
  role: string;
  ratings: number[];
}

export interface Team {
  id: string;
  name: string;
  abbrev: string;
  logo: string;
  players: Player[];
  drafts: number[]
}

export interface MatchScore {
  teamA: number;
  teamB: number;
}

export interface Match {
  id: string;
  date: string;
  stage: string;
  status: string;
  teamA: string;
  teamB: string;
  score: MatchScore;
}

export interface Event {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
}

export interface Competition {
  id: string;
  name: string;
  events: Event[];
}

export interface CompetitionsData {
  competitions: Competition[];
}