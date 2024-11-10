import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Top } from './pages/Top/Top';
import { Index } from './pages/Index/Index';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import useAuthenticate from './hooks/useAuthenticate';

import './App.css';
import { UserInfoProvider } from './contexts/UserInfoContext';


function App() {
  const { user, reAuthenticate } = useAuthenticate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      await reAuthenticate(token);
    }
    fetchUser();
    
  }, []);

  return (
    <UserInfoProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/todos" element={<Index />} />
      </Routes>
      <Footer />
    </UserInfoProvider>
  );
};

export default App;
