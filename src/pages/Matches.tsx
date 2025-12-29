import styled from "styled-components";
import { useData } from "../hooks/useData";
import MatchCard from "../components/matchespage/MatchCard";
import type { Match, Team } from "../types/Data";
import Loading from "../components/Loading";

const Container = styled.div`
  color: #fff;
  min-height: 100vh;
  padding: 1rem;
  max-width: 60rem;
  margin: 0 auto;
`;

const DateSection = styled.div`
  margin-bottom: 2rem;
`;

const DateHeader = styled.h2`
  font-size: 1rem;
  font-weight: 550;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const groupMatchesByDate = (matches: Match[]) => {
  const grouped: { [key: string]: Match[] } = {};
  
  matches.forEach((match) => {
    const date = new Date(match.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(match);
  });

  return grouped;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function Matches() {
  const { data, loading, error } = useData();
  
  if (loading) return <Loading text="Generating match calendar…" />;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  const matches: Match[] = data.competitions.flatMap((comp) =>
    comp.events.flatMap((event) => event.matches)
  );
  
  const teams: Team[] = data.competitions.flatMap((comp) =>
    comp.events.flatMap((event) => event.teams)
  );

  const getTeam = (teamId: string) => {
    return teams.find((t) => t.id === teamId);
  };

  const groupedMatches = groupMatchesByDate(matches);

  return (
    <Container>
      {Object.entries(groupedMatches).map(([dateKey, dayMatches]) => (
        <DateSection key={dateKey}>
          <DateHeader>
            {formatDate(dayMatches[0].date)}
          </DateHeader>
          
          <MatchesList>
            {dayMatches.map((match) => {
              const teamA = getTeam(match.teamA);
              const teamB = getTeam(match.teamB);
              const time = formatTime(match.date);

              return (
                <MatchCard
                  key={match.id}
                  match={match}
                  teamA={teamA}
                  teamB={teamB}
                  time={time}
                />
              );
            })}
          </MatchesList>
        </DateSection>
      ))}
    </Container>
  );
}