import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import VerificationProcess from './pages/VerificationProcess';
import VerificationResult from './pages/VerificationResult';
import Dashboard from './pages/Dashboard';
import { HederaProvider } from './context/HederaContext';

function App() {
  return (
    <HederaProvider>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<VerificationProcess />} />
            <Route path="/result" element={<VerificationResult />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HederaProvider>
  );
}

export default App; 