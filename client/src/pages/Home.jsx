import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, shadows, spacing } from '../theme';
import { IconTarget, IconChain, IconDocument, IconBolt, IconSearch, IconNetwork, IconCheck } from '../components/icons';
import { useInView } from '../hooks/useInView';

// Hero Section
const HeroSection = styled.section`
  position: relative;
  padding: ${spacing(10)} 0;
  background: #ffffff;
  color: ${colors.text.primary};
  overflow: hidden;
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: 960px) {
    flex-direction: row;
    text-align: left;
    align-items: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  
  @media (min-width: 960px) {
    margin-right: ${spacing(5)};
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: ${spacing(3)};
  line-height: 1.2;
  
  @media (min-width: 960px) {
    font-size: 3.5rem;
  }
  
  span {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 500;
    color: ${colors.primary.main};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: ${spacing(4)};
  color: ${colors.text.primary};
  max-width: 600px;

  @media (min-width: 960px) {
    font-size: 1.25rem;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-top: ${spacing(5)};

  @media (min-width: 960px) {
    margin-top: 0;
  }
`;

const CredentialCard = styled.div`
  position: relative;
  background: white;
  border: 1px solid ${colors.grey[200]};
  border-radius: 18px;
  box-shadow: ${shadows.lg}, 0 20px 40px -20px rgba(22, 163, 74, 0.35);
  overflow: hidden;
  width: 100%;
  max-width: 340px;
`;

const CredentialAccent = styled.div`
  height: 6px;
  background: linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main});
`;

const CredentialBody = styled.div`
  padding: ${spacing(4)};
`;

const CredentialCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: ${spacing(3)};

  img {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }
`;

const CredentialCardTitle = styled.div`
  flex: 1;

  div:first-child {
    font-weight: 600;
    font-size: 0.95rem;
  }

  div:last-child {
    font-size: 0.75rem;
    color: ${colors.text.secondary};
  }
`;

const CredentialBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: ${colors.primary.dark};
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing(3)};
  margin-bottom: ${spacing(3)};
`;

const ScoreRing = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  flex-shrink: 0;
  background: conic-gradient(
    ${colors.primary.main} ${p => p.$percent * 3.6}deg,
    ${colors.grey[100]} 0deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScoreRingInner = styled.div`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreValue = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${colors.primary.main};
  line-height: 1;
`;

const ScoreOutOf = styled.div`
  font-size: 0.65rem;
  color: ${colors.text.secondary};
  margin-top: 2px;
`;

const CredentialLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text.primary};
`;

const CredentialSubLabel = styled.div`
  font-size: 0.82rem;
  color: ${colors.text.secondary};
  margin-top: 2px;
`;

const CredentialMeta = styled.div`
  padding-top: ${spacing(3)};
  border-top: 1px solid ${colors.grey[200]};
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CredentialMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing(2)};
  color: ${colors.text.secondary};

  strong {
    color: ${colors.text.primary};
    font-weight: 500;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing(2)};
  justify-content: center;
  
  @media (min-width: 960px) {
    justify-content: flex-start;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: ${colors.secondary.main};
  color: ${colors.secondary.contrastText};
  font-weight: 600;
  padding: ${spacing(2)} ${spacing(4)};
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${shadows.md};
  
  &:hover {
    background-color: ${colors.secondary.dark};
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    text-decoration: none;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: ${colors.primary.main};
  font-weight: 600;
  padding: ${spacing(2)} ${spacing(4)};
  border-radius: 50px;
  text-decoration: none;
  border: 2px solid ${colors.primary.main};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${colors.primary.main};
    color: white;
    transform: translateY(-3px);
    text-decoration: none;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: ${spacing(10)} 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${spacing(6)};
  color: ${colors.primary.main};

  span {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-weight: 500;
  }

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: ${colors.secondary.main};
    margin: ${spacing(2)} auto 0;
    border-radius: 2px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing(4)};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: ${shadows.md};
  padding: ${spacing(4)};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${shadows.lg};
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background-color: ${colors.primary.light}10;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing(3)};
  color: ${colors.primary.main};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${spacing(2)};
  color: ${colors.primary.main};
