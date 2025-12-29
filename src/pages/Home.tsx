import styled from "styled-components";
import { useData } from "../hooks/useData";
import BestPlayers from "../components/homepage/BestPlayers";
import Standings from "../components/homepage/Standings";
import UpcomingMatches from "../components/homepage/UpcomingMatches";
import Loading from "../components/Loading";
import { media } from "../styles/breakpoints";

const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  max-width: 1600px;
  margin: 0 auto;

  ${media.mobile} {
  flex-direction: row;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  ${media.mobile} {
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: #13bb91ff;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3);

  ${media.mobile} {
  font-size: 1.2rem;
  }
`;

const Separator = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;

  ${media.mobile} {
  }
`;

const EventTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(19, 187, 145, 1);

  ${media.mobile} {
  font-size: 1.2rem;
  }
`;

const ContentWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 5rem;

  ${media.mobile} {
  align-items: center;  
  flex-direction: column;
  gap: 2rem;
  }
`;

const StandingsWrapper = styled.div`
  flex: 1;

  ${media.mobile} {
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  margin: 0 auto;
  }
`;

const RightColumnWrapper = styled.div`
  width: 30rem;
  flex-shrink: 0;

  ${media.mobile} {
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 350px;
  margin: 0 auto;
  }
`;

export default function Home() {
  const { data, loading, error } = useData();

  if (loading) return <Loading text="Preparing data…" />;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  return (
    <Container>
      {data.competitions.map((competition) => (
        <div key={competition.id}>
          {competition.events.map((event) => (
            <div key={event.id}>
              <TitleRow>
                <SectionTitle>{competition.name}</SectionTitle>
                <Separator>/</Separator>
                <EventTitle>{event.name}</EventTitle>
              </TitleRow>
              <ContentWrapper>
                <StandingsWrapper>
                  <Standings eventId="winter2026" />
                </StandingsWrapper>
                <RightColumnWrapper>
                  <UpcomingMatches />
                  <BestPlayers />
                </RightColumnWrapper>
              </ContentWrapper>
            </div>
          ))}
        </div>
      ))}
    </Container>
  );
}