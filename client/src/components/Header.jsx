import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  color: ${colors.text.primary};
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  flex-shrink: 0;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.text.primary};
    text-decoration: none;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  order: 3;
  flex-basis: 100%;
  justify-content: center;

  a {
    color: ${colors.text.primary};
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    transition: color 0.3s;

    &:hover {
      color: ${colors.primary.main};
    }
  }

  @media (min-width: 720px) {
    order: 2;
    flex-basis: auto;
    justify-content: flex-start;
  }
`;

const StoreLink = styled.a`
  display: inline-block;
  white-space: nowrap;
  order: 2;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  @media (min-width: 720px) {
    order: 3;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link to="/">
            <img src="/logo.png" alt="CredentialMint" />
            CredentialMint
          </Link>
        </Logo>

        <NavLinks>
          <Link to="/verify">Verify an Agent</Link>
          <Link to="/dashboard">Reports</Link>
        </NavLinks>

        <StoreLink
          className="btn"
          href="https://agent.croo.network/agents/df96b86f-82de-425d-9daa-b8d333b7153f"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on CROO Store
        </StoreLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
