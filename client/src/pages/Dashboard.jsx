import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../theme';
import credentialMintService from '../services/CredentialMintService';
import { IconCopy, IconCheckSmall } from '../components/icons';

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  font-size: 0.9rem;

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.85rem;
  }
`;

const WelcomeCard = styled.div`
  background: white;
  border: 1px solid ${colors.grey[200]};
  border-radius: 8px;
  padding: 24px 30px;
  margin-bottom: 24px;

  h1 {
    margin-bottom: 6px;
  }

  p {
    margin-bottom: 0;
    color: ${colors.text.secondary};
  }
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
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 6px;
  color: ${colors.primary.main};
`;

const StatLabel = styled.div`
  color: #757575;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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
  min-width: 720px;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 0.85rem;

  th:nth-child(1), td:nth-child(1) { width: 18%; }
  th:nth-child(2), td:nth-child(2) { width: 20%; }
  th:nth-child(3), td:nth-child(3) { width: 20%; }
  th:nth-child(4), td:nth-child(4) { width: 16%; }
  th:nth-child(5), td:nth-child(5) { width: 18%; }
  th:nth-child(6), td:nth-child(6) { width: 8%; }

  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${colors.grey[200]};
    white-space: nowrap;
  }

  th {
    background-color: #f0fdf4;
    color: ${colors.primary.dark};
    font-weight: 600;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  tbody tr {
    transition: background-color 0.15s;
  }

  tbody tr:hover {
    background-color: #fafffb;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const IdCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.82rem;
  color: ${colors.text.secondary};
`;

const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: ${props => (props.copied ? colors.primary.main : colors.grey[400])};
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.15s, background-color 0.15s;

  &:hover {
    color: ${colors.primary.main};
    background-color: ${colors.grey[100]};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => (props.verified ? '#e8f5e9' : '#ffebee')};
  color: ${props => (props.verified ? '#2e7d32' : '#c62828')};
`;

const truncateId = (id) => (id && id.length > 14 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id);

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedId(value);
    setTimeout(() => setCopiedId(current => (current === value ? null : current)), 1500);
  };

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
                    <td>
                      <IdCell title={report.id}>
                        {truncateId(report.id)}
                        <CopyButton
                          copied={copiedId === report.id}
                          onClick={() => handleCopy(report.id)}
                          aria-label="Copy report ID"
                        >
                          {copiedId === report.id ? <IconCheckSmall size={14} /> : <IconCopy size={14} />}
                        </CopyButton>
                      </IdCell>
                    </td>
                    <td>
                      <IdCell title={report.targetServiceId}>
                        {truncateId(report.targetServiceId)}
                        <CopyButton
                          copied={copiedId === report.targetServiceId}
                          onClick={() => handleCopy(report.targetServiceId)}
                          aria-label="Copy service ID"
                        >
                          {copiedId === report.targetServiceId ? <IconCheckSmall size={14} /> : <IconCopy size={14} />}
                        </CopyButton>
                      </IdCell>
                    </td>
                    <td>{new Date(report.verifiedAt).toLocaleString()}</td>
                    <td>
                      <StatusBadge verified={report.verified}>
                        {report.verified ? 'Verified' : 'Failed'} · {report.score}
                      </StatusBadge>
                    </td>
                    <td>
                      <IdCell title={report.orderId}>
                        {truncateId(report.orderId)}
                        <CopyButton
                          copied={copiedId === report.orderId}
                          onClick={() => handleCopy(report.orderId)}
                          aria-label="Copy order ID"
                        >
                          {copiedId === report.orderId ? <IconCheckSmall size={14} /> : <IconCopy size={14} />}
                        </CopyButton>
                      </IdCell>
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => navigate(`/result?id=${report.id}`)}
                        style={{ padding: '5px 10px', fontSize: '0.82rem' }}
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
