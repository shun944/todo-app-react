import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import useAuthenticate from './hooks/useAuthenticate';

import './App.css';
import { useLocation } from 'react-router-dom';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

function App() {
  const { reAuthenticate } = useAuthenticate();
  const location = useLocation();
  const state = location.state as { message: string };
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (state?.message) {
      setMessage(state.message);
    }
  }, [state])

  return (
    <>
      <Header />
      {message && (
        <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>
          {message}
        </Alert>
      )}
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
