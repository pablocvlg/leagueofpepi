import styled from "styled-components";
import { useData } from "../../hooks/useData";
import { useState } from "react";

type SortKey = "wins" | "rating";
type SortDir = "asc" | "desc";

const SortIndicator = ({
  active,
  dir,
}: {
  active: boolean;
  dir: SortDir;
}) => {
  if (!active) return null;
  return <span>{dir === "asc" ? " ↑" : " ↓"}</span>;
};

const Container = styled.div`
  padding: 1rem;
  background-color: #0f0f10;
  border-radius: 12px;
  color: #fff;
  max-width: 1000px;
  margin: 0 0;
  font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", "Helvetica Neue",
    Arial;
`;

/* Header row */
const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderRank = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
`;

const HeaderLeft = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const HeaderRating = styled.div`
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
`;

const HeaderScore = styled.div`
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
`;

const TeamRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
`;

const RankCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 1000;
  font-size: 20px;
`;

/* rounded dark card containing logo/name/record */
const TeamCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.6) inset;
`;

/* left area with logo + name */
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

/* circular logo placeholder (if you have logos, replace background-image) */
const Logo = styled.div<{ src?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.03);
  background-position: center;
  background-size: cover;
  flex-shrink: 0;
  display: inline-block;
`;

/* name styled like link with subtle underline */
const TeamName = styled.a`
  color: #e6e6e6;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    text-decoration: underline;
  }
`;

/* right area containing rating and record */
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
`;

/* rating */
const TeamRating = styled.div`
  width: 56px;
  text-align: center;
  font-weight: 600;
  color: #2fb0ff; /* blue */
`;

/* wins-losses */
const TeamRecord = styled.div`
  width: 110px;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
`;

/* team abbreviation beneath name */
const TeamMeta = styled.div`
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  margin-top: 2px;
`;

export default function Standings({ eventId }: { eventId: string }) {
  const { data, loading, error } = useData();

  const [sortKey, setSortKey] = useState<SortKey>("wins");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  const event = data.competitions
    .flatMap((comp: any) => comp.events)
    .find((ev: any) => ev.id === eventId);

  if (!event) return <Container>Event not found</Container>;

  // Initialize win/loss record for each team
  const teamRecord: Record<string, { wins: number; losses: number }> = {};
  event.teams.forEach((team: any) => {
    teamRecord[team.id] = { wins: 0, losses: 0 };
  });

  // Count wins and losses
  (event.matches ?? []).forEach((match: any) => {
    const aId = match.teamA;
    const bId = match.teamB;

    // Support multiple score structures
    const aScore = Number(match.score?.teamA ?? match.score?.a ?? match.score?.[aId] ?? 0);
    const bScore = Number(match.score?.teamB ?? match.score?.b ?? match.score?.[bId] ?? 0);

    if (!teamRecord[aId] || !teamRecord[bId]) return;

    if (aScore > bScore) {
      teamRecord[aId].wins += 1;
      teamRecord[bId].losses += 1;
    } else if (bScore > aScore) {
      teamRecord[bId].wins += 1;
      teamRecord[aId].losses += 1;
    }
  });

  // Compute team rating: average of ALL values inside player.ratings arrays
  const teamRating: Record<string, number> = {};
  
  event.teams.forEach((team: any) => {
    const players = team.players ?? [];
    const allRatings: number[] = [];

    players.forEach((p: any) => {
      const ratingsArr = Array.isArray(p.ratings) ? p.ratings : [];
      ratingsArr.forEach((r: any) => {
        const n = Number(r);
        if (Number.isFinite(n)) allRatings.push(n);
      });
    });

    // Base rating
    const baseRating =
      allRatings.length === 0
        ? 0
        : allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

    // Draft adjustment (-0.5 .. 0.5)
    const drafts = Array.isArray(team.drafts) ? team.drafts : [];
    let draftAdjustment = 0;

    if (drafts.length > 0) {
      const avgDraft =
        drafts.reduce((a: number, b: number) => a + b, 0) / drafts.length;

      // Drafts 0..3 -> -0.5..0.5
      draftAdjustment = -0.5 + (avgDraft / 3);
    }

    teamRating[team.id] = Number((baseRating + draftAdjustment).toFixed(2));
  });

  // Sort teams by number of wins (descending)
  const sortedTeams = [...event.teams].sort((a: any, b: any) => {
    let aValue = 0;
    let bValue = 0;

    if (sortKey === "wins") {
      aValue = teamRecord[a.id].wins;
      bValue = teamRecord[b.id].wins;
    }

    if (sortKey === "rating") {
      aValue = teamRating[a.id] ?? 0;
      bValue = teamRating[b.id] ?? 0;
    }

    return sortDir === "asc" ? aValue - bValue : bValue - aValue;
  });

  // Compute ranking positions with ties (1,1,3,...)
  let lastWins = Number.NEGATIVE_INFINITY;
  let lastRank = 0;
  let skip = 1;
  const positions: Record<string, number> = {};

  sortedTeams.forEach((team: any) => {
    const wins = teamRecord[team.id].wins;

    if (wins === lastWins) {
      // Same wins → same rank
      positions[team.id] = lastRank;
      skip++;
    } else {
      // New win count → advance rank by skip amount
      lastRank += skip;
      positions[team.id] = lastRank;
      skip = 1;
      lastWins = wins;
    }
  });

  return (
    <Container>
      {/* Header */}
      <HeaderRow>
        <HeaderRank>Pos.</HeaderRank>
        <HeaderContent>
          <HeaderLeft>Team</HeaderLeft>
          <HeaderRight>
            <HeaderRating
              onClick={() => handleSort("rating")}
              style={{ cursor: "pointer" }}
            >
              Rating
              <SortIndicator
                active={sortKey === "rating"}
                dir={sortDir}
              />
            </HeaderRating>
            <HeaderScore
              onClick={() => handleSort("wins")}
              style={{ cursor: "pointer" }}
            >
              Score
              <SortIndicator
                active={sortKey === "wins"}
                dir={sortDir}
              />
            </HeaderScore>
          </HeaderRight>
        </HeaderContent>
      </HeaderRow>

      {/* Teams */}
      {sortedTeams.map((team: any) => (
        <TeamRow key={team.id}>
          <RankCol>{positions[team.id]}</RankCol>

          <TeamCard>
            <Left>
              {/* replace Logo src prop with actual team logo */}
              <Logo style={{ backgroundImage: team.logo ? `url(${team.logo})` : undefined }} />
              <div style={{ minWidth: 0 }}>
                <TeamName href="#">{team.name}</TeamName>
                {team.abbrev && <TeamMeta>{team.abbrev}</TeamMeta>}
              </div>
            </Left>

            <Right>
              <TeamRating>
                {teamRating[team.id] === 0 ? "—" : teamRating[team.id].toFixed(2)}
              </TeamRating>

              <TeamRecord>
                {teamRecord[team.id].wins} V - {teamRecord[team.id].losses} D
              </TeamRecord>
            </Right>
          </TeamCard>
        </TeamRow>
      ))}
    </Container>
  );
}