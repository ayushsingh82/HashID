import React from 'react';
import styled from 'styled-components';
import { colors } from '../theme';

const FooterContainer = styled.footer`
  background-color: #ffffff;
  padding: 20px 0;
  margin-top: 40px;
  border-top: 1px solid ${colors.grey[200]};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Copyright = styled.p`
  margin: 0;
  color: #757575;
`;

const Links = styled.div`
  display: flex;
  gap: 20px;
  
  a {
    color: ${colors.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {new Date().getFullYear()} CredentialMint. Built on the CROO Agent Protocol.
        </Copyright>
        <Links>
          <a href="https://croo.network" target="_blank" rel="noopener noreferrer">CROO</a>
          <a href="https://docs.croo.network" target="_blank" rel="noopener noreferrer">CAP Docs</a>
          <a href="https://agent.croo.network" target="_blank" rel="noopener noreferrer">Agent Store</a>
        </Links>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 