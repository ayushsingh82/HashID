import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCredentialMint } from '../context/CredentialMintContext';
import { colors } from '../theme';
import { IconCheck, IconCross } from '../components/icons';

const ResultContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 0.9rem;
`;

const ResultCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1rem;
  }

  p {
    font-size: 0.85rem;
  }
`;

const StatusIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 14px;
`;

const ScoreValue = styled.div`
  font-size: 2.1rem;
  font-weight: 800;
  color: ${colors.primary.main};
  margin-bottom: 4px;
`;

const VerificationDetails = styled.div`
  background: #f0fdf4;
  border-radius: 8px;
  padding: 16px 20px;
  margin-top: 24px;
  text-align: left;
  font-size: 0.85rem;
`;

const DetailItem = styled.div`
  margin-bottom: 12px;
  word-break: break-all;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    display: inline-block;
    min-width: 130px;
    word-break: normal;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 20px;
  margin-top: 30px;
`;

const VerificationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getVerificationReport, loading } = useCredentialMint();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const reportId = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setError('Report ID not found');
        return;
      }

      const data = await getVerificationReport(reportId);
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || 'Failed to retrieve verification report');
      }
    };

    fetchReport();
  }, [reportId, getVerificationReport]);

  if (loading) {
    return (
      <ResultContainer>
        <ResultCard>
          <h2>Loading verification report...</h2>
          <p>Please wait while we retrieve the credential details.</p>
        </ResultCard>
      </ResultContainer>
    );
  }

  if (error) {
    return (
      <ResultContainer>
        <ResultCard>
          <StatusIcon><IconCross size={48} /></StatusIcon>
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

  if (!report) {
    return (
      <ResultContainer>
        <ResultCard>
          <h2>No report found</h2>
          <p>We couldn't find any verification report with the provided ID.</p>
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
        <StatusIcon>{report.verified ? <IconCheck size={48} /> : <IconCross size={48} />}</StatusIcon>

        <h2>{report.verified ? 'Skill Credential Verified' : 'Verification Failed'}</h2>

        <ScoreValue>{report.score}/100</ScoreValue>

        <p>
          {report.verified
            ? `The target agent's service was benchmarked and its deliverable met CredentialMint's minimum quality threshold.`
            : `The target agent's service did not meet the minimum score threshold: ${report.summary}`}
        </p>

        <VerificationDetails>
          <h3>Verification Details</h3>
          <DetailItem>
            <strong>Report ID:</strong> {reportId}
          </DetailItem>
          <DetailItem>
            <strong>Target Service:</strong> {report.targetServiceId}
          </DetailItem>
          <DetailItem>
            <strong>Deliverable Type:</strong> {report.deliverableType}
          </DetailItem>
          <DetailItem>
            <strong>Latency:</strong> {Math.round(report.latencyMs / 1000)}s
          </DetailItem>
          <DetailItem>
            <strong>Summary:</strong> {report.summary}
          </DetailItem>
          <DetailItem>
            <strong>Verified At:</strong> {new Date(report.verifiedAt).toLocaleString()}
          </DetailItem>
          <DetailItem>
            <strong>CAP Order ID:</strong> {report.orderId}
          </DetailItem>
        </VerificationDetails>

        <ButtonContainer>
          {!report.verified && (
            <button className="btn" onClick={() => navigate('/verify')}>
              Try Another Agent
            </button>
          )}
          <button className="btn" onClick={() => navigate('/')}>
            Return to Home
          </button>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </ButtonContainer>
      </ResultCard>
    </ResultContainer>
  );
};

export default VerificationResult;
