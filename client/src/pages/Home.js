import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, typography, shadows, spacing } from '../theme';

// Import the SVG assets
import hederaLogo from '../assets/hedera-logo.svg';
import verificationIllustration from '../assets/verification-illustration.svg';

// Hero Section
const HeroSection = styled.section`
  position: relative;
  padding: ${spacing(10)} 0;
  background: linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%);
  color: white;
  border-radius: 0 0 50px 50px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,0.05)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
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
    color: ${colors.secondary.main};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: ${spacing(4)};
  opacity: 0.9;
  max-width: 600px;
  
  @media (min-width: 960px) {
    font-size: 1.5rem;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin-top: ${spacing(5)};
  
  img {
    max-width: 100%;
    height: auto;
    max-height: 400px;
  }
  
  @media (min-width: 960px) {
    margin-top: 0;
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
  color: white;
  font-weight: 600;
  padding: ${spacing(2)} ${spacing(4)};
  border-radius: 50px;
  text-decoration: none;
  border: 2px solid white;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
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
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${colors.primary.light}10;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing(3)};
  font-size: 2rem;
  color: ${colors.primary.main};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${spacing(2)};
  color: ${colors.primary.main};
`;

const FeatureDescription = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: ${spacing(10)} 0;
  background-color: ${colors.grey[100]};
`;

const StepsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 ${spacing(3)};
`;

const Step = styled.div`
  display: flex;
  margin-bottom: ${spacing(8)};
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:nth-child(even) {
    @media (min-width: 768px) {
      flex-direction: row-reverse;
    }
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${spacing(3)};
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const StepContent = styled.div`
  flex: 1;
  padding: 0 ${spacing(2)};
  
  @media (min-width: 768px) {
    padding: 0 ${spacing(4)};
  }
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${spacing(2)};
  color: ${colors.primary.main};
`;

const StepDescription = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

// CTA Section
const CTASection = styled.section`
  padding: ${spacing(10)} 0;
  text-align: center;
  background: linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%);
  color: white;
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
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${colors.primary.main};
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
    background-color: ${colors.secondary.main};
    color: ${colors.secondary.contrastText};
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

const PartnerLogo = styled.img`
  height: 40px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const Home = () => {
  // Placeholder for partner logos
  const partners = [
    { name: 'Hedera', logo: hederaLogo },
    // Add more partner logos as needed
  ];

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroTitle>
              AI-Powered <span>Identity Verification</span> on Hedera
            </HeroTitle>
            <HeroSubtitle>
              Secure, fast, and reliable identity verification leveraging AI and the Hedera network
              for enhanced privacy and security in your DApps.
            </HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton to="/verify">Start Verification</PrimaryButton>
              <SecondaryButton to="/dashboard">View Dashboard</SecondaryButton>
            </ButtonGroup>
          </HeroContent>
          <HeroImage>
            <img src={verificationIllustration} alt="Identity Verification" />
          </HeroImage>
        </HeroContainer>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Our Solution</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Blockchain Security</FeatureTitle>
            <FeatureDescription>
              Your identity verification results are securely stored on the Hedera network, 
              providing immutable records that cannot be tampered with.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Analysis</FeatureTitle>
            <FeatureDescription>
              Advanced AI algorithms verify your identity documents in real-time, 
              detecting fraud and ensuring accuracy with high confidence.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Experience verification in seconds, not hours or days, 
              thanks to Hedera's high throughput and our optimized AI processing.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔐</FeatureIcon>
            <FeatureTitle>Privacy Focused</FeatureTitle>
            <FeatureDescription>
              We only store cryptographic proofs on the blockchain, 
              keeping your sensitive personal information private and secure.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>Global Compliance</FeatureTitle>
            <FeatureDescription>
              Our solution meets KYC and AML requirements across jurisdictions, 
              making it suitable for global applications and services.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔄</FeatureIcon>
            <FeatureTitle>Easy Integration</FeatureTitle>
            <FeatureDescription>
              Integrate with your DApps and services using our simple API, 
              with comprehensive documentation and developer support.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <StepsContainer>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Capture Your Selfie</StepTitle>
              <StepDescription>
                Take a clear selfie using your device's camera. Our AI will use this to match with your ID document 
                and ensure you're the legitimate owner of the identity documents.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>Upload ID Document</StepTitle>
              <StepDescription>
                Upload a photo of your government-issued ID document (passport, driver's license, or national ID card). 
                Our system supports various document types from countries around the world.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>AI Verification</StepTitle>
              <StepDescription>
                Our advanced AI algorithms analyze your documents and selfie in real-time, 
                checking for authenticity, matching your face to the ID photo, and extracting relevant information.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>Blockchain Storage</StepTitle>
              <StepDescription>
                Verification results are securely stored on the Hedera network using the ElizaOS plugin, 
                creating an immutable record while keeping your personal data private.
              </StepDescription>
            </StepContent>
          </Step>
          
          <Step>
            <StepNumber>5</StepNumber>
            <StepContent>
              <StepTitle>Access Your Verification</StepTitle>
              <StepDescription>
                Receive a unique verification ID that you can use to access and share your verification status 
                with third-party applications and services that require identity verification.
              </StepDescription>
            </StepContent>
          </Step>
        </StepsContainer>
      </HowItWorksSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Get Verified?</CTATitle>
          <CTADescription>
            Start the verification process now and experience the future of secure, 
            blockchain-based identity verification powered by Hedera and AI.
          </CTADescription>
          <CTAButton to="/verify">Start Verification Now</CTAButton>
        </CTAContainer>
      </CTASection>

      <PartnersSection>
        <PartnersContainer>
          <PartnersTitle>Trusted By Industry Leaders</PartnersTitle>
          <PartnersGrid>
            {partners.map((partner, index) => (
              <PartnerLogo 
                key={index} 
                src={partner.logo} 
                alt={`${partner.name} logo`} 
              />
            ))}
          </PartnersGrid>
        </PartnersContainer>
      </PartnersSection>
    </>
  );
};

export default Home; 