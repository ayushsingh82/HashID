import React, { createContext, useState, useContext } from 'react';
import credentialMintService from '../services/CredentialMintService';

const CredentialMintContext = createContext();

export const CredentialMintProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestVerification = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await credentialMintService.requestVerification(payload);
      if (!response.success) {
        setError(response.error || 'Failed to request verification');
      }
      return response;
    } catch (err) {
      const message = err.message || 'An error occurred while requesting verification';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getVerificationReport = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await credentialMintService.getVerificationReport(reportId);
      if (!response.success) {
        setError(response.error || 'Failed to retrieve verification report');
      }
      return response;
    } catch (err) {
      const message = err.message || 'An error occurred while retrieving the verification report';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    loading,
    error,
    requestVerification,
    getVerificationReport,
    clearError,
  };

  return (
    <CredentialMintContext.Provider value={value}>
      {children}
    </CredentialMintContext.Provider>
  );
};

export const useCredentialMint = () => {
  const context = useContext(CredentialMintContext);
  if (context === undefined) {
    throw new Error('useCredentialMint must be used within a CredentialMintProvider');
  }
  return context;
};
