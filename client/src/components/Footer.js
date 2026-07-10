import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f5f5f5;
  padding: 20px 0;
  margin-top: 40px;
  border-top: 1px solid #e0e0e0;
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
    color: #3949ab;
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
          © {new Date().getFullYear()} Hedera ID Verify. All rights reserved.
        </Copyright>
        <Links>
          <a href="https://hedera.com" target="_blank" rel="noopener noreferrer">Hedera</a>
          <a href="https://docs.hedera.com" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="https://github.com/elizaOS/eliza-plugin-hedera" target="_blank" rel="noopener noreferrer">GitHub</a>
        </Links>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 