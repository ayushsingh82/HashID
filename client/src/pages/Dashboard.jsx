import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme';
import credentialMintService from '../services/CredentialMintService';

const DashboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const WelcomeCard = styled.div`
  background: white;
  border: 1px solid ${colors.grey[200]};
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
  color: ${colors.primary.main};
`;

const StatLabel = styled.div`
  color: #757575;
  font-size: 0.9rem;
`;

const TabContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const ReportsTable = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
  }

  th {
    background-color: #f0fdf4;
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
  background-color: ${props => (props.verified ? '#e8f5e9' : '#ffebee')};
  color: ${props => (props.verified ? '#2e7d32' : '#c62828')};
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    credentialMintService.listReports().then((data) => {
      if (!cancelled) {
        setReports(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const verifiedCount = reports.filter(r => r.verified).length;
  const failedCount = reports.length - verifiedCount;
  const avgScore = reports.length
    ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)
    : 0;

  return (
    <DashboardContainer>
      <WelcomeCard>
        <h1>Verification Reports</h1>
        <p>Every skill credential CredentialMint has issued in this session.</p>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatValue>{reports.length}</StatValue>
          <StatLabel>Total Reports</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{verifiedCount}</StatValue>
          <StatLabel>Verified</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{failedCount}</StatValue>
          <StatLabel>Failed</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{avgScore}</StatValue>
          <StatLabel>Avg. Score</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabContent>
        <h2>Report History</h2>
        {loading ? (
          <p>Loading reports from CredentialMint...</p>
        ) : reports.length > 0 ? (
          <TableScroll>
            <ReportsTable>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Target Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>CAP Order ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.targetServiceId}</td>
                    <td>{new Date(report.verifiedAt).toLocaleString()}</td>
                    <td>
                      <StatusBadge verified={report.verified}>
                        {report.verified ? 'Verified' : 'Failed'} · {report.score}
                      </StatusBadge>
                    </td>
                    <td>{report.orderId}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => navigate(`/result?id=${report.id}`)}
                        style={{ padding: '5px 10px', fontSize: '0.9rem' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ReportsTable>
          </TableScroll>
        ) : (
          <p>No verification reports yet. Reports appear here once CredentialMint's server has settled a real CAP order.</p>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="btn" onClick={() => navigate('/verify')}>
            Verify a New Agent
          </button>
        </div>
      </TabContent>
    </DashboardContainer>
  );
};

export default Dashboard;
