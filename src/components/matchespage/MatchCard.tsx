// MatchCard.tsx
import styled from 'styled-components';
import { useState } from 'react';

const MatchCardWrapper = styled.div`
  background-color: #18181b;
  border-radius: 0.75rem;
  overflow: hidden;
`;

const MatchCardContainer = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #27272a;
  }
`;

const CommentsSection = styled.div<{ $isOpen: boolean }>`
  background-color: #313635ff;
  padding: ${props => props.$isOpen ? '1.5rem' : '0 1rem'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.15s ease, opacity 0.15s ease, padding 0.15s ease;
  color: #c1c4ccff;
  font-size: 0.8rem;
  line-height: 1.5;
`;

const TimeText = styled.div`
  width: 4rem;
  font-size: 1.25rem;
  font-weight: 550;
  color: #acb3beff;
  padding: 0rem 2.5rem 0rem 1rem;
`;

const TeamsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1.5rem;
`;

const TeamSection = styled.div<{ $align?: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 8rem;
  justify-content: ${props => props.$align === 'left' ? 'flex-end' : 'flex-start'};
`;

const TeamAbbrev = styled.span`
  font-size: 1rem;
  font-weight: 600;
  padding: 0rem 0.5rem;
`;

const TeamLogo = styled.img`
  width: 3rem;
  height: 3rem;
  object-fit: contain;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 60px;
  justify-content: center;
`;

const ScoreText = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
`;

const ScoreSeparator = styled.span`
  color: #6b7280;
  font-size: 1.125rem;
`;

const Slash = styled.span`
  color: #6b7280;
  font-size: 1.5rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.75rem;
  color: #acb3beff;
  width: 8rem;
  padding: 0rem 1rem 0rem 0rem;
`;

interface MatchCardProps {
  match: any;
  teamA: any;
  teamB: any;
  time: string;
}

export default function MatchCard({ match, teamA, teamB, time }: MatchCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isMatchPlayed = (): boolean => {
    return match.score.teamA > 0 || match.score.teamB > 0;
  };

  const played = isMatchPlayed();

  const toggleComments = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MatchCardWrapper>
      <MatchCardContainer onClick={toggleComments}>
        <TimeText>{time}</TimeText>

        <TeamsContainer>
          <TeamSection $align="left">
            <TeamAbbrev>{teamA?.abbrev}</TeamAbbrev>
            <TeamLogo src={teamA?.logo} alt={teamA?.name} />
          </TeamSection>

          <ScoreContainer>
            {played ? (
              <>
                <ScoreText>{match.score.teamA}</ScoreText>
                <ScoreSeparator>-</ScoreSeparator>
                <ScoreText>{match.score.teamB}</ScoreText>
              </>
            ) : (
              <Slash>/</Slash>
            )}
          </ScoreContainer>

          <TeamSection $align="right">
            <TeamLogo src={teamB?.logo} alt={teamB?.name} />
            <TeamAbbrev>{teamB?.abbrev}</TeamAbbrev>
          </TeamSection>
        </TeamsContainer>

        <InfoSection>
          <span>{match.stage}</span>
          <span>{match.phase}</span>
        </InfoSection>
      </MatchCardContainer>

      <CommentsSection $isOpen={isOpen}>
        {match.comments || 'No comments available.'}
      </CommentsSection>
    </MatchCardWrapper>
  );
}