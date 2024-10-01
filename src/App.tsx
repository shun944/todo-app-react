import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Top } from './pages/Top/Top';
import { Index } from './pages/Index/Index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import './App.css';
import { UserInfoProvider } from './contexts/UserInfoContext';

function App() {
  return (
    <UserInfoProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/test" element={<Index />} />
        </Routes>
        <Footer />
      </Router>
    </UserInfoProvider>
  );
};

export default App;
