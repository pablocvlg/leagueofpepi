import styled from "styled-components";
import type { Player } from "../types/Data";

type PlayerCardProps = {
  player: Player;
};

const Card = styled.div`
  background-color: #111;
  border-radius: 36px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Name = styled.h2`
  font-size: 1.2rem;
  margin: 0 0.5rem;
`;

const Role = styled.span`
  font-size: 0.9rem;
  color: #aaa;
  margin: 0 0.5rem;
`;

const Rating = styled.span`
  font-size: 1rem;
  color: #00aaff;
  margin: 0 0.5rem;
`;

export default function PlayerCard({ player }: PlayerCardProps) {
  const ratings = player.ratings.length ? player.ratings : [0];
  const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

  return (
    <Card>
      <Name>{player.name}</Name>
      <Role>{player.role}</Role>
      <Rating>Rating: {avgRating.toFixed(1)}</Rating>
    </Card>
  );
}