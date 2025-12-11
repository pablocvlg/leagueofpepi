import styled from "styled-components";
import type { Player, Team } from "../types/Data";
import PlayerCard from "../components/PlayerCard";
import { useData } from "../hooks/useData";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #555;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #white;
`;

const CardsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function BestPlayers() {
  const { data, loading, error } = useData();

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  const allPlayers: Player[] = data.competitions.flatMap((comp) =>
    comp.events.flatMap((event) =>
      event.teams.flatMap((team: Team) => team.players)
    )
  );

  // Calculate average rating for every player
  const playersWithAverage = allPlayers.map(player => {
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
      <SectionTitle>Top 5 Players</SectionTitle>
      <CardsGrid>
        {topPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </CardsGrid>
    </Container>
  );
}