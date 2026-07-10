import React, { createContext, useState , useContext } from 'react';
import axios from 'axios';

// Create context
const HederaContext = createContext();

// Provider component
export const HederaProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect to Hedera through ElizaOS plugin
  const connectToHedera = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call to ElizaOS
      const response = await axios.post('/api/hedera/connect');
      
      if (response.data.success) {
        setIsConnected(true);
        setAccountId(response.data.accountId);
        setBalance(response.data.balance);
      } else {
        setError('Failed to connect to Hedera');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to Hedera');
    } finally {
      setLoading(false);
    }
  };

  // Store verification result on Hedera
  const storeVerificationResult = async (verificationData) => {
    try {
      setLoading(true);
      // This would be replaced with actual API call to ElizaOS
      const response = await axios.post('/api/hedera/store-verification', verificationData);
      
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred while storing verification result');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Retrieve verification result from Hedera
  const getVerificationResult = async (verificationId) => {
    try {
      setLoading(true);
      // This would be replaced with actual API call to ElizaOS
      const response = await axios.get(`/api/hedera/verification/${verificationId}`);
      
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred while retrieving verification result');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  // Value object to be provided to consumers
  const value = {
    isConnected,
    accountId,
    balance,
    loading,
    error,
    connectToHedera,
    storeVerificationResult,
    getVerificationResult,
    clearError
  };

  return (
    <HederaContext.Provider value={value}>
      {children}
    </HederaContext.Provider>
  );
};

// Custom hook for using the Hedera context
export const useHedera = () => {
  const context = useContext(HederaContext);
  if (context === undefined) {
    throw new Error('useHedera must be used within a HederaProvider');
  }
  return context;
}; 