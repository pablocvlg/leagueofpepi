import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

const Nav = styled.nav`
  display: flex;
  justify-content: flex-start;
  padding: 0 2rem;
  background-color: #1a1a1aff;
  align-items: stretch;
  box-shadow: 0 2px 6px rgba(21, 83, 17, 0.75);
  gap: 1.5rem;
`;

const NavLink = styled(RouterNavLink)`
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s ease;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  letter-spacing: 0.15em;
  font-size: 14px;
  padding: 0.7rem 0.8rem;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #c2890f !important;
  }
  
  &.active {
    background-color: #2a2a2aff;
    color: #13bb91ff;
  }
`;

export default function Navbar() {
  return (
    <Nav>
      <NavLink to="/">HOME</NavLink>
      <NavLink to="/players">PLAYERS</NavLink>
      <NavLink to="/teams">TEAMS</NavLink>
      <NavLink to="/matches">MATCHES</NavLink>
    </Nav>
  );
}