`;

const FeatureDescription = styled.p`
  color: ${colors.text.primary};
  line-height: 1.6;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: ${spacing(10)} 0;
  background-color: #f0fdf4;
`;

const StepsList = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
`;

const StepRow = styled.div`
  display: flex;
  gap: ${spacing(3)};
  opacity: ${p => (p.$visible ? 1 : 0)};
  transform: translateY(${p => (p.$visible ? '0' : '18px')});
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: ${p => p.$delay};
`;

const StepNumberCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  font-weight: 700;
  flex-shrink: 0;
`;

const StepConnector = styled.div`
  width: 2px;
  flex: 1;
  min-height: 28px;
  background: ${colors.grey[200]};
  margin: 6px 0;
`;

const StepBody = styled.div`
  flex: 1;
  padding-bottom: ${spacing(5)};
`;

const StepTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: ${spacing(1)};
  color: ${colors.primary.main};
`;

const StepDescription = styled.p`
  color: ${colors.text.primary};
  font-size: 0.95rem;
  line-height: 1.6;
`;

// CTA Section
const CTASection = styled.section`
  padding: ${spacing(10)} 0;
  text-align: center;
  background: #ffffff;
  color: ${colors.text.primary};
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: ${spacing(3)};
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: ${spacing(5)};
  color: ${colors.text.primary};
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${colors.primary.main};
  color: white;
  font-weight: 600;
  padding: ${spacing(2)} ${spacing(5)};
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: ${shadows.md};
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.lg};
    text-decoration: none;
    background-color: ${colors.primary.dark};
  }
`;

// Partners Section
const PartnersSection = styled.section`
  padding: ${spacing(8)} 0;
  background-color: white;
`;

const PartnersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
  text-align: center;
`;

const PartnersTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: ${spacing(5)};
  color: ${colors.text.secondary};
`;

const PartnersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: ${spacing(6)};
`;

const StackBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
    color: ${colors.primary.main};
  }
`;

const HOW_IT_WORKS_STEPS = [
  {
    title: 'Submit a Target Agent',
    description:
      "Give CredentialMint the serviceId of the agent you want verified, plus an optional test input to send it.",
  },
  {
    title: 'A Real Order Is Placed',
    description:
      "CredentialMint negotiates, pays, and waits for delivery from the target agent's service — exactly as any other CAP Requester would.",
  },
  {
    title: 'Deliverable Is Scored',
    description:
      'The response is graded on completeness, structure, and delivery latency against the declared requirements.',
  },
  {
    title: 'Signed Credential Delivered',
    description:
      "You receive a structured, on-chain-settled verification report bound to the target agent's DID — ready to share or query.",
  },
];

const StepItem = ({ index, title, description, isLast }) => {
  const [ref, visible] = useInView();
  return (
    <StepRow ref={ref} $visible={visible} $delay={`${index * 0.12}s`}>
      <StepNumberCol>
        <StepNumber>{index + 1}</StepNumber>
        {!isLast && <StepConnector />}
      </StepNumberCol>
      <StepBody>
        <StepTitle>{title}</StepTitle>
        <StepDescription>{description}</StepDescription>
      </StepBody>
    </StepRow>
  );
};

