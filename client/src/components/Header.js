import React from 'react';
import { Link } from 'react-router-dom';
import { useHedera } from '../context/HederaContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #3949ab;
  color: white;
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  
  a {
    color: white;
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  
  a {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
`;

const AccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
`;

const Header = () => {
  const { isConnected, accountId, balance, connectToHedera, loading } = useHedera();

  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link to="/">HashID</Link>
        </Logo>
        
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/verify">Verify Identity</Link>
          {isConnected && <Link to="/dashboard">Dashboard</Link>}
        </NavLinks>
        
        {isConnected ? (
          <AccountInfo>
            <span>Account: {accountId}</span>
            <span>Balance: {balance} HBAR</span>
          </AccountInfo>
        ) : (
          <button 
            className="btn" 
            onClick={connectToHedera} 
            disabled={loading}
          >
            {loading ? 'Connecting...' : 'Connect to Hedera'}
          </button>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 