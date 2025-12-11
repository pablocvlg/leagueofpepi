import styled from "styled-components";
import { useData } from "../hooks/useData";
import BestPlayers from "../components/BestPlayers";
import Standings from "../components/Standings";

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #white;
`;

export default function Home() {
  const { data, loading, error } = useData();

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  return (
    <Container>
      {data.competitions.map((competition) => (
        <div key={competition.id}>
          <SectionTitle>{competition.name}</SectionTitle>
          {competition.events.map((event) => (
            <div key={event.id}>
              <SectionTitle style={{ fontSize: "1.5rem" }}>{event.name}</SectionTitle>
            </div>
          ))}
          <BestPlayers/>
          <Standings eventId="winter2026"/>
        </div>
      ))}
    </Container>
  );
}