const Home = () => {
  const stack = ['CROO Agent Protocol', 'Base L2', 'USDC Settlement', 'ERC-4337 Wallets'];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>
              Benchmark-Verified <span>Skill Credentials</span> for AI Agents
            </HeroTitle>
            <HeroSubtitle>
              CredentialMint places a real, paid CAP order against any agent's declared service,
              scores what it actually delivers, and issues a signed, on-chain-settled credential —
              so buyers know an agent can do what it claims.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/verify">Verify an Agent</PrimaryButton>
              <SecondaryButton to="/dashboard">View Reports</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
          <HeroImage>
            <CredentialCard>
              <CredentialAccent />
              <CredentialBody>
                <CredentialCardHeader>
                  <img src="/logo.png" alt="CredentialMint" />
                  <CredentialCardTitle>
                    <div>Skill Verification Report</div>
                    <div>Issued by CredentialMint</div>
                  </CredentialCardTitle>
                  <CredentialBadge><IconCheck size={14} /> Verified</CredentialBadge>
                </CredentialCardHeader>

                <ScoreRow>
                  <ScoreRing $percent={94}>
                    <ScoreRingInner>
                      <ScoreValue>94</ScoreValue>
                      <ScoreOutOf>/ 100</ScoreOutOf>
                    </ScoreRingInner>
                  </ScoreRing>
                  <div>
                    <CredentialLabel>Benchmark Score</CredentialLabel>
                    <CredentialSubLabel>Scored on completeness, structure &amp; latency</CredentialSubLabel>
                  </div>
                </ScoreRow>

                <CredentialMeta>
                  <CredentialMetaRow><span>Target service</span><strong>svc_9f21…b3</strong></CredentialMetaRow>
                  <CredentialMetaRow><span>Settled</span><strong>0.10 USDC on Base</strong></CredentialMetaRow>
                  <CredentialMetaRow><span>Order status</span><strong>completed</strong></CredentialMetaRow>
                </CredentialMeta>
              </CredentialBody>
            </CredentialCard>
          </HeroImage>
        </HeroContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Trust a <span>CredentialMint Report</span></SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><IconTarget size={26} /></FeatureIcon>
            <FeatureTitle>Real Benchmark Orders</FeatureTitle>
            <FeatureDescription>
              CredentialMint places an actual CAP order against the target agent's service —
              not a survey or a self-report — and scores the real deliverable it returns.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><IconChain size={26} /></FeatureIcon>
            <FeatureTitle>On-Chain Settlement</FeatureTitle>
            <FeatureDescription>
              Every verification is a real order: negotiated, escrowed, and settled in USDC
              on Base through CAPVault, just like any other CAP transaction.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><IconDocument size={26} /></FeatureIcon>
            <FeatureTitle>Composable Credentials</FeatureTitle>
            <FeatureDescription>
              Results are delivered as structured Schema JSON bound to the target agent's DID,
              so other agents and marketplaces can query and trust them.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><IconBolt size={26} /></FeatureIcon>
            <FeatureTitle>Fast Turnaround</FeatureTitle>
            <FeatureDescription>
              Most verifications complete well inside the target service's own SLA window —
              typically a few minutes, not days.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><IconSearch size={26} /></FeatureIcon>
            <FeatureTitle>Objective Scoring</FeatureTitle>
            <FeatureDescription>
              Deliverables are graded on completeness, structure, and delivery latency —
              not marketing copy or self-reported claims.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><IconNetwork size={26} /></FeatureIcon>
            <FeatureTitle>A2A Ready</FeatureTitle>
            <FeatureDescription>
              Built entirely on the CROO Agent Protocol SDK, so any Provider or Requester
              agent can hire CredentialMint programmatically.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsList>
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepItem
              key={step.title}
              index={index}
              title={step.title}
              description={step.description}
              isLast={index === HOW_IT_WORKS_STEPS.length - 1}
            />
          ))}
        </StepsList>
      </HowItWorksSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Verify an Agent?</CTATitle>
          <CTADescription>
            Get an objective, on-chain-settled skill credential for any CAP agent in minutes.
          </CTADescription>
          <CTAButton to="/verify">Start Verification</CTAButton>
        </CTAContainer>
      </CTASection>

      <PartnersSection>
        <PartnersContainer>
          <PartnersTitle>Built on the CROO Agent Protocol</PartnersTitle>
          <PartnersGrid>
            {stack.map((item) => (
              <StackBadge key={item}>{item}</StackBadge>
            ))}
          </PartnersGrid>
        </PartnersContainer>
      </PartnersSection>
    </>
  );
};

export default Home; 