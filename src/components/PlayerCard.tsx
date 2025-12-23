import styled from "styled-components";
import type { Player, Team } from "../types/Data";
import { useData } from "../hooks/useData";


const Container = styled.div`
  background: linear-gradient(135deg, #4e745eff 0%, #11251aff 100%);
  border-radius: 12px;
  padding: 1.1rem;
`;

const Card = styled.div`
  background: #0a0a0a;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.2s ease;
  margin: 0.5rem 0;

  &:hover {
    background: #020e04ff;
    transform: scale(1.02);
  }
`;

export default function PlayerCard() {
  const { data, loading, error } = useData();
  
  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  // Get all players from all competitions and events
  const allPlayers = data.competitions.flatMap((comp) =>
    comp.events.flatMap((event) =>
      event.teams.flatMap((team: Team) =>
        team.players.map((player: Player) => ({
          ...player,
          teamAbbrev: team.abbrev,
          teamLogo: team.logo,
        }))
      )
    )
  );

  // Calculate average rating for every player
  const playersWithAverage = allPlayers.map((player) => {
    const ratings = player.ratings.length > 0 ? player.ratings : [0];
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    return { ...player, avgRating: avg };
  });

  return (
    <Container>
        {playersWithAverage.map((player) => (
          <Card key={player.id}>
            <PlayerImage
              src={player.teamLogo}
              alt={player.teamAbbrev}
              onError={(e) => {
                e.currentTarget.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect width="50" height="50" fill="%23333"/%3E%3C/svg%3E';
              }}
            />
            <PlayerInfo>
              <PlayerName>{player.name}</PlayerName>
              <PlayerDetails>
                <TeamAbbrev>{player.teamAbbrev}</TeamAbbrev>
                <Role>{player.role}</Role>
              </PlayerDetails>
            </PlayerInfo>
            <Rating>{player.avgRating.toFixed(1)}</Rating>
          </Card>
        ))}
    </Container>
  );
}

const PlayerImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const PlayerName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerDetails = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.9rem;
`;

const TeamAbbrev = styled.span`
  color: #888;
`;

const Role = styled.span`
  color: #666;
`;

const Rating = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00a8ff;
`;