import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCredentialMint } from '../context/CredentialMintContext';
import { colors } from '../theme';
import { IconCheck, IconWarning } from '../components/icons';

const VerificationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Step = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px;
  font-size: 1rem;
  background-color: ${props => props.$active ? colors.primary.main : '#e0e0e0'};
  color: ${props => props.$active ? 'white' : '#757575'};
  border-radius: 4px;
  margin: 0 5px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -10px;
    width: 20px;
    height: 2px;
    background-color: #e0e0e0;
    transform: translateY(-50%);
  }

  @media (max-width: 600px) {
    font-size: 0.75rem;
    padding: 10px 6px;
    margin: 0 3px;

    &:not(:last-child)::after {
      right: -6px;
      width: 12px;
    }
  }
`;

const StepContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 16px;
    font-family: inherit;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  color: ${colors.primary.main};
`;

const ModalTitle = styled.h2`
  margin-bottom: 15px;
  color: ${colors.primary.main};
`;

const ModalText = styled.p`
  margin-bottom: 25px;
  line-height: 1.6;
`;

const VerificationProcess = () => {
  const navigate = useNavigate();
  const { requestVerification, loading } = useCredentialMint();
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState(null);
  const [formError, setFormError] = useState(null);
  const [target, setTarget] = useState({
    targetServiceId: '',
    testInput: ''
  });

  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (loading) {
      setElapsedSec(0);
      timerRef.current = setInterval(() => setElapsedSec(s => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading]);

  const handleNextStep = () => setCurrentStep(currentStep + 1);
  const handlePrevStep = () => setCurrentStep(currentStep - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarget({ ...target, [name]: value });
  };

  const handleSubmit = async () => {
    setFormError(null);
    const response = await requestVerification({
      targetServiceId: target.targetServiceId.trim(),
      testInput: target.testInput.trim() || undefined
    });

    if (response.success) {
      setReport(response.report);
      setShowModal(true);
    } else {
      setFormError(response.error || 'Verification request failed');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (report) {
      navigate(`/result?id=${report.id}`);
    }
  };

  return (
    <VerificationContainer>
      <h1>Verify an Agent</h1>

      <StepIndicator>
        <Step $active={currentStep === 1}>Target Service</Step>
        <Step $active={currentStep === 2}>Test Input</Step>
        <Step $active={currentStep === 3}>Review & Submit</Step>
      </StepIndicator>

      <StepContent>
        {currentStep === 1 && (
          <>
            <h2>Target Service</h2>
            <p>Enter the serviceId of the CAP agent you want CredentialMint to benchmark and verify.</p>

            <FormGroup>
              <label htmlFor="targetServiceId">Service ID</label>
              <input
                type="text"
                id="targetServiceId"
                name="targetServiceId"
                placeholder="e.g. d9295193-b39c-4d52-adf1-264216ddd82a"
                value={target.targetServiceId}
                onChange={handleInputChange}
                required
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#757575' }}>
                Paste the raw serviceId only — no prefix, no surrounding whitespace.
              </small>
              <small style={{ display: 'block', marginTop: '5px', color: colors.warning.main }}>
                Make sure the backend (`pnpm run server`) is running on port 4000, or this request will fail.
              </small>
            </FormGroup>

            <ButtonContainer>
              <div></div>
              <button
                className="btn"
                onClick={handleNextStep}
                disabled={!target.targetServiceId}
              >
                Next
              </button>
            </ButtonContainer>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2>Test Input (optional)</h2>
            <p>
              Provide the JSON requirements CredentialMint should submit to the target service for
              this benchmark order. Leave blank to send an empty request.
            </p>

            <FormGroup>
              <label htmlFor="testInput">Requirements JSON</label>
              <textarea
                id="testInput"
                name="testInput"
                placeholder='{"task": "analyze data"}'
                value={target.testInput}
                onChange={handleInputChange}
              />
            </FormGroup>

            <ButtonContainer>
              <button className="btn" onClick={handlePrevStep} style={{ backgroundColor: '#757575' }}>
                Previous
              </button>
              <button className="btn" onClick={handleNextStep}>
                Next
              </button>
            </ButtonContainer>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2>Review & Submit</h2>
            <p>CredentialMint will negotiate, pay, and score a real CAP order against this service.</p>

            <div className="card" style={{ marginBottom: '20px' }}>
              <h3>Verification Request</h3>
              <p><strong>Target Service ID:</strong> {target.targetServiceId}</p>
              <p><strong>Test Input:</strong> {target.testInput || '(none — empty requirements)'}</p>
            </div>

            <p style={{ marginBottom: '20px' }}>
              By clicking "Submit for Verification", CredentialMint will place a paid CAP order
              against this service and issue a signed skill credential once delivery completes.
            </p>

            {formError && (
              <p style={{ color: colors.error.main, marginBottom: '20px' }}>{formError}</p>
            )}

            {loading && (
              <p style={{ color: colors.text.secondary, fontSize: '0.85rem', marginBottom: '20px' }}>
                Placing a real CAP order — negotiate → pay → wait for the target agent to deliver.
                This is genuine on-chain settlement, typically 1–3 minutes, not a stuck request.
                Elapsed: <strong>{elapsedSec}s</strong>
              </p>
            )}

            <ButtonContainer>
              <button className="btn" onClick={handlePrevStep} style={{ backgroundColor: '#757575' }} disabled={loading}>
                Previous
              </button>
              <button
                className="btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? `Benchmarking... ${elapsedSec}s` : 'Submit for Verification'}
              </button>
            </ButtonContainer>
          </>
        )}
      </StepContent>

      {showModal && report && (
        <ModalOverlay>
          <ModalContent>
            <ModalIcon>{report.verified ? <IconCheck size={48} /> : <IconWarning size={48} />}</ModalIcon>
            <ModalTitle>
              {report.verified ? 'Skill Credential Issued' : 'Verification Below Threshold'}
            </ModalTitle>
            <ModalText>
              CredentialMint scored the target service at <strong>{report.score}/100</strong>.
              <br /><br />
              The order settled on-chain and the signed report is now available in your dashboard.
            </ModalText>
            <button className="btn" onClick={handleCloseModal}>
              View Report
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </VerificationContainer>
  );
};

export default VerificationProcess;
