import styled from "styled-components";
import { useData } from "../../hooks/useData";
import type { Player, Team } from "../../types/Data";
import { media } from "../../styles/breakpoints";

const Container = styled.div`
  background: linear-gradient(135deg, #4e745eff 0%, #11251aff 100%);
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 2rem;

  ${media.mobile} {
  width: 90%;
  }
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0.3rem 0 1.3rem 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  ${media.mobile} {
  font-size: 1.1rem;
  }
`;

const PlayersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const PlayerCard = styled.div`
  background: #0a0a0a;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #020e04ff;
    transform: scale(1.02);
  }
`;

const PlayerImage = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  object-fit: cover;

  ${media.mobile} {
  width: 1.75rem;
  height: 1.75rem;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PlayerName = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: white;

  ${media.mobile} {
  font-size: 1rem;
  font-weight: 500;
  }
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
  margin-left: auto;

  ${media.mobile} {
  font-size: 1.3rem;
  }
`;

export default function BestPlayers() {
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

  // Order by higher average rating and take the best 5
  const topPlayers = playersWithAverage
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  return (
    <Container>
      <Title>Top 5 Players by Rating</Title>
      <PlayersList>
        {topPlayers.map((player) => (
          <PlayerCard key={player.id}>
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
          </PlayerCard>
        ))}
      </PlayersList>
    </Container>
  );
}