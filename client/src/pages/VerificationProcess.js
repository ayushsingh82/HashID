import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { useHedera } from '../context/HederaContext';

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
  background-color: ${props => props.active ? '#3949ab' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#757575'};
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
  justify-content: space-between;
  margin-top: 20px;
`;

const WebcamContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const CapturedImage = styled.img`
  max-width: 100%;
  border-radius: 4px;
  margin-top: 20px;
`;

const FileUpload = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 4px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.3s;
  
  &:hover {
    border-color: #3949ab;
  }
  
  input {
    display: none;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 16px;
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
  color: #3949ab;
`;

const ModalTitle = styled.h2`
  margin-bottom: 15px;
  color: #3949ab;
`;

const ModalText = styled.p`
  margin-bottom: 25px;
  line-height: 1.6;
`;

const VerificationProcess = () => {
  const navigate = useNavigate();
  const { storeVerificationResult, loading } = useHedera();
  const [currentStep, setCurrentStep] = useState(1);
  const [selfieImage, setSelfieImage] = useState(null);
  const [idImage, setIdImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    idNumber: '',
    idType: 'passport',
    hederaId: ''
  });
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelfieImage(imageSrc);
  };
  
  const retakeSelfie = () => {
    setSelfieImage(null);
  };
  
  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveId = () => {
    setIdImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value
    });
  };
  
  const handleSubmit = async () => {
    // In a real implementation, this would call the verification service
    // and store the result on Hedera
    
    // For demo purposes, we'll just show a success modal
    setTimeout(() => {
      setShowModal(true);
    }, 1500);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <VerificationContainer>
      <h1>Identity Verification</h1>
      
      <StepIndicator>
        <Step active={currentStep === 1}>Take Selfie</Step>
        <Step active={currentStep === 2}>Upload ID</Step>
        <Step active={currentStep === 3}>Personal Info</Step>
        <Step active={currentStep === 4}>Review & Submit</Step>
      </StepIndicator>
      
      <StepContent>
        {currentStep === 1 && (
          <>
            <h2>Take a Selfie</h2>
            <p>Please take a clear photo of your face. Make sure your face is well-lit and centered in the frame.</p>
            
            <WebcamContainer>
              {!selfieImage ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 500,
                      height: 375,
                      facingMode: "user"
                    }}
                    style={{ borderRadius: '4px', marginBottom: '20px' }}
                  />
                  <button className="btn" onClick={captureSelfie}>
                    Capture Photo
                  </button>
                </>
              ) : (
                <>
                  <CapturedImage src={selfieImage} alt="Selfie" />
                  <button 
                    className="btn" 
                    onClick={retakeSelfie}
                    style={{ marginTop: '20px' }}
                  >
                    Retake Photo
                  </button>
                </>
              )}
            </WebcamContainer>
            
            <ButtonContainer>
              <div></div> {/* Empty div for spacing */}
              <button 
                className="btn" 
                onClick={handleNextStep} 
                disabled={!selfieImage}
              >
                Next
              </button>
            </ButtonContainer>
          </>
        )}
        
        {currentStep === 2 && (
          <>
            <h2>Upload ID Document</h2>
            <p>Please upload a clear photo of your government-issued ID document (passport, driver's license, or national ID card).</p>
            
            {!idImage ? (
              <FileUpload onClick={() => fileInputRef.current.click()}>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleIdUpload} 
                />
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📄</div>
                  <p>Click to upload your ID document</p>
                  <p style={{ fontSize: '0.9rem', color: '#757575' }}>
                    Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              </FileUpload>
            ) : (
              <>
                <CapturedImage src={idImage} alt="ID Document" />
                <button 
                  className="btn" 
                  onClick={handleRemoveId}
                  style={{ marginTop: '20px', marginBottom: '20px' }}
                >
                  Remove and Upload Again
                </button>
              </>
            )}
            
            <ButtonContainer>
              <button className="btn" onClick={handlePrevStep} style={{ backgroundColor: '#757575' }}>
                Previous
              </button>
              <button 
                className="btn" 
                onClick={handleNextStep} 
                disabled={!idImage}
              >
                Next
              </button>
            </ButtonContainer>
          </>
        )}
        
        {currentStep === 3 && (
          <>
            <h2>Personal Information</h2>
            <p>Please enter your personal details exactly as they appear on your ID document.</p>
            
            <FormGroup>
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={personalInfo.fullName} 
                onChange={handleInputChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth" 
                value={personalInfo.dateOfBirth} 
                onChange={handleInputChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="idType">ID Type</label>
              <select 
                id="idType" 
                name="idType" 
                value={personalInfo.idType} 
                onChange={handleInputChange} 
                required
              >
                <option value="passport">Passport</option>
                <option value="driverLicense">Driver's License</option>
                <option value="nationalId">National ID Card</option>
              </select>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="idNumber">ID Number</label>
              <input 
                type="text" 
                id="idNumber" 
                name="idNumber" 
                value={personalInfo.idNumber} 
                onChange={handleInputChange} 
                required 
              />
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="hederaId">Hedera Account ID</label>
              <input 
                type="text" 
                id="hederaId" 
                name="hederaId" 
                placeholder="0.0.XXXXXX"
                value={personalInfo.hederaId} 
                onChange={handleInputChange} 
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#757575' }}>
                Your Hedera account ID for receiving verification credentials (optional)
              </small>
            </FormGroup>
            
            <ButtonContainer>
              <button className="btn" onClick={handlePrevStep} style={{ backgroundColor: '#757575' }}>
                Previous
              </button>
              <button 
                className="btn" 
                onClick={handleNextStep} 
                disabled={!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.idNumber}
              >
                Next
              </button>
            </ButtonContainer>
          </>
        )}
        
        {currentStep === 4 && (
          <>
            <h2>Review & Submit</h2>
            <p>Please review your information before submitting for verification.</p>
            
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3>Personal Information</h3>
              <p><strong>Full Name:</strong> {personalInfo.fullName}</p>
              <p><strong>Date of Birth:</strong> {personalInfo.dateOfBirth}</p>
              <p><strong>ID Type:</strong> {personalInfo.idType.charAt(0).toUpperCase() + personalInfo.idType.slice(1)}</p>
              <p><strong>ID Number:</strong> {personalInfo.idNumber}</p>
              {personalInfo.hederaId && <p><strong>Hedera Account ID:</strong> {personalInfo.hederaId}</p>}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <h3>Selfie</h3>
                <CapturedImage src={selfieImage} alt="Selfie" style={{ height: '200px', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3>ID Document</h3>
                <CapturedImage src={idImage} alt="ID Document" style={{ height: '200px', objectFit: 'cover' }} />
              </div>
            </div>
            
            <p style={{ marginBottom: '20px' }}>
              By clicking "Submit for Verification", you confirm that the information provided is accurate and consent to the processing of your data for identity verification purposes.
            </p>
            
            <ButtonContainer>
              <button className="btn" onClick={handlePrevStep} style={{ backgroundColor: '#757575' }}>
                Previous
              </button>
              <button 
                className="btn" 
                onClick={handleSubmit} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit for Verification'}
              </button>
            </ButtonContainer>
          </>
        )}
      </StepContent>
      
      {/* Confirmation Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalIcon>✅</ModalIcon>
            <ModalTitle>Verification Request Submitted</ModalTitle>
            <ModalText>
              Thank you for submitting your verification request. Your information has been securely stored on the Hedera network.
              <br /><br />
              Our team will review your submission and update you on the status. This typically takes 24-48 hours.
              <br /><br />
              {personalInfo.hederaId && 
                `A confirmation has been sent to your Hedera account ID (${personalInfo.hederaId}).`}
            </ModalText>
            <button className="btn" onClick={handleCloseModal}>
              Return to Home
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </VerificationContainer>
  );
};

export default VerificationProcess; 