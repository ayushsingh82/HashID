import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useHedera } from '../context/HederaContext';

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, #3949ab 0%, #5c6bc0 100%);
  color: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #3949ab;
`;

const StatLabel = styled.div`
  color: #757575;
  font-size: 0.9rem;
`;

const TabContainer = styled.div`
  margin-bottom: 30px;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.active ? '#3949ab' : '#757575'};
  border-bottom: ${props => props.active ? '2px solid #3949ab' : 'none'};
  margin-bottom: -1px;
  
  &:hover {
    color: #3949ab;
  }
`;

const TabContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const VerificationHistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    background-color: #f5f7fa;
    font-weight: 500;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  background-color: ${props => 
    props.status === 'approved' ? '#e8f5e9' : 
    props.status === 'pending' ? '#fff8e1' : '#ffebee'};
  color: ${props => 
    props.status === 'approved' ? '#2e7d32' : 
    props.status === 'pending' ? '#f57f17' : '#c62828'};
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, accountId } = useHedera();
  const [activeTab, setActiveTab] = useState('verifications');
  const [verifications, setVerifications] = useState([]);
  
  useEffect(() => {
    // Redirect if not connected
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    // Mock data for demonstration
    setVerifications([
      {
        id: 'ver-123456',
        timestamp: '2023-11-15T10:30:00Z',
        status: 'approved',
        transactionId: '0.0.12345@1234567890.000000000',
        expiryDate: '2024-11-15T10:30:00Z'
      },
      {
        id: 'ver-123457',
        timestamp: '2023-10-20T14:45:00Z',
        status: 'pending',
        transactionId: '0.0.12345@1234567891.000000000'
      },
      {
        id: 'ver-123458',
        timestamp: '2023-09-05T09:15:00Z',
        status: 'failed',
        transactionId: '0.0.12345@1234567892.000000000',
        reason: 'ID document not readable'
      }
    ]);
  }, [isConnected, navigate]);
  
  return (
    <DashboardContainer>
      <WelcomeCard>
        <h1>Welcome to Your Dashboard</h1>
        <p>Account ID: {accountId}</p>
        <p>Manage your identity verifications and view your verification history.</p>
      </WelcomeCard>
      
      <StatsGrid>
        <StatCard>
          <StatValue>3</StatValue>
          <StatLabel>Total Verifications</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>1</StatValue>
          <StatLabel>Approved</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>1</StatValue>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>1</StatValue>
          <StatLabel>Failed</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'verifications'} 
            onClick={() => setActiveTab('verifications')}
          >
            Verification History
          </TabButton>
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </TabButton>
        </TabButtons>
        
        <TabContent>
          {activeTab === 'verifications' && (
            <>
              <h2>Verification History</h2>
              {verifications.length > 0 ? (
                <VerificationHistoryTable>
                  <thead>
                    <tr>
                      <th>Verification ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Transaction ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map(verification => (
                      <tr key={verification.id}>
                        <td>{verification.id}</td>
                        <td>{new Date(verification.timestamp).toLocaleString()}</td>
                        <td>
                          <StatusBadge status={verification.status}>
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                          </StatusBadge>
                        </td>
                        <td>
                          <a 
                            href={`https://hashscan.io/testnet/transaction/${verification.transactionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {verification.transactionId.substring(0, 10)}...
                          </a>
                        </td>
                        <td>
                          <button 
                            className="btn" 
                            onClick={() => navigate(`/result?id=${verification.id}`)}
                            style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </VerificationHistoryTable>
              ) : (
                <p>No verification history found.</p>
              )}
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="btn" onClick={() => navigate('/verify')}>
                  Start New Verification
                </button>
              </div>
            </>
          )}
          
          {activeTab === 'settings' && (
            <>
              <h2>Account Settings</h2>
              <p>Manage your account settings and preferences.</p>
              
              <div style={{ marginTop: '20px' }}>
                <h3>Notification Preferences</h3>
                <div style={{ marginBottom: '10px' }}>
                  <input type="checkbox" id="emailNotifications" />
                  <label htmlFor="emailNotifications" style={{ marginLeft: '10px' }}>
                    Email notifications for verification status updates
                  </label>
                </div>
                <div>
                  <input type="checkbox" id="smsNotifications" />
                  <label htmlFor="smsNotifications" style={{ marginLeft: '10px' }}>
                    SMS notifications for verification status updates
                  </label>
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <h3>Privacy Settings</h3>
                <div style={{ marginBottom: '10px' }}>
                  <input type="checkbox" id="dataSharing" />
                  <label htmlFor="dataSharing" style={{ marginLeft: '10px' }}>
                    Allow sharing of verification status with third-party applications
                  </label>
                </div>
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="btn">
                  Save Settings
                </button>
              </div>
            </>
          )}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
};

export default Dashboard; 