import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useHedera } from '../context/HederaContext';

const ResultContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
`;

const StatusIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const VerificationDetails = styled.div`
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
  text-align: left;
`;

const DetailItem = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  strong {
    display: inline-block;
    min-width: 150px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getVerificationResult, loading } = useHedera();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Get verification ID from URL query parameter
  const verificationId = new URLSearchParams(location.search).get('id');
  
  useEffect(() => {
    const fetchResult = async () => {
      if (!verificationId) {
        setError('Verification ID not found');
        return;
      }
      
      const data = await getVerificationResult(verificationId);
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to retrieve verification result');
      }
    };
    
    fetchResult();
  }, [verificationId, getVerificationResult]);
  
  if (loading) {
    return (
      <ResultContainer>
        <ResultCard>
          <h2>Loading verification result...</h2>
          <p>Please wait while we retrieve your verification details.</p>
        </ResultCard>
      </ResultContainer>
    );
  }
  
  if (error) {
    return (
      <ResultContainer>
        <ResultCard>
          <StatusIcon>❌</StatusIcon>
          <h2>Error</h2>
          <p>{error}</p>
          <ButtonContainer>
            <button className="btn" onClick={() => navigate('/')}>
              Return to Home
            </button>
          </ButtonContainer>
        </ResultCard>
      </ResultContainer>
    );
  }
  
  if (!result) {
    return (
      <ResultContainer>
        <ResultCard>
          <h2>No result found</h2>
          <p>We couldn't find any verification result with the provided ID.</p>
          <ButtonContainer>
            <button className="btn" onClick={() => navigate('/')}>
              Return to Home
            </button>
          </ButtonContainer>
        </ResultCard>
      </ResultContainer>
    );
  }
  
  return (
    <ResultContainer>
      <ResultCard>
        <StatusIcon>
          {result.status === 'approved' ? '✅' : 
           result.status === 'pending' ? '⏳' : '❌'}
        </StatusIcon>
        
        <h2>
          {result.status === 'approved' ? 'Verification Approved' : 
           result.status === 'pending' ? 'Verification Pending' : 'Verification Failed'}
        </h2>
        
        <p>
          {result.status === 'approved' ? 
            'Your identity has been successfully verified. You can now proceed with your application.' : 
           result.status === 'pending' ? 
            'Your verification is being processed. This usually takes a few minutes.' : 
            `Verification failed: ${result.reason || 'Please check your information and try again.'}`}
        </p>
        
        <VerificationDetails>
          <h3>Verification Details</h3>
          <DetailItem>
            <strong>Verification ID:</strong> {verificationId}
          </DetailItem>
          <DetailItem>
            <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
          </DetailItem>
          <DetailItem>
            <strong>Transaction ID:</strong> {result.transactionId}
          </DetailItem>
          {result.expiryDate && (
            <DetailItem>
              <strong>Valid Until:</strong> {new Date(result.expiryDate).toLocaleDateString()}
            </DetailItem>
          )}
        </VerificationDetails>
        
        <ButtonContainer>
          {result.status === 'failed' && (
            <button className="btn" onClick={() => navigate('/verify')}>
              Try Again
            </button>
          )}
          <button className="btn" onClick={() => navigate('/')}>
            Return to Home
          </button>
          {result.status === 'approved' && (
            <button className="btn" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          )}
        </ButtonContainer>
      </ResultCard>
    </ResultContainer>
  );
};

export default VerificationResult; 