/* ===================== IMPORTS ===================== */

import styled from "styled-components";
import { useState, useMemo } from "react";
import { useData } from "../hooks/useData";
import Loading from "../components/Loading";
import type { Player, Team } from "../types/Data";

/* ===================== STYLES ===================== */

const Container = styled.div`
  padding: 2rem 0rem;
  max-width: 60rem;
  margin: 0 auto;
`;

const Layout = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlayersContainer = styled.div`
  background: linear-gradient(135deg, #4e745eff 0%, #11251aff 100%);
  border-radius: 12px;
  padding: 1.1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderLeft = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
`;

const HeaderRight = styled.div`
  display: flex;
  padding-right: 0.5rem;
`;

const HeaderSortButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    color: white;
  }
`;

const Card = styled.div`
  background: #0a0a0a;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0.5rem 0;

  &:hover {
    background: #020e04ff;
    transform: scale(1.02);
  }
`;

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

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #53a089ff;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 0.5rem;
  color: #dadadaff;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #13bb91ff;
  }

  option {
    background-color: #18181b;
  }
`;

const ResultsCount = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0.75rem 0.25rem;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
`;

/* ===================== TYPES ===================== */

type SortState = "desc" | "asc" | "none";

const SortIndicator = ({ state }: { state: SortState }) => {
  if (state === "none") return null;
  return <span>{state === "asc" ? " ↑" : " ↓"}</span>;
};

interface PlayerWithTeam extends Player {
  teamId: string;
  teamName: string;
  teamAbbrev: string;
  teamLogo: string;
  avgRating: number;
}

/* ===================== COMPONENT ===================== */

export default function Players() {
  const { data, loading, error } = useData();

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortState, setSortState] = useState<SortState>("none");

  /* -------- Hooks -------- */

  const allPlayersWithTeam: PlayerWithTeam[] = useMemo(() => {
    if (!data) return [];

    return data.competitions.flatMap(comp =>
      comp.events.flatMap(event =>
        event.teams.flatMap(team =>
          team.players.map(player => {
            const ratings = player.ratings.length ? player.ratings : [0];
            const avg =
              ratings.reduce((s, r) => s + r, 0) / ratings.length;

            return {
              ...player,
              teamId: team.id,
              teamName: team.name,
              teamAbbrev: team.abbrev,
              teamLogo: team.logo,
              avgRating: avg
            };
          })
        )
      )
    );
  }, [data]);

  const allTeams: Team[] = useMemo(() => {
    if (!data) return [];
    return data.competitions.flatMap(comp =>
      comp.events.flatMap(event => event.teams)
    );
  }, [data]);

  const roles = useMemo(() => {
    const set = new Set(allPlayersWithTeam.map(p => p.role));
    return Array.from(set).sort();
  }, [allPlayersWithTeam]);

  const filteredAndSortedPlayers = useMemo(() => {
    return [...allPlayersWithTeam]
      .filter(p =>
        (selectedTeam === "all" || p.teamId === selectedTeam) &&
        (selectedRole === "all" || p.role === selectedRole)
      )
      .sort((a, b) => {
        if (sortState === "none") return 0;
        return sortState === "desc"
          ? b.avgRating - a.avgRating
          : a.avgRating - b.avgRating;
      });
  }, [allPlayersWithTeam, selectedTeam, selectedRole, sortState]);

  /* --------  CONDITIONAL RETURNS -------- */

  if (loading) return <Loading text="Crunching player data…" />;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data available</Container>;

  const handleSort = () => {
    setSortState(s =>
      s === "none" ? "desc" : s === "desc" ? "asc" : "none"
    );
  };

  return (
    <Container>
      <Layout>
        <MainContent>
          {filteredAndSortedPlayers.length === 0 ? (
            <NoResults>No players found</NoResults>
          ) : (
            <PlayersContainer>
              <HeaderRow>
                <HeaderLeft>Players</HeaderLeft>
                <HeaderRight>
          <HeaderSortButton onClick={handleSort}>
            Rating
            <SortIndicator state={sortState} />
          </HeaderSortButton>
        </HeaderRight>
              </HeaderRow>

              {filteredAndSortedPlayers.map(player => (
                <Card key={player.id}>
                  <PlayerImage src={player.teamLogo} />
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
            </PlayersContainer>
          )}
        </MainContent>

        <Sidebar>
          <FiltersContainer>
            <FilterGroup>
              <Label>Team</Label>
              <Select
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
              >
                <option value="all">All Teams</option>
                {allTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Label>Role</Label>
              <Select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersContainer>
          <ResultsCount>
            {filteredAndSortedPlayers.length} players
          </ResultsCount>
        </Sidebar>
      </Layout>
    </Container>
  );
}