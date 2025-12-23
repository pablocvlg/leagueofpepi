import styled from "styled-components";
import type { Match, Team } from "../types/Data";

type MatchCardProps = {
  match: Match;
  teams: Team[];
};

const Card = styled.div`
  background-color: #111;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 15rem;
  width: 100%;
`;

const Teams = styled.h2`
  font-size: 1.1rem;
  margin: 0.5rem 0;
`;

const DateText = styled.span`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #aaa;
`;

const Score = styled.span`
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #00ff99;
`;

const InfoText = styled.p`
  margin: 0.2rem 0;
  font-size: 0.9rem;
`;

export default function MatchCard({ match, teams }: MatchCardProps) {
  const teamA = teams.find(t => t.id === match.teamA);
  const teamB = teams.find(t => t.id === match.teamB);

  if (!teamA || !teamB) return null;

  return (
    <Card>
      <Teams>{teamA.name} vs {teamB.name}</Teams>
      <InfoText>Status: {match.status}</InfoText>
      <InfoText>Stage: {match.stage}</InfoText>
      <Score>{match.score.teamA} - {match.score.teamB}</Score>
      <DateText>{new Date(match.date).toLocaleString()}</DateText>
    </Card>
  );
}